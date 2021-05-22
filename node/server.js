const server = require("express")();
const { static } = require("express");
const func = require("../scripts/func.js");
const http = require("http").Server(server);
const io = require("socket.io")(http);
const flood = require("./flood.js");
const path = require("path");
const server_port = 49753;

function genid() { return `${Math.floor(Math.random() * 29)}` + `${Math.floor(Math.random() * 13)}` + `${Math.floor(Math.random() * 47)}` + `${Math.floor(Math.random() * 59)}`; };

server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/../sources/index.html"));
});

server.get("/scripts/:file", (req, res) => {
    res.sendFile(path.join(__dirname + "/../scripts/" + req.params.file));
});

server.use('/lib', static(__dirname + '/../scripts/lib'))

io.on("connection", (socket) => {
    console.log("User with socket ID " + socket.id + " has connected.");

    socket.on("message", (content, username) => {
        if (flood.protect(io, socket)) {
            var urlreg = /[-a-zA-Z0-9@:%._\+~#=]?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi

            if (urlreg.test(content)) {
                socket.emit("link", content);
            }

            else {
                io.sockets.emit('message', content, username);
            }
        } 
        
        else {
            io.sockets.emit('ratelimit', content);
        }
    });

    socket.on("create_room", (sid, callback) => {
        if (!callback || typeof callback !== 'function') {
            return false;
        }
        if (/.*(\/|\*).*/gi.test(sid)) {
            return callback(null)
        }
        server.get("/rooms/" + sid, (req, res) => {
            res.sendFile(path.join(__dirname + "/../sources/template.html"));
        });
        callback(sid);
    });

    socket.on("disconnect", () => {
        console.log("User with socket ID " + socket.id + " has disconnected.");
    });
});

http.listen(server_port, () => {
    console.log(`Server running on port ${server_port}`);
});
