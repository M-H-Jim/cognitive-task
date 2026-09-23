import { useEffect, useRef, useState } from "react";

import "./Treatment.css";

import article from "../content/article.txt?raw";


const TREATMENT_DURATION = 100; // total experiment time in seconds
const NUMBER_INTERVAL = 10;     // seconds between numbers
const NUMBER_DISPLAY_TIME = 2;  // how long a number stays visible
const TOTAL_SEVENS = 10;        // total number of 7s








function Treatment({ group, onComplete }) {
    const [started, setStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TREATMENT_DURATION);  // this should be 120 or something

    const [number, setNumber] = useState(null);

    const answeredRef = useRef(false);
    const sequenceRef = useRef([]);
    const indexRef = useRef(0);
    const completedRef = useRef(false);

    const [correctPresses, setCorrectPresses] = useState(0);
    const [falsePresses, setFalsePresses] = useState(0);
    const [missedSevens, setMissedSevens] = useState(0);

    // MCQ answers
    const [mcqAnswers, setMcqAnswers] = useState({
        mcq1: "",
        mcq2: "",
        mcq3: "",
        mcq4: ""
    });

    // --------------------------------------------------
    // MCQ QUESTIONS
    // --------------------------------------------------

    const questions = [
        {
            id: "mcq1",
            question:
                "What is one of the main reasons university students in Dhaka use food delivery apps, according to the passage?",
            options: {
                A: "To avoid paying for food",
                B: "To save time and manage busy schedules",
                C: "To support international restaurant chains",
                D: "To learn about new cooking techniques"
            }
        },
        {
            id: "mcq2",
            question:
                "How does the passage describe the working conditions of many delivery riders?",
            options: {
                A: "Highly secure with strong legal protections",
                B: "Flexible but well-paid with many benefits",
                C: "Often long, with low base pay and limited benefits",
                D: "Part-time only, with no night shifts"
            }
        },
        {
            id: "mcq3",
            question:
                "According to the passage, what is one potential negative effect of frequent restaurant food consumption facilitated by delivery apps?",
            options: {
                A: "Increased home cooking",
                B: "Improved family bonding",
                C: "Higher risk of health problems due to oily, salty, and sugary food",
                D: "Decreased use of social media"
            }
        },
        {
            id: "mcq4",
            question:
                "What broader issue does the passage say the rise of food delivery apps reflects?",
            options: {
                A: "Only technological progress",
                B: "Tensions between digitalization, labor rights, public health, and urban eating culture",
                C: "The decline of all local restaurants",
                D: "The end of home cooking for everyone"
            }
        }
    ];

    // --------------------------------------------------
    // Generate exactly 24 numbers:
    // 10 sevens + 14 non-sevens
    // --------------------------------------------------

    function generateNumberSequence() {
        const numbers = [];

        const totalNumbers = TREATMENT_DURATION / NUMBER_INTERVAL;
        const nonSevens = totalNumbers - TOTAL_SEVENS;


        // Add exactly 10 sevens
        for (let i = 0; i < TOTAL_SEVENS; i++) {
            numbers.push(7);
        }

        // Add non-seven numbers
        for (let i = 0; i < nonSevens; i++) {
            let randomNumber;

            do {
                randomNumber = Math.floor(Math.random() * 10);
            } while (randomNumber === 7);

            numbers.push(randomNumber);
        }

        // Shuffle the numbers
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }


        // If possible, make the first number non-7
        const nonSevenIndex = numbers.findIndex(
            (number) => number !== 7
        );

        if (nonSevenIndex !== -1 && numbers[0] === 7) {
            [numbers[0], numbers[nonSevenIndex]] =
                [numbers[nonSevenIndex], numbers[0]];
        }





        return numbers;
    }

    // --------------------------------------------------
    // Start the experiment
    // --------------------------------------------------

    function handleStart() {
        sequenceRef.current = generateNumberSequence();
        indexRef.current = 0;

        setTimeLeft(TREATMENT_DURATION); // this should be 120 or something
        setNumber(null);

        setCorrectPresses(0);
        setFalsePresses(0);
        setMissedSevens(0);

        setMcqAnswers({
            mcq1: "",
            mcq2: "",
            mcq3: "",
            mcq4: ""
        });

        answeredRef.current = false;
        completedRef.current = false;

        setStarted(true);
    }

    // --------------------------------------------------
    // MCQ answer handling
    // --------------------------------------------------

    function handleMcqChange(questionId, answer) {
        setMcqAnswers((previous) => ({
            ...previous,
            [questionId]: answer
        }));
    }

    // --------------------------------------------------
    // Main 120-second timer
    // --------------------------------------------------

    useEffect(() => {
        if (!started) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((time) => time - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [started]);

    // --------------------------------------------------
    // Finish treatment
    // --------------------------------------------------

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

            console.log("MCQ 1:", mcqAnswers.mcq1);
            console.log("MCQ 2:", mcqAnswers.mcq2);
            console.log("MCQ 3:", mcqAnswers.mcq3);
            console.log("MCQ 4:", mcqAnswers.mcq4);

            onComplete({
                correctPresses,
                falsePresses,
                missedSevens,

                mcq1: mcqAnswers.mcq1,
                mcq2: mcqAnswers.mcq2,
                mcq3: mcqAnswers.mcq3,
                mcq4: mcqAnswers.mcq4
            });
        }
    }, [
        started,
        timeLeft,
        group,
        correctPresses,
        falsePresses,
        missedSevens,
        mcqAnswers,
        onComplete
    ]);

    // --------------------------------------------------
    // Number sequence
    // --------------------------------------------------

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
                    setMissedSevens((count) => count + 1);
                }

                setNumber(null);


                nextTimer = setTimeout(showNextNumber, (NUMBER_INTERVAL - NUMBER_DISPLAY_TIME) * 1000);
            }, NUMBER_DISPLAY_TIME * 1000);
        }

        // First number appears immediately after Start
        showNextNumber();

        return () => {
            clearTimeout(nextTimer);
            clearTimeout(numberTimer);
        };
    }, [started, group]);

    // --------------------------------------------------
    // Spacebar handling
    // IMPORTANT:
    // Spacebar is ONLY for the number-monitoring task.
    // It cannot select or activate MCQ answers.
    // --------------------------------------------------

    useEffect(() => {
        if (!started || group === "Control") {
            return;
        }

        function handleKeyDown(event) {
            if (event.code !== "Space") {
                return;
            }

            // Stop Space from activating focused buttons,
            // radio inputs, etc.
            event.preventDefault();
            event.stopPropagation();

            // Space does nothing unless a number is currently visible.
            if (number === null || answeredRef.current) {
                return;
            }

            answeredRef.current = true;

            if (number === 7) {
                setCorrectPresses((count) => count + 1);
            } else {
                setFalsePresses((count) => count + 1);
            }

            // Participant responded,
            // so hide the number immediately.
            setNumber(null);
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [started, group, number]);

    // --------------------------------------------------
    // Group instructions
    // --------------------------------------------------

    let instruction = "";

    if (group === "AI") {
        instruction =
            "You may use ChatGPT or Gemini to help you with the task.";
    } else if (group === "Non-AI") {
        instruction =
            "Complete the task without using ChatGPT, Gemini, or other AI tools.";
    } else if (group === "Control") {
        instruction =
            "Read the article carefully and answer the questions below.";
    }

    // --------------------------------------------------
    // Instruction screen
    // --------------------------------------------------
    if (!started) {
        return (
            <div className="treatment">

                <div className="treatment-instructions">

                    <h1>নির্দেশনা</h1>

                    {group === "AI" && (
                        <>
                            <h2>Group 1: AI-Assisted Multitasking</h2>

                            <p>
                                ১. আপনার সামনে একটি ইংরেজি প্যাসেজ (প্রায় ৩৫০ শব্দ)
                                এবং এরপর ৪টি বহুনির্বাচনী প্রশ্ন (MCQ) থাকবে।
                            </p>

                            <p>
                                ২. আপনার কাজ হলো প্যাসেজটি মনোযোগ দিয়ে পড়া এবং
                                MCQ গুলোর সঠিক উত্তর নির্বাচন করা।
                            </p>

                            <p>
                                ৩. প্যাসেজ পড়ার সময় স্ক্রিনে মাঝে মাঝে কিছু সংখ্যা
                                (১–৯) দেখা যাবে। যখনই আপনি 7 নম্বরটি দেখবেন,
                                তখনই Spacebar চাপবেন। অন্য সংখ্যাগুলোর জন্য
                                কোনো বাটন চাপতে হবে না।
                            </p>

                            <p>
                                ৪. আপনি চাইলে ChatGPT ব্যবহার করে কঠিন শব্দের অর্থ
                                বা বাক্যের ভাব বুঝতে পারেন। তবে পুরো প্যাসেজ বা
                                প্রশ্ন কপি করে AI দিয়ে উত্তর লিখে নেওয়া যাবে না।
                                AI শুধু word meaning বা sentence comprehension-এর
                                জন্য ব্যবহার করবেন।
                            </p>

                            <p>
                                ৫. এই কাজের জন্য মোট সময়:{" "}
                                <strong>{TREATMENT_DURATION / 60} মিনিট</strong>।
                                এই সময়ের মধ্যে আপনাকে প্যাসেজ পড়া, MCQ-এর উত্তর
                                দেওয়া এবং সংখ্যার দিকে খেয়াল রেখে 7 এলে Spacebar
                                চাপা—সব শেষ করতে হবে।
                            </p>

                            <h3>Number Monitoring</h3>

                            <p>
                                Article পড়ার সময় স্ক্রিনে প্রতি{" "}
                                <strong>{NUMBER_INTERVAL} সেকেন্ড</strong> পর
                                একটি random সংখ্যা আসবে।
                            </p>

                            <p>
                                উদাহরণ: 3 → 7 → 2 → 9 → 7 → 4
                            </p>

                            <p>
                                <strong>
                                    "যখনই 7 দেখবেন, Spacebar চাপবেন।"
                                </strong>
                            </p>

                            <p>
                                <strong>AI Assistance:</strong> আপনি ChatGPT ব্যবহার
                                করতে পারবেন। কোনো টেক্সটের শব্দার্থ (word meaning)
                                বা বাক্য অনুধাবনের (sentence comprehension) জন্য
                                AI ব্যবহার করা যাবে। তবে পুরো লাইন কপি-পেস্ট করে
                                দেওয়া যাবে না।
                            </p>
                        </>
                    )}

                    {group === "Non-AI" && (
                        <>
                            <h2>Group 2: Non-AI Multitasking</h2>

                            <p>
                                ১. আপনার সামনে একটি ইংরেজি প্যাসেজ (প্রায় ৩৫০ শব্দ)
                                এবং এরপর ৪টি বহুনির্বাচনী প্রশ্ন (MCQ) থাকবে।
                            </p>

                            <p>
                                ২. আপনার কাজ হলো প্যাসেজটি মনোযোগ দিয়ে পড়া এবং
                                MCQ গুলোর সঠিক উত্তর নির্বাচন করা।
                            </p>

                            <p>
                                ৩. প্যাসেজ পড়ার সময় স্ক্রিনে মাঝে মাঝে কিছু সংখ্যা
                                (১–৯) দেখা যাবে। যখনই আপনি 7 নম্বরটি দেখবেন,
                                তখনই Spacebar চাপবেন। অন্য সংখ্যাগুলোর জন্য
                                কোনো বাটন চাপতে হবে না।
                            </p>

                            <p>
                                ৪. এই গ্রুপে কোনো AI টুল (যেমন ChatGPT)
                                ব্যবহার করা যাবে না।
                            </p>

                            <p>
                                ৫. এই কাজের জন্য মোট সময়:{" "}
                                <strong>{TREATMENT_DURATION / 60} মিনিট</strong>।
                                এই সময়ের মধ্যে আপনাকে প্যাসেজ পড়া, MCQ-এর উত্তর
                                দেওয়া এবং সংখ্যার দিকে খেয়াল রেখে 7 এলে Spacebar
                                চাপা—সব শেষ করতে হবে।
                            </p>

                            <h3>Number Monitoring</h3>

                            <p>
                                উদাহরণ: 3 → 7 → 2 → 9 → 7 → 4
                            </p>

                            <p>
                                <strong>
                                    7 দেখলে Spacebar চাপতে হবে।
                                </strong>
                            </p>
                        </>
                    )}

                    {group === "Control" && (
                        <>
                            <h2>Group 3: Single-Task Control</h2>

                            <p>
                                ১. আপনার সামনে একটি ইংরেজি প্যাসেজ (প্রায় ৩৫০ শব্দ)
                                এবং এরপর ৪টি বহুনির্বাচনী প্রশ্ন (MCQ) থাকবে।
                            </p>

                            <p>
                                ২. আপনার কাজ হলো প্যাসেজটি মনোযোগ দিয়ে পড়া এবং
                                MCQ গুলোর সঠিক উত্তর নির্বাচন করা।
                            </p>

                            <p>
                                ৩. এই গ্রুপে স্ক্রিনে কোনো সংখ্যা দেখা যাবে না।
                                আপনাকে শুধু প্যাসেজ পড়ে MCQ-এর উত্তর দিতে হবে।
                            </p>

                            <p>
                                ৪. এই গ্রুপে কোনো AI টুল (যেমন ChatGPT)
                                ব্যবহার করা যাবে না।
                            </p>

                            <p>
                                ৫. এই কাজের জন্য মোট সময়:{" "}
                                <strong>{TREATMENT_DURATION / 60} মিনিট</strong>।
                                এই সময়ের মধ্যে আপনাকে প্যাসেজ পড়া এবং
                                MCQ-এর উত্তর দেওয়া শেষ করতে হবে।
                            </p>
                        </>
                    )}

                    <button
                        className="start-button"
                        onClick={handleStart}
                    >
                        পরীক্ষা শুরু করুন
                    </button>

                </div>

            </div>
        );
    }








    // --------------------------------------------------
    // Experiment screen
    // --------------------------------------------------

    return (
        <div className="treatment">

            <div className="article">
                <h2>Read the Article</h2>
                <h3>The Rise of Food Delivery Apps in Dhaka: Convenience at What Cost?</h3>

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

            {/* --------------------------------------------------
                MCQs
            -------------------------------------------------- */}

            <div className="mcq-section">

                <h2>Questions</h2>

                {questions.map((question, index) => (
                    <div
                        className="mcq-question"
                        key={question.id}
                    >
                        <h3>
                            Q{index + 1}. {question.question}
                        </h3>

                        <div className="mcq-options">

                            {Object.entries(question.options).map(
                                ([letter, text]) => (
                                    <label
                                        className="mcq-option"
                                        key={letter}
                                    >
                                        <input
                                            type="radio"
                                            name={question.id}
                                            value={letter}
                                            checked={
                                                mcqAnswers[question.id] ===
                                                letter
                                            }
                                            onChange={() =>
                                                handleMcqChange(
                                                    question.id,
                                                    letter
                                                )
                                            }
                                        />

                                        <span>
                                            {letter}. {text}
                                        </span>
                                    </label>
                                )
                            )}

                        </div>
                    </div>
                ))}

            </div>

        </div>
    );
}

export default Treatment;
