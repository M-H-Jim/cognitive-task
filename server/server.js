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
        console.log("Received data:", req.body);
        const {
            name,
            group_name,
            corsi_score, corsi_percentile,
            digit_span_score, digit_span_percentile,
            trail_a,
            trail_b,
            trail_difference, trail_b_percentile,
            correct_presses,
            false_presses,
            missed_sevens,
            summary,
            post_corsi_score, post_corsi_percentile,
            post_digit_span_score, post_digit_span_percentile,
            post_trail_a,
            post_trail_b,
            post_trail_difference, post_trail_b_percentile,

            clt_01,
            clt_02,
            clt_03,
            clt_04,
            clt_05,
            clt_06,
            clt_07,
            clt_08,
            clt_09,
            clt_10,
            clt_11,
            clt_12,
            clt_13,
            clt_14,
            clt_15

        } = req.body;

        const result = await pool.query(
            `INSERT INTO participants
            (name, 
            group_name, 
            corsi_score, corsi_percentile,
            digit_span_score, digit_span_percentile,
            trail_a, 
            trail_b, 
            trail_difference, trail_b_percentile,
            correct_presses, 
            false_presses, 
            missed_sevens, 
            summary,
            post_corsi_score, post_corsi_percentile,
            post_digit_span_score, post_digit_span_percentile,
            post_trail_a,
            post_trail_b,
            post_trail_difference, post_trail_b_percentile,

            clt_01,
            clt_02,
            clt_03,
            clt_04,
            clt_05,
            clt_06,
            clt_07,
            clt_08,
            clt_09,
            clt_10,
            clt_11,
            clt_12,
            clt_13,
            clt_14,
            clt_15
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
                $17, $18, $19, $20, $21,
                $22, $23, $24, $25, $26,
                $27, $28, $29, $30, $31,

                $32, $33, $34, $35, $36,
                $37
            )
            RETURNING *`,
            [
                name,
                group_name,
                corsi_score, corsi_percentile,
                digit_span_score, digit_span_percentile,
                trail_a,
                trail_b,
                trail_difference, trail_b_percentile,
                correct_presses,
                false_presses,
                missed_sevens,
                summary,
                post_corsi_score, post_corsi_percentile,
                post_digit_span_score, post_digit_span_percentile,
                post_trail_a,
                post_trail_b,
                post_trail_difference, post_trail_b_percentile,

                clt_01,
                clt_02,
                clt_03,
                clt_04,
                clt_05,
                clt_06,
                clt_07,
                clt_08,
                clt_09,
                clt_10,
                clt_11,
                clt_12,
                clt_13,
                clt_14,
                clt_15
            ]
        );

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to save participant");
    }
});

// app.listen(3000, () => {
//     console.log("Server running on http://localhost:3000");
// });

if (require.main === module) {
    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });
}

module.exports = app;