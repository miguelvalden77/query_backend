const app = require("./app");
const {Server} = require("socket.io")
const cors = require("cors");
const {createServer} = require("http")
const httpServer = createServer(app);


// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 5005;


const server = app.listen(PORT, () => {
console.log(`Server listening on http://localhost:${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})



io.on("connection", (socket)=>{
  console.log("conexion nueva")
  
  socket.on("writing:client", (data)=>{
    io.sockets.emit("writing:server", {mensaje: "escribiendo ..."})
  })
    
  })