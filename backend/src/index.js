import express from "express";
import cors from "cors";
import session from "express-session";
import bcrypt from "bcrypt";
import { pool } from "./db.js";


const app = express();
app.use(express.json());

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))
app.use(session({
    secret: '123456',
    resave: true,
    saveUninitialized: false,
}));

const PORT = 3001;

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Incomplete Payload.' })
        };

        // hash the password 
        const hashedPassword = await bcrypt.hash(password, 10);

        // insert in the DB 
        await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
            [username, email, hashedPassword]
        );

        res.status(200).json({ result: `User ${username} created.` });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
        return;
    };
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Incomplete Payload.' })
        };

        // check if user sent the correct email
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) return res.status(400).json({ error: `No user found with email ${email}` });

        const user = result.rows[0];

        // for password comparison, first fetch the password from DB 
        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Incorrect password.' });

        req.session.user_id = user.id;
        req.session.user_email = user.email;

        res.status(200).json({ message: `User ${user.username} logged in.` })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
        return;
    }
});

app.get('/me', async (req, res) => {
    try {
        if (req.session?.user_id) {
            res.status(200).json({ authenticated: true, userId: req.session.user_id });
        };

        res.status(401).json({ authenticated: false });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
        return;
    }
})

app.listen(PORT, function () {
    console.log(`Express started on PORT: ${PORT}`)
});

