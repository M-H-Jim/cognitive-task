import { useState } from "react";
import "./TrailMaking.css";

function TrailMaking({ onComplete }) {
    const [currentPart, setCurrentPart] = useState("A");
    const [currentTarget, setCurrentTarget] = useState(1);

    const [circles, setCircles] = useState([]);
    const [correctCircles, setCorrectCircles] = useState([]);

    const [timerRunning, setTimerRunning] = useState(false);
    const [startTime, setStartTime] = useState(null);

    const [partATime, setPartATime] = useState(null);
    const [partBTime, setPartBTime] = useState(null);

    const [status, setStatus] = useState("");
    const [started, setStarted] = useState(false);

    const [wrongCircle, setWrongCircle] = useState(null);

    const [showPartAInstructions, setShowPartAInstructions] = useState(true);
    const [showPartBInstructions, setShowPartBInstructions] = useState(false);

    function generatePositions(count) {
        const positions = [];
        const minimumDistance = 12;  // this was 9

        let attempts = 0;

        while (
            positions.length < count &&
            attempts < 10000
        ) {
            attempts++;

            const candidate = {
                x: 6 + Math.random() * 88,
                y: 7 + Math.random() * 86
            };

            let valid = true;

            for (const position of positions) {
                const dx = candidate.x - position.x;
                const dy = candidate.y - position.y;

                const distance = Math.sqrt(
                    dx * dx + dy * dy
                );

                if (distance < minimumDistance) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                positions.push(candidate);
            }
        }

        return positions;
    }

    function createPartA() {
        const values = [];

        for (let i = 1; i <= 25; i++) {
            values.push(i.toString());
        }

        createCircles(values);
    }

    function createPartB() {
        const values = [];

        for (let i = 1; i <= 13; i++) {
            values.push(i.toString());
            values.push(String.fromCharCode(64 + i));
        }

        createCircles(values);
    }

    function createCircles(values) {
        const positions = generatePositions(values.length);

        const newCircles = values.map((value, index) => ({
            value,
            x: positions[index].x,
            y: positions[index].y
        }));

        setCircles(newCircles);
        setCorrectCircles([]);
        setWrongCircle(null);
    }

    function startTest() {
        setStarted(true);

        setPartATime(null);
        setPartBTime(null);

        startPartA();
    }

    function startPartA() {
        setCurrentPart("A");
        setCurrentTarget(1);

        setTimerRunning(false);
        setStartTime(null);

        setStatus(
            "Part A: Click the numbers from 1 to 25 in order."
        );

        createPartA();
    }

    function startPartB() {
        setCurrentPart("B");
        setCurrentTarget(0);

        setTimerRunning(false);
        setStartTime(null);

        setStatus(
            "Part B: Click 1, A, 2, B, 3, C ... in order."
        );

        createPartB();
    }

    function getExpectedValue(target = currentTarget, part = currentPart) {
        if (part === "A") {
            return target.toString();
        }

        if (target % 2 === 0) {
            return String(target / 2 + 1);
        }

        const letterNumber =
            Math.floor(target / 2) + 1;

        return String.fromCharCode(64 + letterNumber);
    }

    function handleClick(value) {
        // Start timer on first click
        if (!timerRunning) {
            const now = performance.now();

            setStartTime(now);
            setTimerRunning(true);

            // We need this value immediately for the
            // first click's timing.
            handleActualClick(value, now);
            return;
        }

        handleActualClick(value, startTime);
    }

    function handleActualClick(value, currentStartTime) {
        const expectedValue =
            getExpectedValue();

        // Correct
        if (value === expectedValue) {
            setCorrectCircles(prev => [
                ...prev,
                value
            ]);

            const nextTarget = currentTarget + 1;

            setCurrentTarget(nextTarget);

            // Part A complete
            if (
                currentPart === "A" &&
                nextTarget > 25
            ) {
                finishPartA(currentStartTime);
                return;
            }

            // Part B complete
            if (
                currentPart === "B" &&
                nextTarget >= 26
            ) {
                finishPartB(currentStartTime);
                return;
            }

            // setStatus(
            //     `Next: ${getExpectedValue(nextTarget, currentPart)}`
            // );   // temporal comment

            return;
        }

        // Wrong
        setWrongCircle(value);

        setStatus(
            `Wrong circle. Find ${expectedValue}.`
        );

        setTimeout(() => {
            setWrongCircle(null);
        }, 300);
    }

    function getPercentile(time) {

        if (time <= 38) {
            return 93;
        }

        if (time <= 48) {
            return Math.round(
                93 - ((time - 38) / (48 - 38)) * (93 - 75)
            );
        }

        if (time <= 62) {
            return Math.round(
                75 - ((time - 48) / (62 - 48)) * (75 - 50)
            );
        }

        if (time <= 80) {
            return Math.round(
                50 - ((time - 62) / (80 - 62)) * (50 - 25)
            );
        }

        if (time <= 105) {
            return Math.round(
                25 - ((time - 80) / (105 - 80)) * (25 - 7)
            );
        }

        return 7;
    }

    function finishPartA(currentStartTime) {
        const endTime = performance.now();

        const time =
            (endTime - currentStartTime) / 1000;

        setPartATime(time);
        setTimerRunning(false);

        setStatus(
            `Part A complete: ${time.toFixed(2)} seconds`
        );

        setTimeout(() => {
            setShowPartBInstructions(true);
        }, 1200);
    }

    function finishPartB(currentStartTime) {
        const endTime = performance.now();

        const time =
            (endTime - currentStartTime) / 1000;

        const difference =
            time - partATime;

        const percentile = getPercentile(time);
        
        setPartBTime(time);
        setTimerRunning(false);

        const result = {
            partA: partATime,
            partB: time,
            difference: difference,
            percentile: percentile
        };

        setStatus(
            `Complete! A: ${partATime.toFixed(2)}s | ` +
            `B: ${time.toFixed(2)}s | ` +
            `B − A: ${difference.toFixed(2)}s`
        );

        console.log("Trail Making result:", result);
        console.log("Trail B percentile:", percentile);

        // Send result to App.jsx
        onComplete(result);
    }


    if (showPartAInstructions) {
        return (
            <div className="trail-making">

                <h1>Part A - নির্দেশনা (Trail Making Test)</h1>

                <p className="instruction">
                    ১. আপনার সামনে বিভিন্ন স্থানে সংখ্যা (১, ২, ৩, …)
                    ছড়িয়ে থাকবে।
                </p>

                <p className="instruction">
                    ২. আপনার কাজ হলো ১ থেকে ২, ২ থেকে ৩, ৩ থেকে ৪…
                    এই ক্রমে সংখ্যাগুলোকে দ্রুত এবং সঠিকভাবে যুক্ত করা।
                </p>

                <p className="instruction">
                    ৩. চেষ্টা করবেন যত দ্রুত সম্ভব, কিন্তু ভুল যেন না হয়।
                </p>

                <button
                    className="start-button"
                    onClick={() => {
                        setShowPartAInstructions(false);
                        setStarted(false);
                    }}
                >
                    Continue
                </button>

            </div>
        );
    }


    if (showPartBInstructions) {
        return (
            <div className="trail-making">

                <h1>Part B - নির্দেশনা (Trail Making Test)</h1>

                <p className="instruction">
                    ৪. এই অংশে সংখ্যার পাশাপাশি কিছু ইংরেজি অক্ষর
                    (A, B, C, …) থাকবে।
                </p>

                <p className="instruction">
                    ৫. আপনাকে ১ → A → ২ → B → ৩ → C…
                    এই ক্রমে সংখ্যা ও অক্ষরগুলো পর্যায়ক্রমে যুক্ত করতে হবে।
                </p>

                <p className="instruction">
                    ৬. এখানেও চেষ্টা করবেন যত দ্রুত সম্ভব, কিন্তু ভুল যেন না হয়।
                </p>

                <p className="instruction">
                    ৭. মোট সময়: প্রায় ৫–৮ মিনিট (Part A + Part B)।
                </p>

                <button
                    className="start-button"
                    onClick={() => {
                        setShowPartBInstructions(false);
                        startPartB();
                    }}
                >
                    Continue
                </button>

            </div>
        );
    }



    return (
        <div className="trail-making">

            {/* <h1>Trail Making Test</h1> */}

            {/* <p className="instruction">
                Click the circles in the correct order.
            </p> */}

            <div className="test-area">

                {circles.map(circle => (
                    <div
                        key={circle.value}
                        // className={`
                        //     trail-circle
                        //     ${
                        //         correctCircles.includes(circle.value)
                        //             ? "correct"
                        //             : ""
                        //     }
                        //     ${
                        //         wrongCircle === circle.value
                        //             ? "wrong"
                        //             : ""
                        //     }
                        // `}   // temporal comment


                        className={`
                            trail-circle
                            ${
                                correctCircles.includes(circle.value)
                                    ? "correct"
                                    : ""
                            }
                            ${
                                wrongCircle === circle.value
                                    ? "wrong"
                                    : ""
                            }
                            ${
                                circle.value === getExpectedValue() &&
                                !correctCircles.includes(circle.value)
                                    ? "target"
                                    : ""
                            }
                        `}


                        style={{
                            left: `${circle.x}%`,
                            top: `${circle.y}%`
                        }}
                        onClick={() => {
                            if (
                                !correctCircles.includes(circle.value)
                            ) {
                                handleClick(circle.value);
                            }
                        }}
                    >
                        {circle.value}
                    </div>
                ))}

            </div>

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

export default TrailMaking;
