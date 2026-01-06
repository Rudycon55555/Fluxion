function ATag() {
    Fluxion.return[=
<p>A</p>
=]
}

function BTag() {
    Fluxion.return[=
<p>B</p>
=]
}

function CTag() {
    Fluxion.return[=
<p>C</p>
=]
}

function ContainerTag() {
    Fluxion.return[=
<div>{{{child}}}</div>
=]
}

function UI() {
    Fluxion.inject[=
<!DOCTYPE html>
<html>
<body>
ContainerTag[=ATag, BTag, CTag=]
</body>
</html>
=]
}

UI();
