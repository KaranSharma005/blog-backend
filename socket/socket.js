const socketIO = require("socket.io");
let io;

const intiSocket = (server) => {
    io = socketIO(server);

    io.on('connection',(socket) => {
        console.log(`User connected ${socket}`);

        io.on("disconnect", () => {
            console.log(`User disconnected ${socket}`);
        })
    })
}

function getIO(){
    if(!io){
        throw new errorMonitor("Error in making instance of IO");
    }
    return io;
}

module.exports = {intiSocket, getIO};