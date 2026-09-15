import { useState } from "react";
import "./CognitiveLoad.css";

function CognitiveLoad({ onComplete }) {

    const cltQuestions = Array.from(
        { length: 15 },
        (_, index) => `Dummy CLT question ${index + 1}`
    );

    const leppinkQuestions = Array.from(
        { length: 10 },
        (_, index) => `Dummy Leppink question ${index + 1}`
    );

    const [cltAnswers, setCltAnswers] = useState(
        Array(15).fill(null)
    );

    const [leppinkAnswers, setLeppinkAnswers] = useState(
        Array(10).fill(null)
    );

    const [paasAnswer, setPaasAnswer] = useState(null);

    function handleCltChange(index, value) {
        const answers = [...cltAnswers];
        answers[index] = value;
        setCltAnswers(answers);
    }

    function handleLeppinkChange(index, value) {
        const answers = [...leppinkAnswers];
        answers[index] = value;
        setLeppinkAnswers(answers);
    }

    function handleSubmit() {

        if (cltAnswers.includes(null)) {
            alert("Please answer all CLT questions.");
            return;
        }

        if (leppinkAnswers.includes(null)) {
            alert("Please answer all Leppink questions.");
            return;
        }

        if (paasAnswer === null) {
            alert("Please answer the mental effort question.");
            return;
        }


        console.log("Cognitive Load Answers:");
        console.log("CLT:", cltAnswers);
        console.log("Leppink:", leppinkAnswers);
        console.log("Paas:", paasAnswer);




        onComplete({
            clt: cltAnswers,
            leppink: leppinkAnswers,
            paas: paasAnswer
        });
    }

    return (
        <div className="cognitive-load">

            <h1>Cognitive Load Questionnaire</h1>

            {/* CLT */}
            <section>
                <h2>Cognitive Load Theory Questionnaire</h2>

                <p>
                    Please select the answer that best represents
                    your experience.
                </p>

                {cltQuestions.map((question, index) => (
                    <div className="question" key={index}>

                        <p>
                            <strong>{index + 1}.</strong>{" "}
                            {question}
                        </p>

                        <div className="scale">
                            {Array.from({ length: 9 }, (_, i) => i + 1).map(
                                value => (
                                    <label key={value}>
                                        <input
                                            type="radio"
                                            name={`clt-${index}`}
                                            value={value}
                                            checked={cltAnswers[index] === value}
                                            onChange={() =>
                                                handleCltChange(index, value)
                                            }
                                        />
                                        {value}
                                    </label>
                                )
                            )}
                        </div>

                    </div>
                ))}
            </section>

            {/* Leppink */}
            <section>
                <h2>Leppink Cognitive Load Scale</h2>

                {leppinkQuestions.map((question, index) => (
                    <div className="question" key={index}>

                        <p>
                            <strong>{index + 1}.</strong>{" "}
                            {question}
                        </p>

                        <div className="scale">
                            {Array.from({ length: 11 }, (_, i) => i).map(
                                value => (
                                    <label key={value}>
                                        <input
                                            type="radio"
                                            name={`leppink-${index}`}
                                            value={value}
                                            checked={leppinkAnswers[index] === value}
                                            onChange={() =>
                                                handleLeppinkChange(index, value)
                                            }
                                        />
                                        {value}
                                    </label>
                                )
                            )}
                        </div>

                    </div>
                ))}
            </section>

            {/* Paas */}
            <section>
                <h2>Paas Mental Effort Rating</h2>

                <p>
                    How much mental effort did the task require?
                </p>

                <div className="scale">
                    {Array.from({ length: 9 }, (_, i) => i + 1).map(
                        value => (
                            <label key={value}>
                                <input
                                    type="radio"
                                    name="paas"
                                    value={value}
                                    checked={paasAnswer === value}
                                    onChange={() => setPaasAnswer(value)}
                                />
                                {value}
                            </label>
                        )
                    )}
                </div>
            </section>

            <button onClick={handleSubmit}>
                Submit Questionnaire
            </button>

        </div>
    );
}

export default CognitiveLoad;