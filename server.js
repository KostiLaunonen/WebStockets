require('dotenv').config();
const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT;

// Using http to create a single server for both express and websockets..
const http = require('http');
const WebSocket = require('ws');
const express = require('express');
const app = express();

const latestPrices = {};

// .. like this
const server = http.createServer(app);
const socketServer = new WebSocket.Server({ server });

const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

// Send a websocket subscription request to Finnhub
// In this case it's the stock price of Apple and Bitcoin
socket.on('open', () => {
    socket.send(JSON.stringify({ type: 'subscribe', symbol: 'AAPL' }));
    socket.send(JSON.stringify({ type: 'subscribe', symbol: 'BINANCE:BTCUSDT' }));
});

// A listener for messages from Finnhub
socket.on('message', (data) => {
    const parsed = JSON.parse(data.toString());
    const trade = parsed.data[0];
    latestPrices[trade.s] = trade.p;
    console.log(`Symboli: ${trade.s}, Hinta:, ${trade.p}`);

    socketServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ symbol: trade.s, price: trade.p }));
        }
    });
});

// REST get
app.get('/price/:symbol', (req, res) => {
    const symbol = req.params.symbol;
    const price = latestPrices[symbol];
    if (price) {
        res.json({ symbol, price });
    } else {
        res.status(404).json({ error: 'Symbol or price not found'});
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});