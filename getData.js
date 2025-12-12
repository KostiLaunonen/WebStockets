require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.API_KEY;

// Function used to fetch all available 'symbols' (Or in other words, the name of the stocks being traded)
async function fetchSymbols(exchange = 'US') {
    const url = `https://finnhub.io/api/v1/stock/symbol`;
    const res = await axios.get(url, { params: { exchange, token: API_KEY }});
    console.log(res)

    const result = res.data.map(item => {
        return {
            symbol: item.symbol,
            description: item.description
        };
    });

    return result;
};

async function getPrice() {
    const companies = await fetchSymbols();
    const amount = companies.slice(0, 5);

    for (const company of amount) {
        const quote = await axios.get(`https://finnhub.io/api/v1/quote`, {
            params: { symbol: company.symbol, token: API_KEY }
        });
        console.log(company.symbol, quote.data.c);
    }
}

getPrice();
// module.exports = { fetchSymbols };

/* fetchSymbols().then(symbols => {
    console.log('Symbols:', symbols.slice(0, 25));
}); */