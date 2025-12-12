const axios = require('axios');
const WebSocket = require('ws');
const socket = new WebSocket('ws://localhost:3000');

async function fetchPrices() {
    // Import the subscription array from backend
    const res = await axios.get('http://localhost:3000/subscriptions');
    const subscriptions = res.data;

    // Iterate over the array and get prices for each stock
    for (const symbol of subscriptions) {
        try {
            const response = await axios.get(`http://localhost:3000/quote/`, {
                params: { symbol }
            });
            const price = response.data.c;
            console.log(`${symbol} hinta:`, price);
        } catch (err) {
            console.error(`Error in symbol ${symbol}:`, err.message);
        }
    }
};
fetchPrices();

/*
socket.onmessage = (event) => {
    const { symbol, price } = JSON.parse(event.data);
    console.log(`${symbol}: ${price}`);
};
*/

/*
axios.get('http://localhost:3000/price/BINANCE%3ABTCUSDT')
    .then(res => {
        console.log('REST-hinta:', res.data.price);
    })
    .catch(err => {
        console.error('Something went wrong with REST-call:', err.message);
    });

axios.get('http://localhost:3000/quote?symbol=AAPL')
    .then(res => {
        console.log('AAPL hinta:', res.data);
    })
      */  