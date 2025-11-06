const axios = require('axios');
const WebSocket = require('ws');
const socket = new WebSocket('ws://localhost:3000');

socket.onmessage = (event) => {
  const { symbol, price } = JSON.parse(event.data);
  console.log(`${symbol}: ${price}`);
};

axios.get('http://localhost:3000/price/BINANCE%3ABTCUSDT')
    .then(res => {
        console.log('REST-hinta:', res.data.price);
    })
    .catch(err => {
        console.error('Something went wrong with REST-call:', err.message);
    });