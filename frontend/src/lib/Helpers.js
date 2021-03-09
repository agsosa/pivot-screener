// Returns true if environment is development
export function isDev() {
	return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
}

// Returns percentage % of a total
export const percentage = (percent, total) => ((percent / 100) * total).toFixed(2);

// Returns a camarilla object
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

// Returns a CPR object
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

// Number.fixed with two different cases
export const toFixedEx = (x) => {
	if (x <= 1) return x.toFixed(8);
	return x.toFixed(2);
};

// "hola" => "Hola"
export function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

// Returns what percentage is v (value) of t (total)
export const calcPercent = (v, t) => (100 * v) / t;

// Returns true if a number is between min and max
export function inRange(x, min, max) {
	return (x - min) * (x - max) <= 0;
}

// Returns the percentage distance between a and b
export function percentDifference(a, b) {
	if (!a || !b || a + b === 0) return 0;

	// eslint-disable-next-line
	if (b === 0) b = [a, (a = b)][0]; // If b is 0 swap a and b to prevent division by 0

	const result = 100 * Math.abs((a - b) / b);

	return result;
}

// Example: BTCUSDT -> { primary: "BTC", secondary: "USDT"}
export function getPairObject(symbol) {
	const QUOTES = ['USDT', 'BUSD', 'BTC', 'ETH', 'BNB', 'USD', 'LTC'];
	const result = { primary: '', secondary: '' };

	for (let i = 0; i < QUOTES.length; i += 1) {
		const q = QUOTES[i];
		//	regex: /+q+$/gi
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
