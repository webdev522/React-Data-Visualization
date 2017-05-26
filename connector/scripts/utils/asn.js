// Interprets Autonomous System (AS) number from either asplain, asdot or
// asdot+ notation.

// Unsigned 16-bit number maximum.
const max16 = 2 ** 16;
const max32 = 2 ** 32;
const max32plus = max32 + max16;

// Validate range.
const checkRange = (result) => {
  if (result < 0 || result > max32plus) {
    throw new RangeError('AS number is out of bounds!');
  }
};

// Get high and low order bits as numbers.
const highAndLow = (asn, check = true) => {
  if (!asn || typeof asn !== 'string') {
    throw new TypeError('AS number must be non-empty {string}!');
  }

  const parts = asn.split('.');
  if (parts.length > 2 || parts.length === 0) {
    throw new TypeError('Invalid AS number format!');
  }

  let high;
  let low;
  if (parts.length === 1) {
    high = 0;
    low = Number(parts[0]);
  } else {
    high = Number(parts[0]);
    low = Number(parts[1]);
  }

  if (low >= max16) {
    const times = Math.floor(low / max16);
    high += times;
    low -= times * max16;
  }

  if (check) checkRange((high * max16) + low);

  return { high, low };
};

// Convert it to a number.
const toInteger = (asn) => {
  const parts = highAndLow(asn, false);
  const result = (parts.high * max16) + parts.low;

  checkRange(result);

  return result;
};

// Convert it to an integer string.
const toIntegerString = asn =>
  toInteger(asn).toFixed(0).toString();

export default {
  highAndLow,
  toInteger,
  toIntegerString,
};

