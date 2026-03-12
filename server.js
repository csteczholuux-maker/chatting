const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let recoveredCount = 0;

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Kirim & Terima Pesan (Teks/Gambar)
    socket.on('send_message', (data) => {
        socket.broadcast.emit('receive_message', data);
    });

    // Kirim Laporan ke Admin
    socket.on('send_report', (report) => {
        io.emit('new_report_to_admin', report);
    });

    // Fitur Unban dari Admin
    socket.on('admin_unban_user', (userData) => {
        recoveredCount++;
        io.emit('user_pulih_update', { recoveredCount, target: userData.username });
    });
});

server.listen(5000, () => console.log('Server Jaguar jalan di port 5000'));
