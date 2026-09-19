import { useState } from "react";
import "./App.css";
import Corsi from "./tests/Corsi/Corsi";
import DigitSpan from "./tests/DigitSpan/DigitSpan";
import TrailMaking from "./tests/TrailMaking/TrailMaking";
import Treatment from "./treatment/Treatment";
import article from "./content/article.txt?raw";
import Summary from "./summary/Summary";
import CognitiveLoad from "./questionnaires/CognitiveLoad";

function App() {

    const [name, setName] = useState("");
    const [screen, setScreen] = useState("start");

    const [preCorsiScore, setPreCorsiScore] = useState(null); // this must be null
    const [preCorsiPercentile, setPreCorsiPercentile] = useState(null);

    const [preDigitSpanScore, setPreDigitSpanScore] = useState(null); // this must be null
    const [preDigitSpanPercentile, setPreDigitSpanPercentile] = useState(null);
    // const [preTrailMakingResult, setPreTrailMakingResult] = useState(null); // this must be null
    const [preTrailMakingResult, setPreTrailMakingResult] = useState({
        partA: 0,
        partB: 0,
        difference: 0,
        percentile: 0
    });

    const [group, setGroup] = useState(null);
    const [correctPresses, setCorrectPresses] = useState(null);
    const [falsePresses, setFalsePresses] = useState(null);
    const [missedSevens, setMissedSevens] = useState(null);

    const [summary, setSummary] = useState("");

    const [postCorsiScore, setPostCorsiScore] = useState(null);
    const [postCorsiPercentile, setPostCorsiPercentile] = useState(null);

    const [postDigitSpanScore, setPostDigitSpanScore] = useState(null);
    // const [postTrailMakingResult, setPostTrailMakingResult] = useState(null);
    const [postDigitSpanPercentile, setPostDigitSpanPercentile] = useState(null);

    const [postTrailMakingResult, setPostTrailMakingResult] = useState({
        partA: 0,
        partB: 0,
        difference: 0,
        percentile: 0
    });


    const [cognitiveLoad, setCognitiveLoad] = useState(null);




    function startStudy() {

        if (name.trim() === "") {
            alert("Please enter your name.");
            return;
        }

        setScreen("corsi"); // this should be corsi but for now group
        // temp
        const groups = ["AI", "Non-AI", "Control"];
        const randomGroup = groups[Math.floor(Math.random() * groups.length)];

        setGroup(randomGroup);
        // del this
    }

    function handlePreCorsiComplete({ score, percentile }) {

        setPreCorsiScore(score);
        setPreCorsiPercentile(percentile);

        console.log("Pre-Corsi score:", score);
        console.log("Pre-Corsi percentile:", percentile);

        setScreen("digit-span");    // digit-span
    }
    function handlePreDigitSpanComplete({ score, percentile }) {
        setPreDigitSpanScore(score);
        setPreDigitSpanPercentile(percentile);

        console.log("Pre-Digit Span score:", score);
        console.log("Pre-Digit Span percentile:", percentile);

        setScreen("trail-making");   // trail-making
    }

    function handlePreTrailMakingComplete(result) {
        setPreTrailMakingResult(result);
        console.log("Pre-Trail Making result:", result);
        setScreen("treatment"); // treatment
    }


    function handlePostCorsiComplete({ score, percentile }) {

        setPostCorsiScore(score);
        setPostCorsiPercentile(percentile);

        console.log("Post-Corsi score:", score);
        console.log("Post-Corsi percentile:", percentile);

        setScreen("post-digit-span");
    }

    function handlePostDigitSpanComplete({ score, percentile }) {
        setPostDigitSpanScore(score);
        setPostDigitSpanPercentile(percentile);

        console.log("Post-Digit Span score:", score);
        console.log("Post-Digit Span percentile:", percentile);

        setScreen("post-trail-making");
    }

    function handlePostTrailMakingComplete(result) {
        setPostTrailMakingResult(result);
        console.log("Post-Trail Making result:", result);
        setScreen("cognitive-load");
    }



    async function saveResults() {
        try {
            const response = await fetch("https://cognitive-task-l4lp.vercel.app/participants", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    group_name: group,
                    corsi_score: preCorsiScore,
                    corsi_percentile: preCorsiPercentile,
                    digit_span_score: preDigitSpanScore,
                    digit_span_percentile: preDigitSpanPercentile,
                    trail_a: preTrailMakingResult.partA,
                    trail_b: preTrailMakingResult.partB,
                    trail_difference: preTrailMakingResult.difference,
                    trail_b_percentile: preTrailMakingResult.percentile,
                    correct_presses: correctPresses,
                    false_presses: falsePresses,
                    missed_sevens: missedSevens,
                    summary: summary,
                    post_corsi_score: postCorsiScore,
                    post_corsi_percentile: postCorsiPercentile,
                    post_digit_span_score: postDigitSpanScore,
                    post_digit_span_percentile: postDigitSpanPercentile,
                    post_trail_b_percentile: postTrailMakingResult.percentile,
                    post_trail_a: postTrailMakingResult.partA,
                    post_trail_b: postTrailMakingResult.partB,
                    post_trail_difference: postTrailMakingResult.difference,

                    // Cognitive Load - CLT
                    clt_01: cognitiveLoad?.clt?.[0],
                    clt_02: cognitiveLoad?.clt?.[1],
                    clt_03: cognitiveLoad?.clt?.[2],
                    clt_04: cognitiveLoad?.clt?.[3],
                    clt_05: cognitiveLoad?.clt?.[4],
                    clt_06: cognitiveLoad?.clt?.[5],
                    clt_07: cognitiveLoad?.clt?.[6],
                    clt_08: cognitiveLoad?.clt?.[7],
                    clt_09: cognitiveLoad?.clt?.[8],
                    clt_10: cognitiveLoad?.clt?.[9],
                    clt_11: cognitiveLoad?.clt?.[10],
                    clt_12: cognitiveLoad?.clt?.[11],
                    clt_13: cognitiveLoad?.clt?.[12],
                    clt_14: cognitiveLoad?.clt?.[13],
                    clt_15: cognitiveLoad?.clt?.[14]


                })
            });

            if (!response.ok) {
                throw new Error("Server failed to save results.");
            }

            const data = await response.json();

            console.log("Saved participant:", data);

            // Keep your success alert
            alert("Results saved successfully!");

            // Only leave the results screen after successful save
            setScreen("start");

        } catch (error) {
            console.error(error);

            // Stay on the results screen so they can try again
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
                <Corsi onComplete={handlePreCorsiComplete} />
            )}

            {screen === "digit-span" && (
                <DigitSpan onComplete={handlePreDigitSpanComplete} />
            )}
            {screen === "trail-making" && (
                <TrailMaking onComplete={handlePreTrailMakingComplete} />
            )}

            {screen === "treatment" && (
                <Treatment
                    group={group}
                    onComplete={(results) => {
                        setCorrectPresses(results.correctPresses);
                        setFalsePresses(results.falsePresses);
                        setMissedSevens(results.missedSevens);

                        setScreen("summary");
                    }}
                />
            )}
            {screen === "summary" && (
                <Summary
                    group={group}
                    onComplete={(summaryText) => {
                        setSummary(summaryText);
                        setScreen("post-corsi");
                    }}
                />
            )}

            {screen === "post-corsi" && (
                <Corsi onComplete={handlePostCorsiComplete} />
            )}

            {screen === "post-digit-span" && (
                <DigitSpan onComplete={handlePostDigitSpanComplete} />
            )}

            {screen === "post-trail-making" && (
                <TrailMaking onComplete={handlePostTrailMakingComplete} />
            )}

            {screen === "cognitive-load" && (
                <CognitiveLoad
                    onComplete={(answers) => {
                        setCognitiveLoad(answers);
                        setScreen("results");
                    }}
                />
            )}


            {screen === "results" && (
                <div className="card">
                    <h1>Results</h1>

                    <p>Corsi: {preCorsiScore}</p>
                    <p>Digit Span: {preDigitSpanScore}</p>
                    <p>Trail A: {preTrailMakingResult?.partA.toFixed(2)}s</p>
                    <p>Trail B: {preTrailMakingResult?.partB.toFixed(2)}s</p>
                    <p>B − A: {preTrailMakingResult?.difference.toFixed(2)}s</p>
                    <p>
                        <strong>Summary:</strong>
                    </p>

                    <p>{summary}</p>

                    <p>Post-Corsi: {postCorsiScore}</p>
                    <p>Post-Digit Span: {postDigitSpanScore}</p>

                    <p>
                        Post-Trail A: {postTrailMakingResult?.partA.toFixed(2)}s
                    </p>

                    <p>
                        Post-Trail B: {postTrailMakingResult?.partB.toFixed(2)}s
                    </p>

                    <p>
                        Post B − A: {postTrailMakingResult?.difference.toFixed(2)}s
                    </p>







                    <button onClick={saveResults}>
                        Save Results
                    </button>
                </div>
            )}



        </div>
    );
}

export default App;