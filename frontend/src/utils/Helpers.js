export const ohlcArrayToObject = (ohlc_array) => {
    if (!Array.isArray(ohlc_array)) return ohlc_array;
    if (!ohlc_array || ohlc_array.length < 4) return null;
    return { open: ohlc_array[0], high: ohlc_array[1], low: ohlc_array[2], close: ohlc_array[3], time: ohlc_array[4] };
}

export const percentage = (percent, total) => {
    return ((percent/ 100) * total).toFixed(2)
}

export const distancePct = (a, b) => {
    //return  (100 * Math.abs( ( a - b ) / ( (a+b)/2 ) )).toFixed(2);
    let c = a;
   /* if (a < b) {
        a = b;
        b = c;
    }*/
    //return Math.abs((1 - (b / a)) * 100).toFixed(2);

    return Math.abs((a - b) / a * 100).toFixed(2);
}

export const calculateCamarilla = (high, low, close) => {
    //ohlc = ohlcArrayToObject(ohlc);

    let h4 = 0, h3 = 0, l3 = 0, l4 = 0, h6 = 0, h5 = 0, l5 = 0, l6 = 0;

    if (high && low && close) {
        let range = high - low
        h4 = close + range * 1.1 / 2
        h3 = close + range * 1.1 / 4
        l3 = close - range * 1.1 / 4
        l4 = close - range * 1.1 / 2
        h6 = (high / low) * close
        h5 = h4 + 1.168 * (h4-h3)
        l5 = l4 - 1.168 * (l3 - l4)
        l6 = close - (h6 - close)
    }

    return { h6: h6, h5: h5, h4: h4, h3: h3, l3: l3, l4: l4, l5: l5, l6: l6 };
}

export const calculateCPR = (high, low, close) => {
    //ohlc = ohlcArrayToObject(ohlc);

    let p = 0, bc = 0, tc = 0;

    if (high && low && close) {
        p = (high + low + close) / 3
        bc = (high + low) / 2
        tc = p - bc + p

        if (tc < bc) {
            [tc, bc] = [bc, tc]
        }
    }

    return { tc: tc, p: p, bc: bc};
}

export const _delay = (timer) => {
    return new Promise(resolve => {
        timer = timer || 2000;
        setTimeout(function () {
            resolve();
        }, timer);
    });
};

export const toFixed = (x) => {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
          x *= Math.pow(10,e-1);
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
          e -= 20;
          x /= Math.pow(10,e);
          x += (new Array(e+1)).join('0');
      }
    }
    return x;
}

export const toFixedEx = (x) => {
    if (x <= 1) return x.toFixed(8);
    else return x.toFixed(2);
}