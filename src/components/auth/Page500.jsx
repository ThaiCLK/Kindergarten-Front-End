// src/components/ServerError.js
import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../../assets/scss/500.scss"
import { useDispatch } from "react-redux"
import { logout } from "../../redux/reducers/UserInfoSlice"

const ErrorPage = () => {
    useEffect(() => {
        const stackContainer = document.querySelector('.stack-container');
        const cardNodes = document.querySelectorAll('.card-container');
        const perspecNodes = document.querySelectorAll('.perspec');
        const perspec = document.querySelector('.perspec');
        const card = document.querySelector('.card-500');

        let counter = stackContainer.children.length;

        // Function to generate random number
        const randomIntFromInterval = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1) + min);
        };

        // After tilt animation, fire the explode animation
        card.addEventListener('animationend', () => {
            perspecNodes.forEach((elem) => {
                elem.classList.add('explode');
            });
        });

        // After explode animation do a bunch of stuff
        perspec.addEventListener('animationend', (e) => {
            if (e.animationName === 'explode') {
                cardNodes.forEach((elem) => {
                    // Add hover animation class
                    elem.classList.add('pokeup');

                    // Add event listener to throw card on click
                    elem.addEventListener('click', () => {
                        let updown = [800, -800];
                        let randomY = updown[Math.floor(Math.random() * updown.length)];
                        let randomX = Math.floor(Math.random() * 1000) - 1000;
                        elem.style.transform = `translate(${randomX}px, ${randomY}px) rotate(-540deg)`;
                        elem.style.transition = 'transform 1s ease, opacity 2s';
                        elem.style.opacity = '0';
                        counter--;
                        if (counter === 0) {
                            stackContainer.style.width = '0';
                            stackContainer.style.height = '0';
                        }
                    });

                    // Generate random number of lines of code between 4 and 10 and add to each card
                    let numLines = randomIntFromInterval(5, 10);

                    // Loop through the lines and add them to the DOM
                    for (let index = 0; index < numLines; index++) {
                        let lineLength = randomIntFromInterval(25, 97);
                        let node = document.createElement('li');
                        node.classList.add('node-' + index);
                        elem.querySelector('.code ul').appendChild(node).setAttribute('style', '--linelength: ' + lineLength + '%;');

                        // Draw lines of code 1 by 1
                        if (index === 0) {
                            elem.querySelector('.code ul .node-' + index).classList.add('writeLine');
                        } else {
                            elem.querySelector('.code ul .node-' + (index - 1)).addEventListener('animationend', () => {
                                elem.querySelector('.code ul .node-' + index).classList.add('writeLine');
                            });
                        }
                    }
                });
            }
        });
    }, []);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleHomeRedirect = () => {
        dispatch(logout())
        navigate('/home')
    }

    return (
        <div className="container-500">
            <div className="error-500">
                <h1>500</h1>
                <h2>error</h2>
                <p>Opps! Something went wrong. We're looking to see what happened.</p>
                <button onClick={handleHomeRedirect}>Go back to Homepage</button>
            </div>
            <div className="stack-container">
                {[125, 100, 75, 50, 25, 0].map((spreadDist, index) => (
                    <div key={index} className="card-container">
                        <div className="perspec" style={{ '--spreaddist': `${spreadDist}px`, '--scaledist': `${1 - index * 0.05}`, }}>
                            <div className="card-500 ">
                                <div className="writing">
                                    <div className="topbar">
                                        <div className="red"></div>
                                        <div className="yellow"></div>
                                        <div className="green"></div>
                                    </div>
                                    <div className="code">
                                        <ul></ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ErrorPage;