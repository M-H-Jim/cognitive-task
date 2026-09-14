import { useState } from "react";
import "./DigitSpan.css";

function DigitSpan({ onComplete }) {
    const [currentLength, setCurrentLength] = useState(3);
    const [sequence, setSequence] = useState("");
    const [misses, setMisses] = useState(0);

    const [digitDisplay, setDigitDisplay] = useState("");
    const [answer, setAnswer] = useState("");

    const [acceptingAnswer, setAcceptingAnswer] = useState(false);
    const [started, setStarted] = useState(false);

    const [status, setStatus] = useState("");

    function generateSequence(length) {
        let result = "";

        while (result.length < length) {
            const digit = Math.floor(Math.random() * 10).toString();

            if (
                result.length === 0 ||
                result[result.length - 1] !== digit
            ) {
                result += digit;
            }
        }

        return result;
    }

    function sleep(milliseconds) {
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }

    async function showSequence(newSequence) {
        setAcceptingAnswer(false);

        for (const digit of newSequence) {
            setDigitDisplay(digit);

            await sleep(1000);

            setDigitDisplay("");

            await sleep(100);
        }

        setStatus("Type the digits in the same order.");

        setAcceptingAnswer(true);
    }

    async function startRound(length) {
        setAcceptingAnswer(false);
        setAnswer("");
        setDigitDisplay("");

        const newSequence = generateSequence(length);

        setSequence(newSequence);

        setStatus(`${length} digits — watch carefully`);

        await showSequence(newSequence);
    }

    function startTest() {
        setStarted(true);

        setCurrentLength(3);
        setMisses(0);
        setAnswer("");

        setStatus("");

        const newSequence = generateSequence(3);

        setSequence(newSequence);

        setStatus("3 digits — watch carefully");

        showSequence(newSequence);
    }

    function checkAnswer() {
        if (!acceptingAnswer) {
            return;
        }

        setAcceptingAnswer(false);

        if (answer.trim() === sequence) {
            handleSuccess();
        } else {
            handleMiss();
        }
    }

    function handleSuccess() {
        setStatus(`Correct! ${currentLength} digits.`);

        const newLength = currentLength + 1;

        setCurrentLength(newLength);

        // New length gets two fresh attempts.
        setMisses(0);

        setTimeout(() => {
            startRound(newLength);
        }, 1000);
    }

    function handleMiss() {
        const newMisses = misses + 1;

        setMisses(newMisses);

        setStatus(`Incorrect. Miss ${newMisses} of 2.`);

        if (newMisses >= 2) {
            finishTest(currentLength - 1);
            return;
        }

        setTimeout(() => {
            startRound(currentLength);
        }, 1000);
    }

    function finishTest(score) {
        setAcceptingAnswer(false);

        setDigitDisplay("");

        setStatus(
            `Test complete. Your span: ${score} digits.`
        );

        // Send the result to App.jsx
        onComplete(score);
    }

    return (
        <div className="digit-span">

            <h1>Digit Span Test</h1>

            <p className="instruction">
                Remember the digits in the order they appear.
            </p>

            <div className="digit-display">
                {digitDisplay}
            </div>

            <input
                className="answer-input"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                disabled={!acceptingAnswer}
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        checkAnswer();
                    }
                }}
            />

            <button
                className="submit-button"
                disabled={!acceptingAnswer}
                onClick={checkAnswer}
            >
                Submit
            </button>

            <p className="status">
                {status}
            </p>

            {!started && (
                <button
                    className="start-button"
                    onClick={startTest}
                >
                    Start Test
                </button>
            )}

        </div>
    );
}

export default DigitSpan;
