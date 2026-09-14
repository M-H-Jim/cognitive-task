import { useState } from "react";
import "./App.css";
import Corsi from "./tests/Corsi/Corsi";
import DigitSpan from "./tests/DigitSpan/DigitSpan";
import TrailMaking from "./tests/TrailMaking/TrailMaking";

function App() {

    const [name, setName] = useState("");
    const [screen, setScreen] = useState("start");

    const [corsiScore, setCorsiScore] = useState(null);
    const [digitSpanScore, setDigitSpanScore] = useState(null);
    const [trailMakingResult, setTrailMakingResult] = useState(null);

    function startStudy() {

        if (name.trim() === "") {
            alert("Please enter your name.");
            return;
        }

        setScreen("corsi");
    }

    function handleCorsiComplete(score) {
        setCorsiScore(score)
        console.log("Corsi score:", score);

        setScreen("digit-span");
    }

    function handleDigitSpanComplete(score) {
        setDigitSpanScore(score);
        console.log("Digit Span score:", score);
        setScreen("trail-making");
    }

    function handleTrailMakingComplete(result) {
        setTrailMakingResult(result);
        console.log("Trail Making result:", result);
        setScreen("results");
    }

    async function saveResults() {
        try {
            const response = await fetch("http://localhost:3000/participants", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    corsi_score: corsiScore,
                    digit_span_score: digitSpanScore,
                    trail_a: trailMakingResult.partA,
                    trail_b: trailMakingResult.partB,
                    trail_difference: trailMakingResult.difference
                })
            });

            const data = await response.json();

            console.log("Saved participant:", data);
            alert("Results saved successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to save results.");
        }
    }


    return (
        <div className="app">

            {screen === "start" && (

                <div className="card">

                    <h1>Psychology Research Study</h1>

                    <p>Please enter your name to begin.</p>

                    <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />

                    <button onClick={startStudy}>
                        Start Study
                    </button>

                </div>

            )}

            {screen === "corsi" && (
                <Corsi onComplete={handleCorsiComplete} />
            )}

            {screen === "digit-span" && (
                <DigitSpan onComplete={handleDigitSpanComplete} />
            )}
            {screen === "trail-making" && (
                <TrailMaking onComplete={handleTrailMakingComplete} />
            )}
            {screen === "results" && (
                <div className="card">
                    <h1>Results</h1>

                    <p>Corsi: {corsiScore}</p>
                    <p>Digit Span: {digitSpanScore}</p>
                    <p>Trail A: {trailMakingResult?.partA.toFixed(2)}s</p>
                    <p>Trail B: {trailMakingResult?.partB.toFixed(2)}s</p>
                    <p>B − A: {trailMakingResult?.difference.toFixed(2)}s</p>

                    <button onClick={saveResults}>
                        Save Results
                    </button>
                </div>
            )}



        </div>
    );
}

export default App;