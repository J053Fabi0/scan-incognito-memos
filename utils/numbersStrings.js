/**
 * Given an integer in string format, fix its decimals.
 */
function toFixedString(string, decimals) {
  string = string.toString();
  const indexOfDot = string.indexOf(".");
  if (indexOfDot === -1) return string.toString();
  const intPart = string.substring(0, indexOfDot);
  if (decimals === 0) return intPart;
  const decimalPart = string.substring(indexOfDot + 1, indexOfDot + 1 + decimals);
  return intPart + "." + decimalPart;
}

/**
 * Move the "." decimal point of a number in string format. The position could be negative or positive.
 */
function moveDecimalDotString(string, positions) {
  string = string.toString();
  if (positions === 0) return string.toString();
  const indexOfDot = string.indexOf(".");
  const intPart = indexOfDot === -1 ? string : string.substring(0, indexOfDot);
  const decimalPart = indexOfDot === -1 ? "" : string.substring(indexOfDot + 1, string.length);

  if (positions > 0) {
    return (
      intPart +
      decimalPart.substring(0, positions) +
      (positions >= decimalPart.length ? "" : ".") +
      decimalPart.substring(positions, decimalPart.length) +
      (positions >= decimalPart.length ? "0".repeat(positions - decimalPart.length) : "")
    );
  } else {
    return (
      intPart.substring(0, intPart.length + positions) +
      (intPart.length <= Math.abs(positions) ? `0.${"0".repeat(Math.abs(positions) - intPart.length)}` : ".") +
      intPart.substring(intPart.length + positions, intPart.length) +
      decimalPart
    );
  }
}

/**
 * Given a string with usless 0 after the decimal point, it removes them.
 */
function leading0s(n) {
  n = n.toString();
  if (/\./.test(n)) {
    n = n.replace(/(0+)$/g, "");
    if (n.charAt(n.length - 1) === ".") n = n.substr(0, n.length - 1);
  }
  return n;
}

/**
 * It adds commas to any number. 1000 -> 1,000.
 *
 * @return: String
 */
const numberWithCommas = (x) => x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

module.exports = { moveDecimalDotString, toFixedString, leading0s, numberWithCommas };

/**
 * Given an integer in string format, fix its decimals.
 */
String.prototype.toFixedS = function (decimals) {
  const that = this.toString();
  const indexOfDot = that.indexOf(".");
  if (indexOfDot === -1) return that.toString();
  const intPart = that.substring(0, indexOfDot);
  if (decimals === 0) return intPart;
  const decimalPart = that.substring(indexOfDot + 1, indexOfDot + 1 + decimals);
  return intPart + "." + decimalPart;
};
Number.prototype.toFixedS = String.prototype.toFixedS;

/**
 * Move the "." decimal point of a number in string format. The position could be negative or positive.
 */
String.prototype.moveDecimalDot = function (positions) {
  const that = this.toString();
  if (positions === 0) return that;
  const indexOfDot = that.indexOf(".");
  const intPart = indexOfDot === -1 ? that : that.substring(0, indexOfDot);
  const decimalPart = indexOfDot === -1 ? "" : that.substring(indexOfDot + 1, that.length);

  if (positions > 0) {
    return (
      intPart +
      decimalPart.substring(0, positions) +
      (positions >= decimalPart.length ? "" : ".") +
      decimalPart.substring(positions, decimalPart.length) +
      (positions >= decimalPart.length ? "0".repeat(positions - decimalPart.length) : "")
    );
  } else {
    return (
      intPart.substring(0, intPart.length + positions) +
      (intPart.length <= Math.abs(positions) ? `0.${"0".repeat(Math.abs(positions) - intPart.length)}` : ".") +
      intPart.substring(intPart.length + positions, intPart.length) +
      decimalPart
    );
  }
};
Number.prototype.moveDecimalDot = String.prototype.moveDecimalDot;
BigInt.prototype.moveDecimalDot = String.prototype.moveDecimalDot;
