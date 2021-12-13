BigInt.prototype.abs = function () {
  return this > 0 ? BigInt(this) : this * -1n;
};
