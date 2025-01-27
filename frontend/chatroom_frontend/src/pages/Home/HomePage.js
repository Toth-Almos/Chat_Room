import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './homePage.module.css';

export function HomePage() {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleRegister = () => {
        if (username.trim()) {
            navigate('/chatroom', { state: { username } }); // Pass username to ChatroomPage
        } else {
            alert("Please enter a valid username.");
        }
    };

    return (
        <div className={classes.homepage_container}>
            <h2 className={classes.homepage_title}>Welcome to the Public Chatroom!</h2>
            <h3 className={classes.homepage_subtitle}>To enter, please give yourself a username:</h3>
            <div className={classes.homepage_input_group}>
                <input
                    className={classes.homepage_input}
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={handleUsernameChange}
                />
                <button onClick={handleRegister} className={classes.homepage_button}>Connect</button>
            </div>
        </div>
    );
}