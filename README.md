<h1 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin-bottom: 0.5em;">
Fluxion – A Lightweight JavaScript UI Micro‑Framework
</h1>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; margin-top: 0;">
<strong>Fluxion</strong> is a lightweight JavaScript UI micro‑framework that lets you write UI using a tiny, custom
syntax on top of plain JavaScript. It compiles your Fluxion files into regular client‑side JS and uses a small runtime
to build and inject HTML into the page.
</p>

<h2 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin-top: 1.5em;">
Features
</h2>

<ul style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6;">
<li><strong>Lightweight runtime</strong> – a small, focused core with no external dependencies.</li>
<li><strong>Custom tag syntax</strong> – define UI tags as normal JavaScript functions using <code>Fluxion.return[= ... =]</code>.</li>
<li><strong>Executable placeholders</strong> – define dynamic values and functions with <code>Fluxion.let[= ... =]</code> and use them as <code>{{{name}}}</code>.</li>
<li><strong>Declarative UI inject</strong> – describe your final page with <code>Fluxion.inject[= ... =]</code>, and let Fluxion expand tags into HTML.</li>
<li><strong>Nested tags with children</strong> – compose UI using syntax like <code>ParentTag[=ChildA, ChildB=]</code>.</li>
<li><strong>One-root-tag enforcement</strong> – every tag definition must return exactly one root HTML element.</li>
</ul>

<h2 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin-top: 1.5em;">
Repository structure
</h2>

<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; background: #f5f5f5; padding: 0.75em; border-radius: 4px; overflow-x: auto; font-size: 0.9em;">
Fluxion/
├── Code/
│    ├── Index.js                # Fluxion runtime (tag registry, placeholders, inject)
│    └── Compiler.js          # Fluxion compiler (transforms .fluxion.js to regular JS)
├── Examples/
│    ├── BasicTag.fluxion.js
│    ├── NestedTags.fluxion.js
│    ├── ExecutablePlaceholders.fluxion.js
│    ├── MultipleChildren.fluxion.js
│    └── RealisticApp.fluxion.js
└── README.html                    # This file
</pre>

<h2 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin-top: 1.5em;">
The Fluxion syntax
</h2>

<h3 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin-top: 1.2em;">

Tag definitions with <code>Fluxion.return[= ... =]</code>
</h3>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6;">
Define a tag by writing a named function and using a special <code>Fluxion.return[= ... =]</code> block that contains
exactly one root HTML element:
</p>

<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; background: #f5f5f5; padding: 0.75em; border-radius: 4px; overflow-x: auto; font-size: 0.9em;">
function HelloTag() {
Fluxion.return[=
&lt;h1>Hello, {{{user}}}!&lt;/h1>
=]
}
</pre>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6;">
The compiler transforms this into a call to the Fluxion runtime, which:
</p>

<ul style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6;">
<li>Uses the function name as the tag name (<code>HelloTag</code>).</li>
<li>Verifies that there is exactly one root HTML tag.</li>
<li>Registers the template so it can be used later inside <code>Fluxion.inject</code>.</li>
</ul>

<h3 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin-top: 1.2em;">

Executable placeholders with <code>Fluxion.let[= ... =]</code>
</h3>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6;">
Placeholders let you inject dynamic values into your templates using a simple <code>{{{name}}}</code> syntax. You
define them in a special block:
</p>

<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; background: #f5f5f5; padding: 0.75em; border-radius: 4px; overflow-x: auto; font-size: 0.9em;">
function AppPlaceholders() {
Fluxion.let[=
user = "Rudra"
greeting = () => "Hello " + user + "!"
time = () => new Date().toLocaleTimeString()
=]
}
</pre>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6;">
In templates, placeholders are referenced as:
</p>

<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; background: #f5f5f5; padding: 0.75em; border-radius: 4px; overflow-x: auto; font-size: 0.9em;">
&lt;p>{{{greeting}}} The time is {{{time}}}.&lt;/p>
</pre>

<ul style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6;">
<li>If the placeholder is a value, Fluxion inserts it directly.</li>
<li>If it is a function, Fluxion calls it and inserts the return value.</li>
</ul>

<h3 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin-top: 1.2em;">

Declarative UI injection with <code>Fluxion.inject[= ... =]</code>
</h3>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6;">
Use <code>Fluxion.inject[= ... =]</code> to describe the final HTML structure and where your tags should appear:
</p>

<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; background: #f5f5f5; padding: 0.75em; border-radius: 4px; overflow-x: auto; font-size: 0.9em;">
function UI() {
Fluxion.inject[=
&lt;!DOCTYPE html>
&lt;html>
&lt;head>
&lt;title>Fluxion Demo&lt;/title>
&lt;/head>
&lt;body>
HelloTag
&lt;/body>
&lt;/html>
=]
}
</pre>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6;">
Fluxion scans this template, replaces tag names like <code>HelloTag</code> with the HTML they represent, performs
placeholder substitution, and writes the final HTML into the document.
</p>

<h3 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin-top: 1.2em;">

Nested tags and multiple children
</h3>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6;">
Tags can have a special child placeholder <code>{{{child}}}</code>, and you can supply one or more child tags using
the <code>ParentTag[=ChildA, ChildB, ...=]</code> syntax:
</p>

<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; background: #f5f5f5; padding: 0.75em; border-radius: 4px; overflow-x: auto; font-size: 0.9em;">
function ContainerTag() {
Fluxion.return[=
&lt;div>{{{child}}}&lt;/div>
=]
}

function ATag() {
Fluxion.return[=
&lt;p>A&lt;/p>
=]
}

function BTag() {
Fluxion.return[=
&lt;p>B&lt;/p>
=]
}

function UI() {
Fluxion.inject[=
&lt;!DOCTYPE html>
&lt;html>
&lt;body>
ContainerTag[=ATag, BTag=]
&lt;/body>
&lt;/html>
=]
}
</pre>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6;">
Fluxion renders each child tag, concatenates their HTML, and injects the combined result into <code>{{{child}}}</code>
inside the container.
</p>

<h2 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin-top: 1.5em;">
Compilation workflow
</h2>

<ol style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6;">
<li><strong>Write</strong> your UI in a <code>.fluxion.js</code> file using the Fluxion syntax.</li>
<li><strong>Compile</strong> it to regular JavaScript:
<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; background: #f5f5f5; padding: 0.75em; border-radius: 4px; overflow-x: auto; font-size: 0.9em;">
node Code/Compiler.js Examples/RealisticApp.fluxion.js Examples/RealisticApp.compiled.js
</pre>
</li>
<li><strong>Load</strong> the compiled file in a browser using a module script:
<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; background: #f5f5f5; padding: 0.75em; border-radius: 4px; overflow-x: auto; font-size: 0.9em;">
&lt;script type="module" src="./Examples/RealisticApp.compiled.js">&lt;/script>
</pre>
</li>
</ol>

<h2 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin-top: 1.5em;">
Importing the runtime
</h2>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6;">
Every compiled Fluxion file begins with a lightweight import of the runtime:
</p>

<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; background: #f5f5f5; padding: 0.75em; border-radius: 4px; overflow-x: auto; font-size: 0.9em;">
import "https://raw.githubusercontent.com/Rudycon55555/Fluxion/main/Code/Index.js";
</pre>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6;">
This pulls in the small Fluxion core, which manages tags, placeholders, and page injection.
</p>

<h2 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin-top: 1.5em;">
Philosophy
</h2>

<ul style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6;">
<li><strong>Lightweight</strong> – keep the runtime small and focused.</li>
<li><strong>Simple syntax</strong> – Fluxion adds only a few special constructs on top of JavaScript.</li>
<li><strong>Plain output</strong> – compiled files are just JavaScript modules that run in any modern browser.</li>
<li><strong>Composable</strong> – tags, placeholders, and inject blocks are designed to be combined in many ways.</li>
</ul>

<h2 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin-top: 1.5em;">
Getting started
</h2>

<ol style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6;">
<li>Clone or download this repository.</li>
<li>Make sure you have Node.js  installed for running the compiler.</li>
<li>Create your own <code>.fluxion.js</code> file/</code>.</li>
<li>Compile it with <code>Code/Compiler.js</code>.</li>
<li>Load the compiled script into a simple HTML page and open it in your browser.</li>
</ol>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; margin-top: 1.5em;">
Fluxion is still evolving, but its goal is to stay small, understandable, and fun to hack on.
</p>
