const express = require("express");
const app = express();
const MainRoute = require("./routes/mainsroutes");
const path = require("path");
const bodyParser = require("body-parser");
const socketio = require("socket.io");
const { Socket } = require("dgram");
const formatMessage = require("./utils/messages_format");
const { userJoin, getCurrentUser, userLeave, getRoomsUser } = require("./utils/users");
const { SocketAddress } = require("net");
const cors = require("cors");
// const previewmesg = require("./utils/preview");
const fetch = require("cross-fetch");
const dotenv = require("dotenv");
const pth = __dirname;
dotenv.config({ path: path.join(pth, '.env') });
const key = process.env.link_key;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//Routers--------------

app.use("/", MainRoute.Router);
// MainRoute.printing().then((data) => {
//     try {
//         console.log("this is : ", data);
//     } catch (error) {
//         console.log("Unable to get...");
//     }
// });


// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "/public/landing.html"));
// });
// var User_details;
// app.post("/", (req, res) => {
//     // console.log("1: ", req.body);
//     User_details = req.body;
//     // printing_userDetails(User_details);
//     res.redirect("/chat");
// });

// app.get("/chat", (req, res) => {
//     res.render("chat");
// });

//End of Routers--------------

// function printing_userDetails(User_details) {
//     console.log("2: ", User_details);
// }

const port = process.env.PORT || 3000;
const expressServer = app.listen(port, console.log(`the server has started on ${port}`));



const io = socketio(expressServer);

// chatting server is here

io.on("connection", socket => {
    // console.log("a client connected");

    //join a room
    socket.on("JoinRooms", (User_details) => {
        const user = userJoin(socket.id, User_details.params_naam, User_details.params_room);
        socket.join(user.room);

        socket.emit("message", formatMessage("Server", "welcome to the chat application"));

        //runs when a new user join the chat
        socket.broadcast.to(user.room).emit("message", formatMessage("Server", `${user.username} has joined the chat`));

        //Send user and room information 
        io.to(user.room).emit("roomusers", {
            room: user.room,
            User_Detail: getRoomsUser(user.room)
        });
    });


    socket.on("NewMessage_2server", async (msg) => {
        const curuser = getCurrentUser(socket.id);
        // console.log(curuser);
        // console.log(msg);
        var prefix_link = `http://api.linkpreview.net/?key=${key}&q=${msg}`;
        fetch(prefix_link).then(res => res.json()).then(data => {
            if (data.title.length === 0) {
                io.to(curuser.room).emit("message", formatMessage(curuser.username, msg));
            }
            else {
                io.to(curuser.room).emit("message", formatMessage(curuser.username, data));
            }
        });
    });

    // runs when the user has has disconnects
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit("message", formatMessage("Server", `${user.username} has left the chat`));

            io.to(user.room).emit("ALLUSERS", {
                room: user.room,
                users: getRoomsUser(user.room)
            });
        }
    });
});
