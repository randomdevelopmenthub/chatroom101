var socket = io.connect(window.location.origin);

var f = document.getElementById("form");
var u = document.getElementById("form2");
var i = document.getElementById("input");
var b = document.getElementById("usernameinput");

async function getUsername() {
    return new Promise((resolve, reject) => {
        localforage.getItem('username').then((value) => {
            resolve((value === null) ? null : value);
        });
    });
}

i.placeholder = "message"; 
b.placeholder = "username";

f.addEventListener("submit", async function(e) {
    e.preventDefault();

    if (i.value) {
        const username = await getUsername();
        socket.emit("message", { "message": i.value, "username": username } );
        i.value = "";
    }
});

u.addEventListener("submit", function(e) {
    e.preventDefault();

    if (b.value) {
        console.log('%cDebug: %c[I] %cEmmiting username change ('+b.value+')', 'font-weight: bold;','color: lightblue; font-weight: bold;', 'font-weight: normal;')
        socket.emit("username", b.value);
        console.log('%cDebug: %c[I] %cSetting username in IndexedDB ('+b.value+')', 'font-weight: bold;', 'color: lightblue; font-weight: bold;', 'font-weight: normal;')

        localforage.setItem("username", b.value).then((value) => {
            console.log('%cDebug: %c[S] %cSet username in IndexedDB ('+value+')', 'font-weight: bold;', 'color: lime; font-weight: bold;', 'font-weight: normal;')
        });
        b.value = "";
    }
});

socket.on("message", (data) => {
    var item = document.createElement("li");
	
    item.textContent = ((data.username === null) ? 'random user' : data.username) + ": " + data.message;
    messages.appendChild(item);
	
    window.scrollTo(0, document.body.scrollHeight);
});