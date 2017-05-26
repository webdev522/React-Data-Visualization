Object.defineProperty(exports, "__esModule", { value: true });

var _ipAddress = require('ip-address');var _ipAddress2 = _interopRequireDefault(_ipAddress);
var _mathjs = require('mathjs');var _mathjs2 = _interopRequireDefault(_mathjs);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };} // Extended IP address manipulation utilities.

var parsev4 = function parsev4(address, length) {
  var result = {};
  var start = new _ipAddress2['default'].Address4(address);
  var end = _ipAddress2['default'].Address4.fromBigInteger(
  _mathjs2['default'].subtract(
  _mathjs2['default'].add(
  _mathjs2['default'].bignumber(start.bigInteger().toString()),
  _mathjs2['default'].bignumber(length)),

  _mathjs2['default'].bignumber(1)));


  result.start = start.bigInteger().toString();
  result.end = end.bigInteger().toString();
  result.diff = _mathjs2['default'].add(
  _mathjs2['default'].subtract(
  _mathjs2['default'].bignumber(result.end),
  _mathjs2['default'].bignumber(result.start)),

  _mathjs2['default'].bignumber(1)).
  toString();
  // result.power = math.number(
  //   math.round(
  //     math.log(
  //       math.bignumber(length),
  //       math.bignumber(2),
  //     ),
  //   ),
  // );
  return result;
};

var parsev6 = function parsev6(address, cidr) {
  var result = {};
  var block = new _ipAddress2['default'].Address6(String(address) + '/' + String(cidr));
  result.start = block.startAddress().bigInteger().toString();
  result.end = block.endAddress().bigInteger().toString();
  result.diff = _mathjs2['default'].add(
  _mathjs2['default'].subtract(
  _mathjs2['default'].bignumber(result.end),
  _mathjs2['default'].bignumber(result.start)),

  _mathjs2['default'].bignumber(1)).
  toString();
  // result.power = math.number(
  //   math.round(
  //     math.log(
  //       math.add(
  //         math.subtract(
  //           math.bignumber(result.end),
  //           math.bignumber(result.start),
  //         ),
  //         math.bignumber(1),
  //       ),
  //       math.bignumber(2),
  //     ),
  //   ),
  // );
  return result;
};exports['default'] =

{
  parsev4: parsev4,
  parsev6: parsev6 };