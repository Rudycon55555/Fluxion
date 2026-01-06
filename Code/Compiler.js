// Code/Compiler.js

import fs from "fs";
import path from "path";
import url from "url";

// For CLI usage: node Code/Compiler.js input.fluxion.js output.js
if (import.meta.url === url.pathToFileURL(process.argv[1]).href) {
    const [, , inputPath, outputPath] = process.argv;

    if (!inputPath || !outputPath) {
        console.error("Usage: node Code/Compiler.js input.fluxion.js output.js");
        process.exit(1);
    }

    const source = fs.readFileSync(inputPath, "utf8");
    const compiled = compileFluxion(source);

    fs.writeFileSync(outputPath, compiled, "utf8");
    console.log(`Compiled ${inputPath} -> ${outputPath}`);
}

export function compileFluxion(sourceText) {
    let output = sourceText;

    // 1. Ensure the import line at the very top
    const importLine = `import "https://raw.githubusercontent.com/Rudycon55555/Fluxion/main/Code/Index.js";`;
    if (!output.includes(importLine)) {
        output = importLine + "\n\n" + output;
    }

    // 2. Transform Fluxion.return[= ... =] into Fluxion.return(`...`)
    output = output.replace(/Fluxion\.return

\[\=([\s\S]*?)\=\]

/g, (_, content) => {
        return `Fluxion.return(\`${escapeBackticks(content)}\`)`;
    });

    // 3. Transform Fluxion.let[= ... =] into Fluxion.let(`...`)
    output = output.replace(/Fluxion\.let

\[\=([\s\S]*?)\=\]

/g, (_, content) => {
        return `Fluxion.let(\`${escapeBackticks(content)}\`)`;
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
    // So template literals don't break if user writes ` inside the Fluxion blocks.
    return str.replace(/`/g, "\\`");
}
