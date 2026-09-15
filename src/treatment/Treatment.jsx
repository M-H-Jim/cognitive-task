import { useEffect, useRef, useState } from "react";
import "./Treatment.css";
import article from "../content/article.txt?raw";

function Treatment({ group, onComplete }) {
    const [timeLeft, setTimeLeft] = useState(30); // 120s
    const [number, setNumber] = useState(null);
    const answeredRef = useRef(false);
    const [correctPresses, setCorrectPresses] = useState(0);
    const [falsePresses, setFalsePresses] = useState(0);
    const [missedSevens, setMissedSevens] = useState(0);



    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(time => time - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);


    useEffect(() => {
        if (timeLeft <= 0) {

            console.log("=== Multitasking Results ===");
            console.log("Group:", group);
            console.log("Correct Presses:", correctPresses);
            console.log("False Presses:", falsePresses);
            console.log("Missed 7s:", missedSevens);

            onComplete({
                correctPresses,
                falsePresses,
                missedSevens
            });
        }
    }, [
        timeLeft,
        group,
        correctPresses,
        falsePresses,
        missedSevens,
        onComplete
    ]);



    useEffect(() => {
        if (group === "Control") {
            return;
        }

        let nextTimer;
        let numberTimer;

        function showNextNumber() {
            const randomNumber = Math.floor(Math.random() * 10);
            
            answeredRef.current = false;
            
            setNumber(randomNumber);

            numberTimer = setTimeout(() => {

                if (randomNumber === 7 && !answeredRef.current) {
                    setMissedSevens(count => count + 1);
                }

                setNumber(null);

                // const delay = Math.floor(Math.random() * 5000) + 5000;
                const delay = 3000;


                nextTimer = setTimeout(showNextNumber, delay);

            }, 2000);
        }

        // const firstDelay = Math.floor(Math.random() * 5000) + 5000;
        const firstDelay = 3000;

        nextTimer = setTimeout(showNextNumber, firstDelay);

        return () => {
            clearTimeout(nextTimer);
            clearTimeout(numberTimer);
        };

    }, [group]);    // for random number 

    useEffect(() => {
        if (group === "Control") {
            return;
        }

        function handleKeyDown(event) {

            if (event.code !== "Space") {
                return;
            }

            event.preventDefault();

            if (number === null || answeredRef.current) {
                return;
            }
            answeredRef.current = true;
            if (number === 7) {
                setCorrectPresses(count => count + 1);
            }
            else {
                setFalsePresses(count => count + 1);
            }

            setNumber(null);
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };

    }, [group, number]);

    let instruction = "";

    if (group === "AI") {
        instruction =
            "You may use ChatGPT or Gemini to help you, but do not let AI write the entire summary for you.";
    }
    else if (group === "Non-AI") {
        instruction =
            "Complete the task without using ChatGPT, Gemini, or other AI tools.";
    }
    else if (group === "Control") {
        instruction =
            "Read the article and prepare a summary. There is no secondary task.";
    }

    return (
        <div className="treatment">

            <div className="article">
                <h2>Read the Article</h2>
                <p>{article}</p>
            </div>

            <div className="secondary-task">

                <h2>Your Task</h2>
                <div className="timer">
                    Time remaining: {timeLeft}s
                </div>
                <p>{instruction}</p>

                {(group === "AI" || group === "Non-AI") && (
                    <>
                        <h2>Number Monitoring</h2>

                        <p>
                            Press SPACE whenever you see 7.
                        </p>

                        <div className="number-display">
                            {number ?? "—"}
                        </div>
                    </>
                )}

            </div>

        </div>
    );
}


export default Treatment;