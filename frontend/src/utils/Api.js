import axios from 'axios';

const BASE_URL = "http://localhost:4000/api/";

export function fetchTickers() {
    const QUERY = "candlesticks?timeframes=daily,weekly,monthly&tickers=adausdt,btcusdt"
    //console.log(BASE_URL+QUERY);

    return new Promise((resolve, reject) => {
        axios.get(BASE_URL+QUERY)
        .then(res => {
            //console.log("Received data: "+JSON.stringify(res.data));
            resolve(res.data);
        }).catch((error) => console.log(error.toString()))
    })
}