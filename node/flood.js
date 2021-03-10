let FLOOD_TIME = 5000;
let FLOOD_MAX = 10;

let flood = {
    floods: {},
    lastFloodClear: new Date(),
    protect: (io, socket) => {
        if (Math.abs( new Date() - flood.lastFloodClear) > FLOOD_TIME) {
            flood.floods = {};
            flood.lastFloodClear = new Date();
        }

        flood.floods[socket.id] == undefined ? flood.floods[socket.id] = {} : flood.floods[socket.id];
        flood.floods[socket.id].count == undefined ? flood.floods[socket.id].count = 0 : flood.floods[socket.id].count;
        flood.floods[socket.id].count++;

        if (flood.floods[socket.id].count > FLOOD_MAX) {
            return false;
        }

        return true;
    }
}

exports = module.exports = flood;