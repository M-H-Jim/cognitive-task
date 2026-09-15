import { useState } from "react";
import "./Summary.css";

function Summary({ group, onComplete }) {

    const [summary, setSummary] = useState("");

    let instruction = "";

    if (group === "AI") {
        instruction =
            "Write a summary of the article. You may use ChatGPT or Gemini to help you, but do not let AI write the entire summary for you.";
    }
    else if (group === "Non-AI") {
        instruction =
            "Write a summary of the article. Do not use ChatGPT, Gemini, or any other AI tools.";
    }
    else if (group === "Control") {
        instruction =
            "Write a summary of the article.";
    }

    function handleSubmit() {

        if (summary.trim() === "") {
            alert("Please write your summary.");
            return;
        }

        onComplete(summary);
    }

    return (
        <div className="summary">

            <h1>Write Your Summary</h1>

            <p>{instruction}</p>

            <textarea
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder="Write your summary here..."
            />

            <button onClick={handleSubmit}>
                Submit Summary
            </button>

        </div>
    );
}

export default Summary;