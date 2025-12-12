require('dotenv').config();
const axios = require('axios');
const cors = require('cors')
const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT;

// Using http to create a single server for both express and websockets..
const http = require('http');
const WebSocket = require('ws');
const express = require('express');
const app = express();
app.use(cors());
app.use(express.json());

const subscriptions = new Set(['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'BINANCE:BTCUSDT']);
const allSubscriptions = new Set(['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'BINANCE:BTCUSDT']);

// .. like this
const server = http.createServer(app);
const socketServer = new WebSocket.Server({ server });

const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

// Send a websocket subscription request to Finnhub based on the defined symbols in 'subscriptions' set
socket.on('open', () => {
    subscriptions.forEach(symbol => {
        socket.send(JSON.stringify({ type: 'subscribe', symbol }))
    })
});

// A listener for messages from Finnhub
socket.on('message', (data) => {
    const parsed = JSON.parse(data.toString());
    if (parsed.type === 'trade' && parsed.data && parsed.data.length > 0) {
        const trade = parsed.data[0];
        console.log(`Symboli: ${trade.s}, Hinta:, ${trade.p}`);

        socketServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ symbol: trade.s, price: trade.p }));
            }
        });
    }
});

// REST
// Convert the subscriptions set to an array for frontend
app.get('/subscriptions', (req, res) => {
    res.json([...subscriptions]);
})

app.get('/allSubscriptions', (req, res) => {
    res.json([...allSubscriptions]);
})

// Fetches the quote from Finnhub, which include stock data like prices etc.
app.get('/quote', async (req, res) => {
    const symbol = req.query.symbol;

    const response = await axios.get('https://finnhub.io/api/v1/quote', {
        params: {
            symbol,
            token: API_KEY
        }
    });

    //console.log(response.data);
    res.json(response.data);
})

// Add a symbol to the sub list
app.post('/subscriptions', (req, res) => {
    const { symbol } = req.body;
    subscriptions.add(symbol);
    socket.send(JSON.stringify({ type: 'subscribe', symbol }));
    res.status(201).json({ message: 'Symbol added', symbol });
});

// Delete a symbol from the sub list
app.delete('/subscriptions/:symbol', (req, res) => {
    const { symbol } = req.params;
    subscriptions.delete(symbol)
    socket.send(JSON.stringify({ type: 'unsubscribe', symbol }));
    res.json({ message: 'symbol removed', symbol })
})

server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});