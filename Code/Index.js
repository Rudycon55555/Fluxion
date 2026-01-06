// Code/Compiler.js
//
// Usage (Node, ESM):
//   node Code/Compiler.js input.fluxion.js output.js
//
// This transforms Fluxion syntax:
//
//   Fluxion.return[= ... =]
//   Fluxion.let[=
//   name = expression
//   other = () => ...
//   =]
//   Fluxion.inject[= ... =]
//
// into valid JS that uses the runtime in Code/Index.js.

import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CLI entry
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    const [, , inputPath, outputPath] = process.argv;

    if (!inputPath || !outputPath) {
        console.error("Usage: node Code/Compiler.js input.fluxion.js output.js");
        process.exit(1);
    }

    const absoluteInput = path.resolve(process.cwd(), inputPath);
    const source = fs.readFileSync(absoluteInput, "utf8");
    const compiled = compileFluxion(source);

    const absoluteOutput = path.resolve(process.cwd(), outputPath);
    fs.writeFileSync(absoluteOutput, compiled, "utf8");
    console.log(`Compiled ${inputPath} -> ${outputPath}`);
}

export function compileFluxion(sourceText) {
    let output = sourceText;

    const importLine = `import "https://raw.githubusercontent.com/Rudycon55555/Fluxion/main/Code/Index.js";`;

    // 1. Ensure the import line at the very top (if not already present)
    if (!output.includes(importLine)) {
        output = importLine + "\n\n" + output;
    }

    // 2. Transform Fluxion.return[= ... =] into Fluxion.return(`...`)
    output = output.replace(/Fluxion\.return

\[\=([\s\S]*?)\=\]

/g, (_, content) => {
        return `Fluxion.return(\`${escapeBackticks(content)}\`)`;
    });

    // 3. Transform Fluxion.let[= ... =] into:
    //
    // Fluxion.let(() => {
    //   Fluxion.setPlaceholder("name", expression);
    //   ...
    // })
    //
    // Each non-empty line inside the block must be "name = expression"
    output = output.replace(/Fluxion\.let

\[\=([\s\S]*?)\=\]

/g, (_, block) => {
        const lines = block
            .split("\n")
            .map(l => l.trim())
            .filter(l => l.length > 0);

        const statements = lines.map(line => {
            const eqIndex = line.indexOf("=");
            if (eqIndex === -1) {
                throw new Error(`Invalid line in Fluxion.let block: "${line}". Expected "name = expression".`);
            }
            const name = line.slice(0, eqIndex).trim();
            const expr = line.slice(eqIndex + 1).trim();
            if (!name) {
                throw new Error(`Missing placeholder name in Fluxion.let block line: "${line}".`);
            }
            if (!expr) {
                throw new Error(`Missing expression for placeholder "${name}" in Fluxion.let block.`);
            }
            return `Fluxion.setPlaceholder("${name}", ${expr});`;
        });

        return `Fluxion.let(() => { ${statements.join(" ")} })`;
    });

    // 4. Transform Fluxion.inject[= ... =] into Fluxion.inject(`...`)
    output = output.replace(/Fluxion\.inject

\[\=([\s\S]*?)\=\]

/g, (_, content) => {
        return `Fluxion.inject(\`${escapeBackticks(content)}\`)`;
    });

    return output;
}

function escapeBackticks(str) {
    // Avoid breaking template literals if user writes ` inside their Fluxion blocks
    return str.replace(/`/g, "\\`");
}
