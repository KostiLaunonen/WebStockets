import axios from 'axios';
//import { backendUrl } from './config';
const backendUrl = "https://webstockets.onrender.com/";
export const socket = new WebSocket(`ws://${backendUrl}`);

export async function fetchPrices() {
    // Import the subscription array from backend
    const res = await axios.get(`https://webstockets.onrender.com/subscriptions`);
    const subscriptions = res.data;

    const results = [];

    // Iterate over the array and get prices for each stock
    for (const symbol of subscriptions) {
        try {
            const response = await axios.get(`https://webstockets.onrender.com/quote/`, {
                params: { symbol }
            });
            const price = response.data.c;
            console.log(`${symbol} hinta:`, price);
            results.push({ symbol, price });
        } catch (err) {
            console.error(`Error in symbol ${symbol}:`, err.message);
        }
    }

    return results;
};

export async function getActiveSubs() {
    const res = await axios.get("https://webstockets.onrender.com/subscriptions");
    return res.data;
}

export async function getQuote(symbol) {
    const res = await axios.get(`https://webstockets.onrender.com/quote`, {
        params: { symbol }
    })
    return res.data;
}

export async function fetchSubscriptions() {
    const res = await axios.get(`https://webstockets.onrender.com/allSubscriptions`);
    const allSubscriptions = res.data;
    return allSubscriptions;
}

export async function postSymbol(symbol) {
    axios.post("https://webstockets.onrender.com/subscriptions", { symbol })
        .then(res => console.log("Added:", res.data))
        .catch(err => console.error(err))
}

export async function deleteSymbol(symbol) {
    axios.delete(`https://webstockets.onrender.com/subscriptions/${symbol}`)
        .then(res => console.log("Deleted:", res.data))
        .catch(err => console.error(err));
}