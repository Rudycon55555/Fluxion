function DynamicPlaceholder() {
    Fluxion.let[=
user = "Rudra"
greeting = () => "Hello " + user + "!"
time = () => new Date().toLocaleTimeString()
=]
}

function GreetingTag() {
    Fluxion.return[=
<p>{{{greeting}}} The time is {{{time}}}.</p>
=]
}

function UI() {
    Fluxion.inject[=
<!DOCTYPE html>
<html>
<body>
GreetingTag
</body>
</html>
=]
}

DynamicPlaceholder();
UI();
