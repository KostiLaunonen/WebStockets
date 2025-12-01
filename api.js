import axios from 'axios';
//import { backendUrl } from './config';
const backendUrl = "localhost:3000";
export const socket = new WebSocket(`ws://${backendUrl}`);

export async function fetchPrices() {
    // Import the subscription array from backend
    const res = await axios.get(`http://localhost:3000/subscriptions`);
    const subscriptions = res.data;

    const results = [];

    // Iterate over the array and get prices for each stock
    for (const symbol of subscriptions) {
        try {
            const response = await axios.get(`http://localhost:3000/quote/`, {
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
    const res = await axios.get("http://localhost:3000/subscriptions");
    return res.data;
}

export async function fetchSubscriptions() {
    const res = await axios.get(`http://localhost:3000/allSubscriptions`);
    const allSubscriptions = res.data;
    return allSubscriptions;
}

export async function postSymbol(symbol) {
    axios.post("http://localhost:3000/subscriptions", { symbol })
        .then(res => console.log("Added:", res.data))
        .catch(err => console.error(err))
}

export async function deleteSymbol(symbol) {
    axios.delete(`http://localhost:3000/subscriptions/${symbol}`)
        .then(res => console.log("Deleted:", res.data))
        .catch(err => console.error(err));
}