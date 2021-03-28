export const situationGetter = (params, timeframe, futureMode) => {
	const { data } = params;
	const cam = data.getCamarilla(timeframe, futureMode);

	if (cam) {
		return cam.situation;
	}

	return 'Unknown';
};

export const situationCellStyle = (params) => {
	const extra = { fontSize: '15px' };
	const defaultStyle = { ...extra, backgroundColor: 'rgb(103, 124, 135, 0.3)' };

	if (params && params.value) {
		switch (params.value) {
			case 'Above H4':
				return { ...extra, backgroundColor: 'rgba(0, 255, 0, 0.3)' };
			case 'Above H3':
				return { ...extra, backgroundColor: 'rgba(249, 211, 101, 0.3)' };
			case 'Below L3':
				return { ...extra, backgroundColor: 'rgba(249, 211, 101, 0.3)' };
			case 'Below L4':
				return { ...extra, backgroundColor: 'rgba(255, 0, 0, 0.3)' };
			default:
				return defaultStyle;
		}
	}

	return defaultStyle;
};

export const distanceCellStyle = (params, level) => {
	if (params && params.value && level && level.length >= 2) {
		const extra = { fontSize: '15px' };

		if (level[0] === 'h') return { ...extra, backgroundColor: 'rgba(33, 150, 243, 0.1)' }; // H4,H5,H3,H6
		if (level[0] === 'l') return { ...extra, backgroundColor: 'rgba(223, 66, 148, 0.1)' }; // L4,L5,L6,L3
	}

	return undefined;
};

export const distanceGetter = (params, levelStr, timeframe, futureMode) => {
	const { data } = params;
	const dist = data.getCamarilla(timeframe, futureMode).distance;
	if (dist && dist[levelStr]) {
		return dist[levelStr];
	}
	return undefined;
};

export const distanceFormatter = (params) => {
	const { value } = params;
	if (value) return `${value.toFixed(2)}%`;
	return undefined;
};

export const nearestLevelGetter = (params, timeframe, futureMode) => {
	const { data } = params;
	const { nearest } = data.getCamarilla(timeframe, futureMode);

	if (nearest) {
		return nearest.toUpperCase();
	}

	return 'Unknown';
};
