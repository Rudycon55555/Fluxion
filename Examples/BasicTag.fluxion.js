function UserNamePlaceholder() {
    Fluxion.let[=
user = "Rudra"
=]
}

function HelloTag() {
    Fluxion.return[=
<h1>Hello, {{{user}}}!</h1>
=]
}

function UI() {
    Fluxion.inject[=
<!DOCTYPE html>
<html>
<body>
HelloTag
</body>
</html>
=]
}

UserNamePlaceholder();
UI();
