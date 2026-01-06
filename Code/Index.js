// Code/Index.js

export const Fluxion = {
    tags: {},          // functionName -> template string
    placeholders: {},  // name -> value (string)
    
    // Called by compiled tag functions.
    // It:
    // 1. Figures out the calling function's name
    // 2. Validates "ONE TAG ONLY"
    // 3. Registers the tag template
    // 4. Returns the template (so the function can return it)
    return(templateString) {
        const callerName = this._getCallerFunctionName();
        if (!callerName) {
            throw new Error("Fluxion.return() must be called inside a named function");
        }

        const cleaned = templateString.trim();
        this._ensureSingleRootTag(callerName, cleaned);
        this.tags[callerName] = cleaned;
        return cleaned;
    },

    // Called by compiled placeholder definitions:
    // Fluxion.let(`user = ...`)
    let(block) {
        // Example block:
        // user = `
        // fetch('./Example.json')...
        // `
        const lines = block.trim().split("\n");
        const firstLine = lines.shift(); // e.g. "user = `"
        const [rawName, ...rest] = firstLine.split("=");
        const name = rawName.trim();

        // The remaining text (rest + remaining lines) is the value body
        const valueBody = [rest.join("="), ...lines].join("\n").trim();

        // You get to decide: keep backticks or not.
        // For now, we store the raw string (could be code, could be text).
        this.placeholders[name] = valueBody;
    },

    // Called by compiled UI:
    // Fluxion.inject(`...UI template...`)
    inject(uiTemplate) {
        let html = uiTemplate;

        // 1. Expand nested tag calls: TagA[=TagB=]
        html = this._expandNestedTags(html);

        // 2. Expand simple tag names: ExampleTag
        html = this._expandSimpleTags(html);

        // 3. Substitute placeholders {{{name}}}
        html = this._substitutePlaceholders(html);

        // 4. Inject into the document
        if (typeof document !== "undefined") {
            // Replace the whole document
            document.open();
            document.write(html);
            document.close();
        } else {
            // Node or non-browser environment
            console.log("Fluxion rendered HTML:\n", html);
        }
    },

    // ----------------- Internals -----------------

    _getCallerFunctionName() {
        const err = new Error();
        const stack = err.stack || "";
        const lines = stack.split("\n");
        // Usually: [0] "Error"
        //          [1] "    at Fluxion.return (..."
        //          [2] "    at ExampleTag (..."
        const callerLine = lines[2] || "";
        // Try to extract "ExampleTag" from "at ExampleTag (file.js:line:col)"
        const match = callerLine.match(/at\s+([A-Za-z0-9_$]+)\s*\(/);
        return match ? match[1] : null;
    },

    _ensureSingleRootTag(functionName, template) {
        // Very simple check:
        // Count how many top-level tags appear.
        // This is not a full HTML parser, but good enough for v1.

        // Strip doctype and comments
        const cleaned = template
            .replace(/<!DOCTYPE[^>]*>/gi, "")
            .replace(/<!--[\s\S]*?-->/g, "")
            .trim();

        // Find tags like <tag ...> or <tag>
        const tagMatches = cleaned.match(/<([a-zA-Z][^\s/>]*)[\s\S]*?>/g) || [];

        if (tagMatches.length === 0) {
            throw new Error(`Fluxion.return in "${functionName}" must contain exactly ONE root HTML tag, but found none.`);
        }

        // Extremely naive: if more than one opening tag at root, reject.
        if (tagMatches.length > 1) {
            // You could refine this later with nesting checks.
            throw new Error(
                `Fluxion.return in "${functionName}" must return exactly ONE root HTML tag, but seems to have ${tagMatches.length}.`
            );
        }
    },

    _expandNestedTags(html) {
        // Pattern: OuterTag[=InnerTag=]
        const nestedTagRegex = /([A-Z][A-Za-z0-9_]*)

\[\=([A-Z][A-Za-z0-9_]*)\=\]

/g;

        return html.replace(nestedTagRegex, (_, outerName, innerName) => {
            const innerHtml = this._renderTag(innerName);
            return this._renderTag(outerName, innerHtml);
        });
    },

    _expandSimpleTags(html) {
        // Pattern: ExampleTag (capitalized word not inside < >)
        // We must avoid replacing inside HTML tags like <html>, <body>.
        const self = this;

        return html.replace(/\b([A-Z][A-Za-z0-9_]*)\b/g, function (match, name, offset, full) {
            // Ignore inside angle brackets, e.g. "<ExampleTag>" (we expect users to just use names, not <ExampleTag>)
            const before = full.slice(0, offset);
            const insideTag = /<[^>]*$/.test(before) && !/>[^<]*$/.test(before);
            if (insideTag) return match;

            if (self.tags[name]) {
                return self._renderTag(name);
            }
            return match;
        });
    },

    _renderTag(name, childHtml = "") {
        const template = this.tags[name];
        if (!template) {
            throw new Error(`Fluxion tag function "${name}" is not defined.`);
        }

        let html = template;

        // Allow child placeholder {{{child}}}
        html = html.replace(/\{\{\{child\}\}\}/g, childHtml);

        // Substitute placeholders {{{name}}}
        html = this._substitutePlaceholders(html);

        return html;
    },

    _substitutePlaceholders(html) {
        const self = this;
        return html.replace(/\{\{\{([^}]+)\}\}\}/g, (_, key) => {
            const name = key.trim();
            if (name === "child") {
                // child is handled in _renderTag
                return "{{{child}}}";
            }
            const value = self.placeholders[name];
            return value != null ? String(value) : "";
        });
    }
};
