<h1 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin-bottom: 0.4em;">
Fluxion: The Tiny UI Engine That Refuses to Be Heavy
</h1>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7; margin-top: 0;">
Before frameworks were megabytes of JavaScript, before build configs became novels, there was a simple idea:
<strong>what if UI was just functions and HTML</strong>? Fluxion is a lightweight JavaScript UI micro‑framework that
dares to ask that question again — in a world dominated by giants like React.
</p>

<h2 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin-top: 1.4em;">
Why Fluxion exists
</h2>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7;">
Modern UI stacks are powerful, but they come with a cost: bundlers, transpilers, virtual DOM diffing engines,
dependency forests, and upgrade paths that feel like boss fights. Fluxion is built on a different philosophy:
<strong>the browser is already powerful, JavaScript is already expressive — so use them directly</strong>.
</p>

<ul style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7;">
<li><strong>No virtual DOM.</strong> Fluxion doesn’t pretend to be the browser — it just builds the HTML you ask for.</li>
<li><strong>No component classes or hooks.</strong> Your “components” are just plain functions with a special return syntax.</li>
<li><strong>No heavyweight runtime.</strong> The core is intentionally small, readable, and easy to understand.</li>
</ul>

<h2 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin-top: 1.4em;">
The Fluxion way: functions, tags, and lore
</h2>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7;">
In Fluxion, you don’t write JSX or templates that need an entire ecosystem to understand them. You write <strong>normal
JavaScript functions</strong>, and inside them you whisper to Fluxion with a tiny, strange spell:
</p>

<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; background: #0b1020; color: #f5f5f5; padding: 0.85em; border-radius: 6px; font-size: 0.9em; overflow-x: auto;">
function HeroTag() {
Fluxion.return[=
&lt;section>
&lt;h1>Welcome to Fluxion&lt;/h1>
&lt;p>Lightweight. Opinionated. A little rebellious.&lt;/p>
&lt;/section>
=]
}
</pre>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7;">
Fluxion watches these functions, verifies they return exactly one root tag, and registers them as global tags with
names like <code>HeroTag</code>. No decorators, no metadata, no secret class hierarchies — just functions.
</p>

<h2 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin-top: 1.4em;">
Placeholders that actually think
</h2>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7;">
React has props and state. Fluxion has something more primitive and more flexible:
<strong>placeholders that can execute real JavaScript</strong>. They’re defined once and woven through your UI using
a lightweight, triple‑brace syntax:
</p>

<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; background: #0b1020; color: #f5f5f5; padding: 0.85em; border-radius: 6px; font-size: 0.9em; overflow-x: auto;">
function AppState() {
Fluxion.let[=
user = "Rudra"
tagline = () => "Building UIs without bowing to bloat..."
year = () => new Date().getFullYear()
=]
}

function FooterTag() {
Fluxion.return[=
&lt;footer>
&lt;p>{{{tagline}}}&lt;/p>
&lt;small>© {{{year}}} {{{user}}}'s Fluxion&lt;/small>
&lt;/footer>
=]
}
</pre>

<ul style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7;">
<li><strong>Values are placeholders.</strong> Use <code>{{{user}}}</code> and Fluxion swaps in the value.</li>
<li><strong>Functions are brains.</strong> Use <code>{{{year}}}</code> and Fluxion calls the function and prints the result.</li>
<li>No hook rules, no magic closure behavior — just plain JS.</li>
</ul>

<h2 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin-top: 1.4em;">
Composition without ceremony
</h2>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7;">
React has components inside components inside components. Fluxion answers with a smaller, sharper idea:
<strong>tags with children</strong>. Any tag can expose a special <code>{{{child}}}</code> slot, and you can inject
one or more tags into it using a compact syntax:
</p>

<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; background: #0b1020; color: #f5f5f5; padding: 0.85em; border-radius: 6px; font-size: 0.9em; overflow-x: auto;">
function LayoutTag() {
Fluxion.return[=
&lt;div class="layout">
{{{child}}}
&lt;/div>
=]
}

function HeaderTag() {
Fluxion.return[=
&lt;header>&lt;h1>Fluxion vs The World&lt;/h1>&lt;/header>
=]
}

function ContentTag() {
Fluxion.return[=
&lt;main>&lt;p>A tiny engine with big opinions.&lt;/p>&lt;/main>
=]
}

function UI() {
Fluxion.inject[=
&lt;!DOCTYPE html>
&lt;html>
&lt;body>
LayoutTag[=HeaderTag, ContentTag=]
&lt;/body>
&lt;/html>
=]
}
</pre>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7;">
No JSX, no custom DSL in your HTML file. Just Fluxion’s ultra‑compact composition syntax, expanded by a compiler that
stays out of your way.
</p>

<h2 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin-top: 1.4em;">
Fluxion vs React: different battles, different weapons
</h2>

<ul style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7;">
<li><strong>React is an ecosystem.</strong> Fluxion is a scalpel — small, sharp, and focused.</li>
<li><strong>React needs bundlers.</strong> Fluxion compiles to plain JavaScript modules, ready for the browser.</li>
<li><strong>React has a virtual DOM.</strong> Fluxion writes the HTML you define, directly and intentionally.</li>
<li><strong>React has hooks, context, and effects.</strong> Fluxion gives you functions and placeholders and lets you build patterns on top.</li>
</ul>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7;">
Fluxion isn’t trying to be React. It’s a quiet rival — the small framework you reach for when you want power without
heaviness, control without ceremony, and a codebase you can read in one sitting.
</p>

<h2 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin-top: 1.4em;">
The lore: built for people who hate giving up control
</h2>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7;">
Fluxion was born from a simple frustration: <em>why do I need a whole toolchain just to put some dynamic HTML on a
page?</em> Instead of surrendering to complexity, Fluxion carves its own path:
</p>

<ul style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7;">
<li><strong>Every construct is visible.</strong> No hidden lifecycle. No invisible renders.</li>
<li><strong>The compiler is tiny.</strong> You can read how the syntax transforms in a single file.</li>
<li><strong>The runtime is honest.</strong> It doesn’t try to be smarter than you — it does exactly what you ask.</li>
</ul>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7;">
It’s the kind of framework you can fork, tweak, and fully understand — the opposite of a mysterious black box.
</p>

<h2 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin-top: 1.4em;">
Try Fluxion if...
</h2>

<ul style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7;">
<li>You like React’s component idea but hate the bloat around it.</li>
<li>You want to inspect every layer of your UI stack and actually understand it.</li>
<li>You believe HTML, CSS, and JavaScript are enough — with just a tiny nudge.</li>
<li>You’re curious what a homegrown, handcrafted framework feels like compared to the industry giants.</li>
</ul>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7; margin-top: 1.4em;">
Fluxion is not here to replace React for everyone. It’s here for the people who look at a massive dependency tree and
quietly think: <em>there has to be another way</em>.
</p>

<p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-weight: 600; margin-top: 1.2em;">
If that’s you, Fluxion is waiting — small, sharp, and ready to build something that actually feels like yours.
</p>
