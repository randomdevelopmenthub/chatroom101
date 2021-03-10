var socket = io();

var f = document.getElementById("form");
var i = document.getElementById("input");
var a = document.getElementById("hyperlink");

f.addEventListener("submit", function(e) {
    e.preventDefault();


    socket.emit("create_room", socket.id, (id) => {
        a.href = "/rooms/" + id;
        a.click();
    });
});
