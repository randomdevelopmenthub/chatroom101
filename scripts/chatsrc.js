var socket = io.connect(window.location.hostname);

var f = document.getElementById("form");
var i = document.getElementById("input");

i.placeholder = "message"; 

f.addEventListener("submit", function(e) {
    e.preventDefault();

    if (i.value) {
        socket.emit("message", i.value);
        i.value = "";
    }
});

function addmsg(tcontent) {
    var item = document.createElement("li");
	
    item.textContent = tcontent;
    messages.appendChild(item);
	
    window.scrollTo(0, document.body.scrollHeight);
}

socket.on("message", (content) => {
    addmsg("random user: " + content);
});

socket.on("connect", socket => {
	addmsg(socket.id + " joined");

    socket.on("disconnect", () => {
        addmsg(socket.id + " left");
    });
});
