import { useState } from "react";
import "./ADEXI.css";

function ADEXI({ onComplete }) {
    const adexiQuestions = [
        "আমার বড় নির্দেশনা মনে রাখতে অসুবিধা হয়।",
        "কোনো কাজের মাঝখানে আমি কী করছিলাম তা মনে রাখতে আমার অসুবিধা হয়।",
        "কী ঘটতে পারে তা আগে না ভেবেই কাজ করে ফেলার প্রবণতা আমার আছে।",
        "কেউ নিষেধ করলেও, আমার পছন্দের কোনো কাজ থেকে নিজেকে থামাতে আমার অসুবিধা হয়।",
        "কেউ আমাকে একসাথে কয়েকটি কাজ করতে বললে, আমি কেবল প্রথমটি বা শেষটি মনে রাখি।",
        "অনুপযুক্ত পরিস্থিতিতে হাসি বা হাসাহাসি থেকে বিরত থাকতে আমার অসুবিধা হয়।",
        "কোনো সমস্যায় আটকে গেলে সমাধানের ভিন্ন উপায় ভেবে বের করতে আমার অসুবিধা হয়।",
        "কেউ আমাকে কিছু আনতে বললে, আমি কী আনব তা ভুলে যাই।",
        "কোনো কাজের পরিকল্পনা করতে আমার অসুবিধা হয়; (যেমন: ভ্রমণে,কর্মস্থলে বা স্কুলে যাওয়ার সময় প্রয়োজনীয় সবকিছু সঙ্গে নিতে মনে রাখা)।",
        "পছন্দের কোনো কাজ থামাতে আমার অসুবিধা হয় (যেমন, ঘুমানোর সময় হয়ে গেলেও সন্ধ্যায় টিভি দেখা বা কম্পিউটারের সামনে বসে থাকা)।",
        "কীভাবে করতে হয় তা দেখিয়ে না দিলে, শুধু মৌখিক নির্দেশনা বুঝতে আমার অসুবিধা হয়।",
        "একাধিক ধাপযুক্ত কাজের ক্ষেত্রে  আমার অসুবিধা হয়।",
        "আগে থেকে ভাবতে বা অভিজ্ঞতা থেকে শিখতে আমার অসুবিধা হয়।",
        "যাদের সঙ্গে আমার দেখা হয়, তারা আমাকে সমবয়সী অন্যদের তুলনায় বেশি প্রাণবন্ত বা চঞ্চল মনে করে।"
    ];

    const scaleLabels = [
        "একেবারেই সত্য নয়",
        "সত্য নয়",
        "আংশিক সত্য",
        "সত্য",
        "সম্পূর্ণ সত্য"
    ];

    const [adexiAnswers, setAdexiAnswers] = useState(
        Array(14).fill(null)
    );

    function handleAnswerChange(index, value) {
        const answers = [...adexiAnswers];
        answers[index] = value;
        setAdexiAnswers(answers);
    }

    function handleSubmit() {
        if (adexiAnswers.includes(null)) {
            alert("অনুগ্রহ করে সবগুলো প্রশ্নের উত্তর দিন।");
            return;
        }

        onComplete({
            adexi: adexiAnswers
        });
    }

    return (
        <div className="adexi">
            <div className="instruction">
                <h2>
                    প্রাপ্তবয়স্ক নির্বাহী কার্যক্ষমতার তালিকা
                    (ADEXI) — স্ব-প্রতিবেদন
                </h2>

                <p>
                    <strong>নির্দেশনা:</strong> নিচে কিছু বিবৃতি দেওয়া আছে। প্রতিটি বিবৃতির ডানদিকে একটি সংখ্যা বৃত্ত দিয়ে চিহ্নিত করুন, যা বোঝায় বিবৃতিটি আপনাকে ব্যক্তি হিসেবে কতটা ভালোভাবে বর্ণনা করে। আপনার পরিচিত মানুষেরা আপনার সম্পর্কে ভিন্নভাবে ভাবতে পারেন। আমরা জানতে চাই আপনি নিজের সম্পর্কে কী মনে করেন। যথাসম্ভব সৎভাবে উত্তর দিন।
                </p>

                <p>
                    প্রতিটি বিবৃতির জন্য ১ থেকে ৫-এর স্কেল ব্যবহার করুন।
                </p>

                <ol className="scale-guide">
                    {scaleLabels.map((label, index) => (
                        <li key={index}>
                            <strong>{index + 1}</strong> = {label}
                        </li>
                    ))}
                </ol>
            </div>

            <section>
                <h2>ADEXI Questionnaire</h2>

                {adexiQuestions.map((question, index) => (
                    <div className="question" key={index}>
                        <p>
                            <strong>{index + 1}.</strong>{" "}
                            {question}
                        </p>

                        <div className="scale">
                            {scaleLabels.map((label, i) => {
                                const value = i + 1;

                                return (
                                    <label key={value}>
                                        <input
                                            type="radio"
                                            name={`adexi-${index}`}
                                            value={value}
                                            checked={
                                                adexiAnswers[index] === value
                                            }
                                            onChange={() =>
                                                handleAnswerChange(
                                                    index,
                                                    value
                                                )
                                            }
                                        />
                                        {value}
                                        <span className="scale-label">
                                            {label}
                                        </span>
                                    </label>
                                );
                            })}
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

export default ADEXI;
