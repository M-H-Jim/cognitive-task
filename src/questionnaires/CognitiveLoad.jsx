import { useState } from "react";
import "./CognitiveLoad.css";

function CognitiveLoad({ onComplete }) {

    // Replace these 15 questions later with the approved Bangla questions.
    const cltQuestions = [
        "শেখার বিষয়বস্তু বুঝতে কঠিন ছিল।",
        "শেখার বিষয়বস্তুর ব্যাখ্যাগুলো বুঝতে কঠিন ছিল।",
        "শেখার বিষয়বস্তু জটিল ছিল।",
        "শেখার বিষয়বস্তুর মধ্যে অনেক জটিল তথ্য ছিল।",
        "পূর্ব জ্ঞান ছাড়া তথ্যগুলো বোধগম্য ছিল না।",
        "শেখার উপকরণের কাঠামো সম্পর্কে সামগ্রিক ধারণা পাওয়া কঠিন ছিল।",
        "শেখার উপকরণের নকশার কারণে পৃথক তথ্য-এককগুলোর মধ্যে সম্পর্ক শনাক্ত করা কঠিন ছিল।",
        "শেখার উপকরণের নকশা ব্যবহার-অনুপযোগী ছিল।",
        "শেখার উপকরণের নকশার কারণে প্রাসঙ্গিক তথ্য দ্রুত খুঁজে পাওয়া কঠিন ছিল।",
        "শেখার উপকরণের নকশার কারণে আমার মনে হয়েছিল যে শেখার বিষয়বস্তুতে মনোযোগ দিতে পারছি না।",
        "আমি শেখার বিষয়বস্তু নিয়ে সক্রিয়ভাবে চিন্তা করেছি।",
        "শেখার বিষয়বস্তু বোঝার জন্য আমি চেষ্টা করেছি।",
        "আমি শেখার বিষয়বস্তু সম্পর্কে সামগ্রিক/গভীর ধারণা অর্জন করেছি।",
        "শেখার বিষয়বস্তুর মাধ্যমে আমি আমার পূর্বজ্ঞানকে আরও বিস্তৃত করতে পেরেছি।",
        "শেখার উপকরণের মাধ্যমে অর্জিত জ্ঞান আমি দ্রুত ও নিখুঁতভাবে প্রয়োগ করতে পারি।"
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

<div className="instruction">
    <p>
        <strong>নির্দেশনা:</strong> নিচের প্রতিটি বিবৃতি পড়ে
        আপনার অভিজ্ঞতার সঙ্গে কতটা মিলে তা নির্ধারণ করুন।
    </p>

    <p>
        প্রতিটি বিবৃতির জন্য নিচের ১ থেকে ৯-এর স্কেল ব্যবহার করুন।
    </p>

    <ol className="scale-guide">
        <li><strong>১</strong> = একদমই প্রযোজ্য নয়</li>
        <li><strong>২</strong> = খুব কম প্রযোজ্য</li>
        <li><strong>৩</strong> = কম প্রযোজ্য</li>
        <li><strong>৪</strong> = কিছুটা প্রযোজ্য</li>
        <li><strong>৫</strong> = মাঝামাঝি/নিরপেক্ষ</li>
        <li><strong>৬</strong> = মোটামুটি প্রযোজ্য</li>
        <li><strong>৭</strong> = বেশ প্রযোজ্য</li>
        <li><strong>৮</strong> = খুব বেশি প্রযোজ্য</li>
        <li><strong>৯</strong> = সম্পূর্ণভাবে প্রযোজ্য</li>
    </ol>

    <p>
        প্রতিটি আইটেমের জন্য ১ থেকে ৯-এর মধ্যে শুধুমাত্র
        একটি ঘরে টিক (✓) দিন। কোনো সঠিক বা ভুল উত্তর নেই।
    </p>
</div>

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
                                        handleCltChange(index, value)
                                    }
                                />

                                {value}

                                <span className="scale-label">
                                    {
                                        [
                                            "একদমই প্রযোজ্য নয়",
                                            "খুব কম প্রযোজ্য",
                                            "কম প্রযোজ্য",
                                            "কিছুটা প্রযোজ্য",
                                            "মাঝামাঝি/নিরপেক্ষ",
                                            "মোটামুটি প্রযোজ্য",
                                            "বেশ প্রযোজ্য",
                                            "খুব বেশি প্রযোজ্য",
                                            "সম্পূর্ণভাবে প্রযোজ্য"
                                        ][value - 1]
                                    }
                                </span>

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