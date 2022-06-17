var url = "https://chat-web-application-task.herokuapp.com/" || "http://localhost:3000/";
const socket = io(url);
const chat_msg = document.querySelector(".rightbar");

var url_string = window.location.href; // www.test.com?filename=test
var url = new URL(url_string);
var params_naam = url.searchParams.get("naam");
var params_room = url.searchParams.get("rooms");

// console.log(params_naam, params_room);


//Join Rooms
const User_details = { params_naam, params_room };
socket.emit("JoinRooms", User_details);



//message from server
socket.on("message", mssg => {
    // console.log("checking", mssg.text);
    if (mssg.text.description === undefined) {
        showMessage(mssg);
    }
    else {
        // console.log(mssg.text);
        showmessage(mssg);
    }
    // chat_msg.scrollIntoView(false);   //to do----------
});

//user sends the message
document.getElementById("Chat_form").addEventListener("submit", (e) => {
    e.preventDefault();
    const newMsg = document.getElementById("messg").value;
    document.getElementById("messg").value = "";
    document.getElementById("messg").focus();
    // console.log(newMsg); 
    socket.emit("NewMessage_2server", newMsg);
});

socket.on("roomusers", ({ room, User_Detail }) => {
    Show_Rooms(room);
    Show_User(User_Detail);
});

showMessage = (msg) => {
    // console.log("this is running...");
    const div = document.createElement("div");
    div.classList.add("messages");
    div.innerHTML += `
    <p class="person_name">${msg.username} <span>${msg.time}</span></p>
    <section>
        <p>${msg.text}</p>
    </section>
    `;
    document.getElementById("rightbar").appendChild(div);
};

showmessage = (msg) => {
    // console.log("this is running... 123");
    const div = document.createElement("div");
    div.classList.add("messages");
    div.innerHTML += `
    <p class="person_name">${msg.username} <span>${msg.time}</span></p>
    <section>
        <br/>
        <p class="preview_title">${msg.text.title}</p>
        <p>${msg.text.description}</p> <br/>
        <p><img class="image_preview" src=${msg.text.image}></p> <br/>
        <p><a href="${msg.text.url}" target="_blank">${msg.text.url}</a></p>
    </section>
    `;
    document.getElementById("rightbar").appendChild(div);
};

Show_Rooms = (room) => {
    document.getElementById("room_name").innerHTML = `
    <ul>
        <li>${room}</li>
    </ul>
`;
};

function Show_User(users) {
    const userList = document.getElementById('users');
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username; 2
        userList.appendChild(li);
    });
};

document.getElementById("setting_icon").addEventListener("click", () => {
    window.location = "../landing.html";
})