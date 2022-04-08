const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 8000;


app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        next();
    });

    app.get("/", function(req, res) {
        res.sendFile(__dirname + "/index.html");
    });

    io.on("connection", function(socket) {

        socket.on("user_join", function(data) {
            this.username = data;
            socket.broadcast.emit("user_join", data);
        });

        socket.on("chat_message", function(data) {
            data.username = this.username;
            socket.broadcast.emit("chat_message", data);
        });

        socket.on("disconnect", function(data) {
            socket.broadcast.emit("user_leave", this.username);
    	});
    });

    http.listen(port, function() {
        console.log("Listening on *:" + port);
    });