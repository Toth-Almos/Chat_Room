import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import classes from './chatroomPage.module.css';

export function ChatroomPage() {
    const location = useLocation();
    const username = location.state?.username; // Get username from the HomePage
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const stompClientRef = useRef(null); // Ref to store stompClient
    const [isConnected, setIsConnected] = useState(false); // To track connection state
    const subscriptionRef = useRef(false); // To track whether we've already subscribed to the topic

    const sendConnectMessage = useCallback(() => {
        if (stompClientRef.current) {
            const messagePayload = {
                sender: username,
                content: `${username} joined!`,
                type: 'JOIN'
            };
            stompClientRef.current.send('/app/chat-addUser', {}, JSON.stringify(messagePayload));
        } else {
            alert("Can't connect user to the room, beacuse WebSocket connection is not established yet.");
        }
    }, [username]);

    useEffect(() => {
        if (isConnected) {
            // Send message to server that user joined the room:
            sendConnectMessage();
        }
    }, [isConnected, sendConnectMessage])

    useEffect(() => {
        if (!username) {
            return;
        }

        // Establish WebSocket connection using SockJS and STOMP
        const socket = new SockJS('http://localhost:8080/chat-room-ws');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame);
            setIsConnected(true); // Set connected state to true

            // Store the stompClient in ref
            stompClientRef.current = stompClient;

            // Subscribe to the public chat topic only once
            if (!subscriptionRef.current) {
                stompClientRef.current.subscribe('/topic/public', (message) => {
                    // This callback function will run anytime we receive a message:
                    const messageBody = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, messageBody]);
                });
                // Mark subscription as done
                subscriptionRef.current = true;
            }
        }, (error) => {
            console.error('Error connecting to WebSocket: ', error);
        });

        // Disconnect websocket on unmount
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.disconnect();
            }
        };
    }, [username]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            // Ensure WebSocket is connected and stompClient is initialized
            if (isConnected && stompClientRef.current) {
                const messagePayload = {
                    sender: username,
                    content: newMessage,
                    type: 'CHAT',
                };

                // Send the message to the backend via STOMP
                stompClientRef.current.send('/app/chat-sendPublicMessage', {}, JSON.stringify(messagePayload));
                setNewMessage(""); // Clear the input field
            } else {
                alert("WebSocket connection is not established yet. Please wait.");
            }
        } else {
            alert("Please enter a message.");
        }
    };

    return (
        <div className={classes.chatroom_container}>
            {!username ?
                <h2 className={classes.chatroom_title}>Illegal access! You must register to use the public chatroom!</h2>
                :
                <>
                    <h2 className={classes.chatroom_title}>Welcome to the Chatroom, {username}!</h2>
                    <div className={classes.messages_container}>
                        {messages.map((message, index) => (
                            <div key={index} className={classes.message}>
                                <strong>{message.sender}: </strong>{message.content}
                            </div>
                        ))}
                    </div>
                    <div className={classes.input_group}>
                        <input
                            className={classes.input}
                            type="text"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button onClick={handleSendMessage} className={classes.send_button}>Send</button>
                    </div>
                </>
            }

        </div>
    );
}