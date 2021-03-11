export default interface TTickers {
	symbol: string;
	market: string;
	exchange: string;
	candlesticks: Record<string, any>; // { dailyCandles, weeklyCandles, monthlyCandles, hourlyCandles, etc.}
}
