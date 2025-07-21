import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello TPC!');
});

app.get("/hello", (_, res) => res.send("Hello Endpoint"));

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});