const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const shiftAmount = 3;

app.use(cors());


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        medthods: ["GET", "POST"],
    },
});


io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);


    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User With ID: ${socket.id} join room: ${data}`)
    });

    socket.on("sent_message", (data) => {
        message = data["message"];
        const encryptedMessage = caesarEncrypt(message, shiftAmount);
        const decryptedMessage = caesarDecrypt(encryptedMessage, shiftAmount);
        data["message"] = "Encrypted: " + encryptedMessage + "\nDecrypted: " + decryptedMessage;
        socket.to(data.room).emit("receive_message", data);
    });
    
    socket.on("disconnect", () => {
        console.log("User Disconnect", socket.id);
    });
});

server.listen(3001, () => {
    console.log("SERVER RUNNING!!!");
});

function caesarEncrypt(text, shift) {
    let result = '';
  
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
    
        if (/[a-zA-Z]/.test(char)) {
            const isUpperCase = char === char.toUpperCase();
            char = char.toUpperCase();
            const charCode = char.charCodeAt(0);
            const shiftedCharCode = ((charCode - 65 + shift) % 26 + 26) % 26 + 65;
    
            if (isUpperCase) {
            result += String.fromCharCode(shiftedCharCode);
            } else {
            result += String.fromCharCode(shiftedCharCode).toLowerCase();
            }
        } else {
            result += char;
        }
    }
  
    return result;
  }
  
  function caesarDecrypt(text, shift) {
    return caesarEncrypt(text, -shift);
  }