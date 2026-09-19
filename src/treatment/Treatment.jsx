import { useEffect, useRef, useState } from "react";
import "./Treatment.css";
import article from "../content/article.txt?raw";

function Treatment({ group, onComplete }) {
    const [started, setStarted] = useState(false);

    const [timeLeft, setTimeLeft] = useState(120);  // 120 sec this is the time for reading the article
    const [number, setNumber] = useState(null);

    const answeredRef = useRef(false);
    const sequenceRef = useRef([]);
    const indexRef = useRef(0);
    const completedRef = useRef(false);

    const [correctPresses, setCorrectPresses] = useState(0);
    const [falsePresses, setFalsePresses] = useState(0);
    const [missedSevens, setMissedSevens] = useState(0);

    // Generate exactly 24 numbers:
    // 10 sevens + 14 non-sevens, randomly shuffled.
    function generateNumberSequence() {
        const numbers = [];

        // Add exactly 10 sevens
        for (let i = 0; i < 10; i++) {
            numbers.push(7);
        }

        // Add 14 non-seven numbers
        for (let i = 0; i < 14; i++) {
            let randomNumber;

            do {
                randomNumber = Math.floor(Math.random() * 10);
            } while (randomNumber === 7);

            numbers.push(randomNumber);
        }

        // Shuffle the 24 numbers
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }

        return numbers;
    }

    // Start the experiment
    function handleStart() {
        sequenceRef.current = generateNumberSequence();
        indexRef.current = 0;

        setTimeLeft(120);   // this should also be the time 120s
        setNumber(null);

        setCorrectPresses(0);
        setFalsePresses(0);
        setMissedSevens(0);

        answeredRef.current = false;
        completedRef.current = false;

        setStarted(true);
    }

    // Main 120-second timer
    useEffect(() => {
        if (!started) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(time => time - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [started]);

    // Finish treatment
    useEffect(() => {
        if (
            started &&
            timeLeft <= 0 &&
            !completedRef.current
        ) {
            completedRef.current = true;

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
        started,
        timeLeft,
        group,
        correctPresses,
        falsePresses,
        missedSevens,
        onComplete
    ]);

    // Number sequence
    useEffect(() => {
        if (!started || group === "Control") {
            return;
        }

        let nextTimer;
        let numberTimer;

        function showNextNumber() {
            if (indexRef.current >= sequenceRef.current.length) {
                return;
            }

            const currentNumber =
                sequenceRef.current[indexRef.current];

            indexRef.current++;

            answeredRef.current = false;
            setNumber(currentNumber);

            // Number disappears automatically after 2 seconds
            numberTimer = setTimeout(() => {
                if (
                    currentNumber === 7 &&
                    !answeredRef.current
                ) {
                    setMissedSevens(count => count + 1);
                }

                setNumber(null);

                // 3 seconds blank time
                // 2 seconds visible + 3 seconds blank = 5 seconds
                nextTimer = setTimeout(showNextNumber, 3000);
            }, 2000);
        }

        // First number appears immediately after Start
        showNextNumber();

        return () => {
            clearTimeout(nextTimer);
            clearTimeout(numberTimer);
        };
    }, [started, group]);

    // Spacebar handling
    useEffect(() => {
        if (!started || group === "Control") {
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
            } else {
                setFalsePresses(count => count + 1);
            }

            // Participant responded, so hide the number immediately
            setNumber(null);
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [started, group, number]);

    let instruction = "";

    if (group === "AI") {
        instruction =
            "You may use ChatGPT or Gemini to help you, but do not let AI write the entire summary for you.";
    } else if (group === "Non-AI") {
        instruction =
            "Complete the task without using ChatGPT, Gemini, or other AI tools.";
    } else if (group === "Control") {
        instruction =
            "Read the article and prepare a summary. There is no secondary task.";
    }

    // Instruction screen
    if (!started) {
        return (
            <div className="treatment">
                <div className="treatment-instructions">
                    <h1>Task Instructions</h1>

                    <h2>Your Group: {group}</h2>

                    <p>
                        You will have <strong>2 minutes</strong> to
                        complete this task.
                    </p>

                    <p>{instruction}</p>

                    {(group === "AI" || group === "Non-AI") && (
                        <>
                            <h3>Number Monitoring</h3>

                            <p>
                                Numbers will appear on the screen
                                during the task.
                            </p>

                            <p>
                                Whenever you see the number{" "}
                                <strong>7</strong>, press the{" "}
                                <strong>SPACE</strong> key.
                            </p>

                            <p>
                                Each number may remain on the screen
                                for up to 2 seconds. If you press
                                SPACE, it will disappear immediately.
                            </p>

                            <p>
                                There will be a new number every
                                5 seconds.
                            </p>
                        </>
                    )}

                    <button
                        className="start-button"
                        onClick={handleStart}
                    >
                        Start Experiment
                    </button>
                </div>
            </div>
        );
    }

    // Experiment screen
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

