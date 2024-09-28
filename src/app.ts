import * as net from "node:net";

const server = net.createServer(socket => {
    socket.on("data", data => {
        console.log(data);
        socket.write("HTTP/1.1 200 OK\r\n");
        socket.end();
    })
})

server.listen(3000, () => {
    console.log('HTTP server running on port 3000');
});

export default server;