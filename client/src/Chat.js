import React, { useEffect, useMemo, useState } from 'react';
import ScrollToBotton from 'react-scroll-to-bottom';

function Chat({socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);


    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                Name: username,
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),

            };

            await socket.emit("sent_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() =>{
        socket.on("receive_message", (data) =>{
            setMessageList((list) => [...list, data]);
        });
    }, [socket]);
      
  return (
    <div className="chat-window">
        <div className="chat-header"> 
            <p>Live Chat</p>
        </div>
        <div className="chat-body"> 
            <ScrollToBotton className='message-container'>
            {messageList.map((messageContent) =>{
                return (
                <div className="message" id={username === messageContent.author ? "you" : "other"}>
                    <div className="message-content">
                        <p>{messageContent.message}</p>
                    </div>
                    <div className="message-meta">
                        <p id='time'>{messageContent.time}</p>
                        <p id='author'>Read :{messageContent.author}</p>
                        <p id='you'>From : {messageContent.Name}</p>
                    </div>
                </div>
                );
            })}
            </ScrollToBotton>
        </div>
        <div className="chat-footer"> 
            <input type="text" value={currentMessage} placeholder="Hey......."onChange={(event) => {setCurrentMessage(event.target.value)}}
                onKeyPress={(event) =>{
                    event.key ==="Enter" && sendMessage();
                }}
            />

            <button onClick={sendMessage}>&#9658;</button>
        </div>
    </div>
  )
}

export default Chat