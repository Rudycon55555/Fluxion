function AppPlaceholders() {
    Fluxion.let[=
user = "Rudra"
year = () => new Date().getFullYear()
message = () => "Welcome back, " + user + "!"
=]
}

function HeaderTag() {
    Fluxion.return[=
<header>
    <h1>{{{message}}}</h1>
</header>
=]
}

function ContentTag() {
    Fluxion.return[=
<main>
    <p>This is your Fluxion demo app.</p>
</main>
=]
}

function FooterTag() {
    Fluxion.return[=
<footer>
    <p>© {{{year}}} Fluxion Framework</p>
</footer>
=]
}

function PageTag() {
    Fluxion.return[=
<div class="page">
    {{{child}}}
</div>
=]
}

function UI() {
    Fluxion.inject[=
<!DOCTYPE html>
<html>
<head>
<title>Fluxion App</title>
</head>
<body>
PageTag[=HeaderTag, ContentTag, FooterTag=]
</body>
</html>
=]
}

AppPlaceholders();
UI();
