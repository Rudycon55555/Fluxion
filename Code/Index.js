// Code/Index.js

export const Fluxion = {
    tags: {},          // functionName -> template string
    placeholders: {},  // name -> value (any JS: string, function, etc.)

    // Called by compiled tag functions:
    // ExampleTag() { return Fluxion.return(`...`); }
    //
    // Responsibilities:
    // 1. Determine the calling function’s name
    // 2. Validate that the template has exactly ONE root HTML tag
    // 3. Register the template under that name
    // 4. Return the template (so the function can also return it)
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

    // Called by compiled placeholder blocks:
    //
    // Fluxion.let[=
    // user = "Rudra"
    // greeting = () => "Hi " + user
    // =]
    //
    // becomes:
    //
    // Fluxion.let(() => {
    //   Fluxion.setPlaceholder("user", "Rudra");
    //   Fluxion.setPlaceholder("greeting", () => "Hi " + user);
    // });
    let(fn) {
        fn(); // run the block that calls setPlaceholder
    },

    // Used by compiled code inside Fluxion.let
    setPlaceholder(name, value) {
        this.placeholders[name] = value;
    },

    // Called by compiled UI:
    // Fluxion.inject(`...UI template...`)
    inject(uiTemplate) {
        let html = uiTemplate;

        // 1. Expand nested tag calls: OuterTag[=ChildA, ChildB=]
        html = this._expandNestedTags(html);

        // 2. Expand simple tag names: ExampleTag
        html = this._expandSimpleTags(html);

        // 3. Substitute placeholders {{{name}}}
        html = this._substitutePlaceholders(html);

        // 4. Inject into the document (browser) or log (Node)
        if (typeof document !== "undefined") {
            document.open();
            document.write(html);
            document.close();
        } else {
            console.log("Fluxion rendered HTML:\n", html);
        }
    },

    // ----------------- Internals -----------------

    _getCallerFunctionName() {
        const err = new Error();
        const stack = err.stack || "";
        const lines = stack.split("\n");

        // Typical stack:
        // [0] "Error"
        // [1] "    at Fluxion.return (Index.js:line:col)"
        // [2] "    at ExampleTag (SomeFile.js:line:col)"
        const callerLine = lines[2] || "";
        const match = callerLine.match(/at\s+([A-Za-z0-9_$]+)\s*\(/);
        return match ? match[1] : null;
    },

    _ensureSingleRootTag(functionName, template) {
        const cleaned = template
            .replace(/<!DOCTYPE[^>]*>/gi, "")
            .replace(/<!--[\s\S]*?-->/g, "")
            .trim();

        if (!cleaned.startsWith("<")) {
            throw new Error(`Fluxion.return in "${functionName}" must start with an HTML tag.`);
        }

        const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*>/g;
        const stack = [];
        let rootCount = 0;
        let match;

        while ((match = tagRegex.exec(cleaned)) !== null) {
            const full = match[0];
            const name = match[1];
            const isClosing = full.startsWith("</");
            const selfClosing = /\/>$/.test(full);

            if (!isClosing) {
                if (stack.length === 0 && !selfClosing) {
                    rootCount++;
                }
                if (!selfClosing) {
                    stack.push(name);
                }
            } else {
                if (stack.length === 0) {
                    throw new Error(`Unmatched closing tag </${name}> in "${functionName}".`);
                }
                stack.pop();
            }

            if (rootCount > 1) {
                throw new Error(
                    `Fluxion.return in "${functionName}" must have exactly ONE root tag, but multiple roots were detected.`
                );
            }
        }

        if (stack.length !== 0) {
            throw new Error(`Unclosed tag(s) in Fluxion.return of "${functionName}".`);
        }

        if (rootCount === 0) {
            throw new Error(`Fluxion.return in "${functionName}" must contain a root HTML tag.`);
        }
    },

    _expandNestedTags(html) {
        // Pattern: OuterTag[=InnerA, InnerB, InnerC=]
        const nestedTagRegex = /([A-Z][A-Za-z0-9_]*)

\[\=([A-Z0-9_,\s]+)\=\]

/g;

        return html.replace(nestedTagRegex, (_, outerName, innerPart) => {
            const childNames = innerPart
                .split(",")
                .map(n => n.trim())
                .filter(n => n.length > 0);

            const childrenHtml = childNames
                .map(name => this._renderTag(name))
                .join("");

            return this._renderTag(outerName, childrenHtml);
        });
    },

    _expandSimpleTags(html) {
        const self = this;

        return html.replace(/\b([A-Z][A-Za-z0-9_]*)\b/g, function (match, name, offset, full) {
            const before = full.slice(0, offset);

            // Avoid replacing inside HTML tags like <html>, <body>, etc.
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

            // If the placeholder is a function, execute it
            if (typeof value === "function") {
                try {
                    const result = value();
                    return result != null ? String(result) : "";
                } catch (e) {
                    console.error(`Error evaluating placeholder "${name}":`, e);
                    return "";
                }
            }

            // Otherwise, treat it as a simple value
            return value != null ? String(value) : "";
        });
    }
};
