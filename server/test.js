fetch("http://localhost:3000/participants", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        name: "Test User",
        corsi_score: 6,
        digit_span_score: 7,
        trail_a: 32.5,
        trail_b: 51.8,
        trail_difference: 19.3
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error));