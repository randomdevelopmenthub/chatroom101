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

socket.on("message", (content) => {
    var item = document.createElement("li");
	
    item.textContent = "random user: " + content;
    messages.appendChild(item);
	
    window.scrollTo(0, document.body.scrollHeight);
});