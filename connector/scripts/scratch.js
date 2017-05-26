// IGNORE!
// Just a module to play with temporary stuff.
// ^_^

/* eslint-disable */

import ip from 'ip-address';
import { BigInteger } from 'jsbn';
import math from 'mathjs';

const a = new ip.Address6('::/128');
const down = a.startAddress().bigInteger().toString();
const up = a.endAddress().bigInteger().toString();

const diff = math.add(math.subtract(math.bignumber(up), math.bignumber(down)), math.bignumber(1)).toString();
const log = math.round(
  math.log(
    math.add(
      math.subtract(
        math.bignumber(up),
        math.bignumber(down)
      ),
      math.bignumber(1)
    ),
    math.bignumber(2)
  )
).toString();

console.log(down);
console.log(up);
console.log(diff);
console.log(log);

