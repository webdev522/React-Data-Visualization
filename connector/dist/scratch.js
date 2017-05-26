





var _ipAddress = require('ip-address');var _ipAddress2 = _interopRequireDefault(_ipAddress);
var _jsbn = require('jsbn');
var _mathjs = require('mathjs');var _mathjs2 = _interopRequireDefault(_mathjs);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var a = new _ipAddress2['default'].Address6('::/128'); // IGNORE!
// Just a module to play with temporary stuff.
// ^_^
/* eslint-disable */var down = a.startAddress().bigInteger().toString();var up = a.endAddress().bigInteger().toString();
var diff = _mathjs2['default'].add(_mathjs2['default'].subtract(_mathjs2['default'].bignumber(up), _mathjs2['default'].bignumber(down)), _mathjs2['default'].bignumber(1)).toString();
var log = _mathjs2['default'].round(
_mathjs2['default'].log(
_mathjs2['default'].add(
_mathjs2['default'].subtract(
_mathjs2['default'].bignumber(up),
_mathjs2['default'].bignumber(down)),

_mathjs2['default'].bignumber(1)),

_mathjs2['default'].bignumber(2))).

toString();

console.log(down);
console.log(up);
console.log(diff);
console.log(log);