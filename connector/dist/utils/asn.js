Object.defineProperty(exports, "__esModule", { value: true }); // Interprets Autonomous System (AS) number from either asplain, asdot or
// asdot+ notation.

// Unsigned 16-bit number maximum.
var max16 = Math.pow(2, 16);
var max32 = Math.pow(2, 32);
var max32plus = max32 + max16;

// Validate range.
var checkRange = function checkRange(result) {
  if (result < 0 || result > max32plus) {
    throw new RangeError('AS number is out of bounds!');
  }
};

// Get high and low order bits as numbers.
var highAndLow = function highAndLow(asn) {var check = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  if (!asn || typeof asn !== 'string') {
    throw new TypeError('AS number must be non-empty {string}!');
  }

  var parts = asn.split('.');
  if (parts.length > 2 || parts.length === 0) {
    throw new TypeError('Invalid AS number format!');
  }

  var high = void 0;
  var low = void 0;
  if (parts.length === 1) {
    high = 0;
    low = Number(parts[0]);
  } else {
    high = Number(parts[0]);
    low = Number(parts[1]);
  }

  if (low >= max16) {
    var times = Math.floor(low / max16);
    high += times;
    low -= times * max16;
  }

  if (check) checkRange(high * max16 + low);

  return { high: high, low: low };
};

// Convert it to a number.
var toInteger = function toInteger(asn) {
  var parts = highAndLow(asn, false);
  var result = parts.high * max16 + parts.low;

  checkRange(result);

  return result;
};

// Convert it to an integer string.
var toIntegerString = function toIntegerString(asn) {return (
    toInteger(asn).toFixed(0).toString());};exports['default'] =

{
  highAndLow: highAndLow,
  toInteger: toInteger,
  toIntegerString: toIntegerString };