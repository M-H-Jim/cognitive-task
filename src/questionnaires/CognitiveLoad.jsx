import { useState } from "react";
import "./CognitiveLoad.css";

function CognitiveLoad({ onComplete }) {

    // Replace these 15 questions later with the approved Bangla questions.
    const cltQuestions = [
        "এই কাজটি করতে আমার অনেক মানসিক প্রচেষ্টা প্রয়োজন হয়েছে।",
        "এই কাজটি সম্পন্ন করা আমার জন্য কঠিন ছিল।",
        "এই কাজটি করতে আমার মনোযোগ ধরে রাখা কঠিন ছিল।",
        "এই কাজটি করার সময় আমাকে অনেক চিন্তা করতে হয়েছে।",
        "এই কাজটি করতে আমার অনেক মানসিক শক্তি ব্যবহার করতে হয়েছে।",
        "এই কাজটি করার সময় তথ্যগুলো মনে রাখা কঠিন ছিল।",
        "এই কাজটি করার সময় আমার চিন্তাভাবনার উপর অনেক চাপ অনুভূত হয়েছে।",
        "এই কাজটি করার সময় একসঙ্গে অনেক বিষয় নিয়ে ভাবতে হয়েছে।",
        "এই কাজটি সম্পন্ন করতে আমার অনেক মনোযোগ দিতে হয়েছে।",
        "এই কাজটি করার সময় আমার মানসিক চাপ বেশি অনুভূত হয়েছে।",
        "এই কাজটি করার সময় তথ্য প্রক্রিয়া করা কঠিন মনে হয়েছে।",
        "এই কাজটি করার সময় আমার চিন্তার গতি ধীর হয়ে গেছে বলে মনে হয়েছে।",
        "এই কাজটি করার সময় বিভিন্ন তথ্য একসঙ্গে সামলানো কঠিন ছিল।",
        "এই কাজটি করার সময় আমার মানসিক ক্ষমতার উপর বেশি চাপ পড়েছে।",
        "সামগ্রিকভাবে, এই কাজটি আমার জন্য মানসিকভাবে কঠিন ছিল।"
    ];

    const [cltAnswers, setCltAnswers] = useState(
        Array(15).fill(null)
    );

    function handleCltChange(index, value) {
        const answers = [...cltAnswers];

        answers[index] = value;

        setCltAnswers(answers);
    }

    function handleSubmit() {

        if (cltAnswers.includes(null)) {
            alert("অনুগ্রহ করে সবগুলো প্রশ্নের উত্তর দিন।");
            return;
        }

        console.log("Cognitive Load Answers:");
        console.log("CLT:", cltAnswers);

        onComplete({
            clt: cltAnswers
        });
    }

    return (
        <div className="cognitive-load">

            <h1>জ্ঞানীয় চাপের প্রশ্নমালা</h1>

            <p className="instruction">
                প্রতিটি প্রশ্নের জন্য আপনার অভিজ্ঞতার সাথে সবচেয়ে বেশি মিল আছে এমন উত্তর নির্বাচন করুন।
            </p>

            <section>

                <h2>Cognitive Load Questionnaire</h2>

                {cltQuestions.map((question, index) => (

                    <div className="question" key={index}>

                        <p>
                            <strong>{index + 1}.</strong>{" "}
                            {question}
                        </p>

                        <div className="scale">

                            {Array.from(
                                { length: 9 },
                                (_, i) => i + 1
                            ).map(value => (

                                <label key={value}>

                                    <input
                                        type="radio"
                                        name={`clt-${index}`}
                                        value={value}
                                        checked={
                                            cltAnswers[index] === value
                                        }
                                        onChange={() =>
                                            handleCltChange(
                                                index,
                                                value
                                            )
                                        }
                                    />

                                    {value}

                                </label>

                            ))}

                        </div>

                    </div>

                ))}

            </section>

            <button onClick={handleSubmit}>
                জমা দিন
            </button>

        </div>
    );
}

export default CognitiveLoad;