// Extended IP address manipulation utilities.

import ip from 'ip-address';
import math from 'mathjs';

const parsev4 = (address, length) => {
  const result = {};
  const start = new ip.Address4(address);
  const end = ip.Address4.fromBigInteger(
    math.subtract(
      math.add(
        math.bignumber(start.bigInteger().toString()),
        math.bignumber(length),
      ),
      math.bignumber(1),
    ),
  );
  result.start = start.bigInteger().toString();
  result.end = end.bigInteger().toString();
  result.diff = math.add(
    math.subtract(
      math.bignumber(result.end),
      math.bignumber(result.start),
    ),
    math.bignumber(1),
  ).toString();
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

const parsev6 = (address, cidr) => {
  const result = {};
  const block = new ip.Address6(`${address}/${cidr}`);
  result.start = block.startAddress().bigInteger().toString();
  result.end = block.endAddress().bigInteger().toString();
  result.diff = math.add(
    math.subtract(
      math.bignumber(result.end),
      math.bignumber(result.start),
    ),
    math.bignumber(1),
  ).toString();
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
};

export default {
  parsev4,
  parsev6,
};

