import classes from './homePage.module.css';
import React, { useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient = null;
export function HomePage() {

    const [publicChat, setPublicChat] = useState([]);
    const [userData, setUserData] = useState({
        username: "",
        receivername: "",
        connected: false,
        message: ""
    })
    useEffect(() => {
        console.log(userData);
    }, [userData]);

    const connect = () => {
        let Sock = new SockJS('http://localhost:8080/chat-room-ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({ ...userData, "connected": true });
        stompClient.subscribe('/topic/public', onMessageReceived);
        userJoin();
    }

    const userJoin = () => {
        var chatMessage = {
            content: `${userData.username} has joined!`,
            sender: userData.username,
            receiver: "",
            type: "JOIN"
        }
        stompClient.send("app/chat-sendPublicMessage", {}, JSON.stringify(chatMessage));
    }

    const onError = (error) => {
        console.log(error)
    }

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        switch (payloadData.type) {
            case "JOIN":
                console.log("user connected");
                break;
            case "CHAT":
                publicChat.push(payloadData);
                setPublicChat([...publicChat]);
                break;
            default:
                console.log("unknown message type!");
                break;
        }
    }

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "message": value });
    }

    const sendValue = () => {
        if (stompClient) {
            var chatMessage = {
                content: userData.message,
                sender: userData.username,
                receiver: userData.receivername,
                type: "CHAT"
            };
            console.log(chatMessage);
            stompClient.send("/app/chat-sendPublicMessage", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
        }
    }

    const registerUser = () => {
        connect();
    }

    const handleUsername = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "username": value });
    }

    return (
        <div className={classes.homepage_container}>
            {userData.connected ?
                <div>
                    <ul className="chat-messages">
                        {publicChat.map((chat, index) => (
                            <li className={`message ${chat.sender === userData.sender && "self"}`} key={index}>
                                {chat.sender !== userData.sender && <div className="avatar">{chat.sender}</div>}
                                <div className="message-data">{chat.content}</div>
                                {chat.sender === userData.sender && <div className="avatar self">{chat.sender}</div>}
                            </li>
                        ))}
                    </ul>

                    <div className="send-message">
                        <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} />
                        <button type="button" className="send-button" onClick={sendValue}>send</button>
                    </div>
                </div>
                :
                <div>
                    <h2 className={classes.homepage_title}>Welcome to the Public Chatroom!</h2>
                    <h3 className={classes.homepage_subtitle}>To enter, please give yourself a username:</h3>
                    <div className={classes.homepage_input_group}>
                        <input
                            className={classes.homepage_input}
                            type="text"
                            placeholder="Enter your username"
                            onChange={handleUsername}
                        />
                        <button onClick={registerUser} className={classes.homepage_button}>Connect</button>
                    </div>
                </div>
            }
        </div>
    );
}