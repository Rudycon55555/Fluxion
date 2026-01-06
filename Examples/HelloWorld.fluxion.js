function ExamplePlaceholder() {
     Fluxion.let[=
user = `
Rudra
`
=]
}

function ExampleTag() {
     Fluxion.return[=
<h1>EXAMPLE for {{{user}}}</h1>
=]
}

function ExampleTag2() {
     Fluxion.return[=
<div>{{{child}}}</div>
=]
}

function ExampleTag3() {
     Fluxion.return[=
<p>Hello, {{{user}}}!</p>
=]
}

function UI() {
     Fluxion.inject[=
<!DOCTYPE html>
<html>
<head>
<title>Hello!</title>
</head>
<body>
ExampleTag
ExampleTag2[=ExampleTag3=]
</body>
</html>
=]
}

// "Non-Fluxion" JS: you can call logic here.
ExamplePlaceholder();
UI();
