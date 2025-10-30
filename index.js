const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./backend/config/db");
const path = require('path');
const http = require('http');

// UncaughtException Error
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
});

dotenv.config();
connectDB();

const app = express();
// Allow all origins (not safe for production)
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", require("./backend/routes/routes"));

const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
__dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))

    app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Server is Running! 🚀');
    });
}

const server = http.createServer(app).listen(PORT);

// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});
