const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');
const path = require('path');
const cors = require('cors');

let sessionCount = 0;

app.use(cors());

io.on('connection', (socket) => {
    sessionCount ++;
    emitUserCount();

    socket.on('disconnect', () => {
        sessionCount --;
        emitUserCount();
    });
});

function emitUserCount() {
    io.emit('session_count', sessionCount);
}

app.get("/api/products", (req, res) => {
    const filePath = path.resolve(__dirname, 'products.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(content);
    res.send({
        payload: products,
        ok: true,
        error: true,
    });
});

app.get("/api/orders", (req, res) => {
    const filePath = path.resolve(__dirname, 'orders.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    const orders = JSON.parse(content);
    res.send({
        payload: orders,
        ok: true,
        error: null
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
