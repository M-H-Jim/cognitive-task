import { useState } from "react";
import "./Corsi.css";

function Corsi({ onComplete }) {

    const [currentLength, setCurrentLength] = useState(2);
    const [sequence, setSequence] = useState([]);
    const [userSequence, setUserSequence] = useState([]);
    const [misses, setMisses] = useState(0);
    const [activeBlock, setActiveBlock] = useState(null);
    const [selectedBlocks, setSelectedBlocks] = useState([]);
    const [acceptingInput, setAcceptingInput] = useState(false);
    const [started, setStarted] = useState(false);

    const [status, setStatus] = useState(
        "Watch the blocks light up, then click them in the same order."
    );

    const blocks = Array.from({ length: 9 }, (_, index) => index);

    function getPercentile(score) {
        if (score >= 8) {
            return 93;
        }

        if (score === 5) {
            return 25;
        }

        if (score === 6) {
            return 50;
        }

        if (score === 7) {
            return 75;
        }

        return 7;
    }

    function generateSequence(length) {

        const result = [];

        while (result.length < length) {

            const index = Math.floor(Math.random() * 9);

            if (
                result.length === 0 ||
                result[result.length - 1] !== index
            ) {
                result.push(index);
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

        setAcceptingInput(false);

        for (const index of newSequence) {

            setActiveBlock(index);

            await sleep(700);

            setActiveBlock(null);

            await sleep(300);
        }

        setStatus("Now click the blocks in the same order.");

        setAcceptingInput(true);
    }

    async function startRound(length) {

        setUserSequence([]);
        setSelectedBlocks([]);
        setActiveBlock(null);
        setAcceptingInput(false);

        const newSequence = generateSequence(length);

        setSequence(newSequence);

        setStatus(`${length} blocks — watch the sequence`);

        await showSequence(newSequence);
    }

    function startTest() {

        setStarted(true);
        setCurrentLength(2);
        setMisses(0);

        setStatus("Watch carefully...");

        const newSequence = generateSequence(2);

        setSequence(newSequence);
        setUserSequence([]);
        setSelectedBlocks([]);

        showSequence(newSequence);
    }

    function handleBlockClick(index) {

        if (!acceptingInput) {
            return;
        }

        const newUserSequence = [...userSequence, index];

        setUserSequence(newUserSequence);

        setSelectedBlocks(prev => [...prev, index]);

        const position = newUserSequence.length - 1;

        // Wrong click
        if (newUserSequence[position] !== sequence[position]) {

            handleMiss();

            return;
        }

        // Entire sequence was correct
        if (newUserSequence.length === sequence.length) {

            handleSuccess();
        }
    }

    function handleSuccess() {

        setAcceptingInput(false);

        setStatus(`Correct! ${currentLength} blocks.`);

        const newLength = currentLength + 1;

        setCurrentLength(newLength);

        // Continue beyond 9
        setTimeout(() => {
            startRound(newLength);
        }, 1000);
    }

    function handleMiss() {

        setAcceptingInput(false);

        const newMisses = misses + 1;

        setMisses(newMisses);

        setStatus(`Incorrect. Miss ${newMisses} of 2.`);

        // Two misses at the same length = test over
        if (newMisses >= 2) {

            finishTest(currentLength - 1);

            return;
        }

        // Try the same length again
        setTimeout(() => {

            startRound(currentLength);

        }, 1000);
    }

    function finishTest(score) {

        setAcceptingInput(false);
        setActiveBlock(null);
        setSelectedBlocks([]);

        const percentile = getPercentile(score);

        setStatus(
            `Test complete. Your score: ${score} blocks.`
        );

        onComplete({
            score,
            percentile
        });
    }

    return (
        <div className="corsi">

            <h1>Corsi Block-Tapping Test</h1>

            <p className="instruction">
                Watch the blocks light up, then click them in the same order.
            </p>

            <div className="board">

                {blocks.map(index => (

                    <button
                        key={index}
                        className={`
                            block
                            ${activeBlock === index ? "active" : ""}
                            ${selectedBlocks.includes(index) ? "selected" : ""}
                        `}
                        onClick={() => handleBlockClick(index)}
                        disabled={!acceptingInput}
                    />

                ))}

            </div>

            <p className="status">
                {status}
            </p>

            {!started && (

                <button
                    className="startButton"
                    onClick={startTest}
                >
                    Start Test
                </button>

            )}

        </div>
    );
}

export default Corsi;