const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Psychology server is running!");
});

app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Database connection failed");
    }
});

app.post("/participants", async (req, res) => {
    try {
        const {
            name,
            corsi_score,
            digit_span_score,
            trail_a,
            trail_b,
            trail_difference
        } = req.body;

        const result = await pool.query(
            `INSERT INTO participants
            (name, corsi_score, digit_span_score, trail_a, trail_b, trail_difference)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                name,
                corsi_score,
                digit_span_score,
                trail_a,
                trail_b,
                trail_difference
            ]
        );

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to save participant");
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});