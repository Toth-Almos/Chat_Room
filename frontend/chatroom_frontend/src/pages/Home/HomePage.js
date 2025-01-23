import classes from './homePage.module.css';

export function HomePage() {

    return (
        <div className={classes.homepage_container}>
            <h2 className={classes.homepage_title}>Welcome to the Public Chatroom!</h2>
            <h3 className={classes.homepage_subtitle}>To enter, please give yourself a username:</h3>
            <div className={classes.homepage_input_group}>
                <input
                    className={classes.homepage_input}
                    type="text"
                    placeholder="Enter your username"
                />
                <button className={classes.homepage_button}>Connect</button>
            </div>
        </div>
    );
}