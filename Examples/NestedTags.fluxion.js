function UserPlaceholder() {
    Fluxion.let[=
user = "Rudra"
=]
}

function HeaderTag() {
    Fluxion.return[=
<header><h1>Welcome, {{{user}}}</h1></header>
=]
}

function FooterTag() {
    Fluxion.return[=
<footer><p>Goodbye, {{{user}}}!</p></footer>
=]
}

function PageTag() {
    Fluxion.return[=
<div>
    {{{child}}}
</div>
=]
}

function UI() {
    Fluxion.inject[=
<!DOCTYPE html>
<html>
<body>
PageTag[=HeaderTag, FooterTag=]
</body>
</html>
=]
}

UserPlaceholder();
UI();
