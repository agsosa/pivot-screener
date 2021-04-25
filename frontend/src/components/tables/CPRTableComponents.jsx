export const distanceGetter = (params, objectStr, timeframe, futureMode) => {
  const { data } = params;
  const dist = data.getCPR(timeframe, futureMode).distance;
  if (dist && dist[objectStr]) {
    return dist[objectStr];
  }
  return undefined;
};

export const distanceFormatter = (params) => {
  const { value } = params;
  if (value) return `${value.toFixed(2)}%`;
  return undefined;
};

export const cprWidthGetter = (params, timeframe, futureMode) => {
  const { data } = params;
  const value = data.getCPR(timeframe, futureMode).width;

  if (value) return value;
  return undefined;
};

export const cprWidthRenderer = (params) => {
  const { value } = params;
  if (value) {
    let str = '';
    let font = '';

    if (value <= 1) {
      font = "<font color='#DF4294'>";
      str = '</font>';
    } else {
      font = "<font color='#2196F3'>";
      str = '</font>';
    }

    return `${font + value}% ${str}`;
  }

  return undefined;
};

export const cprStatusGetter = (params, timeframe, futureMode) => {
  const { data } = params;
  const value = data.getCPR(timeframe, futureMode).isTested;

  if (value !== undefined) return value ? 'Tested' : 'Untested';

  return undefined;
};

export const cprStatusCellRenderer = (params, timeframe, futureMode) => {
  if (params.value) {
    const approximation = params.data.getCPR(timeframe, futureMode).closestApproximation.toFixed(2);
    const apString = approximation > 0 ? `<sup><font color='gray'>${approximation}%</font></sup>` : '';

    return params.value === 'Tested' ? '✔️ Tested' : `🧲 Untested ${apString}`;
  }

  return undefined;
};

export const cprStatusCellStyle = (params) => {
  if (params && params.value) {
    const extra = { fontSize: '15px' };
    return params.value === 'Untested'
      ? { ...extra, backgroundColor: 'rgba(255, 0, 0, 0.1)' }
      : { ...extra, backgroundColor: 'rgba(0, 255, 0, 0.1)' };
  }

  return undefined;
};

export const magnetSideGetter = (params, timeframe, futureMode) => {
  const { data } = params;
  const cpr = data.getCPR(timeframe, futureMode);
  if (cpr) {
    const tested = cpr.isTested;
    if (tested !== undefined) {
      if (tested) return 'None';

      const isAboveCPR = cpr.price_position === 'above';
      if (isAboveCPR !== undefined) return isAboveCPR ? 'Short' : 'Long';
    }
  }

  return undefined;
};

export const magnetSideCellStyle = (params) => {
  if (params && params.value) {
    const extra = { fontSize: '15px' };

    let result = { ...extra, color: '#858585' };
    if (params.value === 'Short') result = { ...extra, color: 'rgba(255, 0, 0, 1)' };
    else if (params.value === 'Long') result = { ...extra, color: '#4BAA4E' };

    return result;
  }

  return undefined;
};

export const situationGetter = (params, timeframe, futureMode) => {
  const { data } = params;
  const cpr = data.getCPR(timeframe, futureMode);

  if (cpr) {
    if (cpr.price_position !== undefined) {
      const neutral = cpr.price_position === 'neutral';
      if (neutral !== undefined && neutral) return 'Neutral';

      const above = cpr.price_position === 'above';
      if (above !== undefined && above) return 'Above CPR';
      return 'Below CPR';
    }
  }

  return undefined;
};

export const situationCellStyle = (params) => {
  if (params && params.value) {
    const extra = { fontSize: '15px' };

    let result = { ...extra, backgroundColor: 'rgb(103, 124, 135, 0.1)' };
    if (params.value === 'Below CPR') result = { ...extra, backgroundColor: 'rgba(255, 0, 0, 0.1)' };
    else if (params.value === 'Above CPR') result = { ...extra, backgroundColor: 'rgba(0, 255, 0, 0.1)' };

    return result;
  }

  return undefined;
};
