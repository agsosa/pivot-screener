export function isDev() {
	return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
}

export const ohlcArrayToObject = (ohlcArray) => {
	if (!Array.isArray(ohlcArray)) return ohlcArray;
	if (!ohlcArray || ohlcArray.length < 4) return null;
	return {
		open: ohlcArray[0],
		high: ohlcArray[1],
		low: ohlcArray[2],
		close: ohlcArray[3],
		time: ohlcArray[4],
	};
};

export const percentage = (percent, total) => ((percent / 100) * total).toFixed(2);

export const distancePct = (a, b) => Math.abs(((a - b) / a) * 100).toFixed(2);

export const calculateCamarilla = (high, low, close) => {
	let h4 = 0;
	let h3 = 0;
	let l3 = 0;
	let l4 = 0;
	let h6 = 0;
	let h5 = 0;
	let l5 = 0;
	let l6 = 0;

	if (high && low && close) {
		const range = high - low;
		h4 = close + (range * 1.1) / 2;
		h3 = close + (range * 1.1) / 4;
		l3 = close - (range * 1.1) / 4;
		l4 = close - (range * 1.1) / 2;
		h6 = (high / low) * close;
		h5 = h4 + 1.168 * (h4 - h3);
		l5 = l4 - 1.168 * (l3 - l4);
		l6 = close - (h6 - close);
	}

	return { h6, h5, h4, h3, l3, l4, l5, l6 };
};

export const calculateCPR = (high, low, close) => {
	let p = 0;
	let bc = 0;
	let tc = 0;

	if (high && low && close) {
		p = (high + low + close) / 3;
		bc = (high + low) / 2;
		tc = p - bc + p;

		if (tc < bc) {
			[tc, bc] = [bc, tc];
		}
	}

	return { tc, p, bc };
};

export const toFixedEx = (x) => {
	if (x <= 1) return x.toFixed(8);
	return x.toFixed(2);
};

export function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function randomInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const calcPercent = (v, t) => (100 * v) / t; // What percentage is v (value) of t (total)

export function inRange(x, min, max) {
	return (x - min) * (x - max) <= 0;
}

export function percentDifference(a, b) {
	if (!a || !b || a + b === 0) return 0;

	// eslint-disable-next-line
	if (b === 0) b = [a, (a = b)][0]; // If b is 0 swap a and b to prevent division by 0

	const result = 100 * Math.abs((a - b) / b);

	return result;
}

export function clamp(val, min, max) {
	return Math.min(Math.max(val, min), max);
}

export function getPairObject(symbol) {
	// BTCUSDT -> { primary: "BTC", secondary: "USDT"}
	const QUOTES = ['USDT', 'BUSD', 'BTC', 'ETH', 'BNB', 'USD', 'LTC'];
	const result = { primary: '', secondary: '' };

	for (let i = 0; i < QUOTES.length; i++) {
		const q = QUOTES[i];
		//	let regex = /+q+$/gi
		const regex = new RegExp(`${q}$`, 'i');
		const test = symbol.replace(regex, '');
		if (test.length < symbol.length) {
			result.primary = test;
			result.secondary = q;
			break;
		}
	}

	return result;
}
