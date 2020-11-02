var app = require("express")();
var http = require("http").createServer(app);
const PORT = 5000;
var io = require("socket.io")(http);
var channal_name = [
  {
    name: "CODINGMART",
    participants: 0,
    id: 1,
    sockets: [],
  },
];

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

http.listen(PORT, () => {
  console.log("start server");
});

io.on("connection", (socket) => {
  socket.emit("connection", null);
  socket.on("channel-join", (id) => {
    console.log("channel join", id);
    channal_name.forEach((c) => {
      if (c.id === id) {
        if (c.sockets.indexOf(socket.id) == -1) {
          c.sockets.push(socket.id);
          c.participants++;
          io.emit("channel", c);
        }
      } else {
        let index = c.sockets.indexOf(socket.id);
        if (index != -1) {
          c.sockets.splice(index, 1);
          c.participants--;
          io.emit("channel", c);
        }
      }
    });

    return id;
  });
  socket.on("send-message", (message) => {
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    channal_name.forEach((c) => {
      let index = c.sockets.indexOf(socket.id);
      if (index != -1) {
        c.sockets.splice(index, 1);
        c.participants--;
        io.emit("channel", c);
      }
    });
  });
});

app.get("/getChannels", (req, res) => {
  res.json({
    channels: channal_name,
  });
});
