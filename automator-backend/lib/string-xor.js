function stringXOR(a, b) {
  if (a.length < b.length) {
    [a, b] = [b, a];
  }
  const authcode = [...a]
    .map((aChar, index) => {
      const bChar = b[index] || '';
      return String.fromCharCode(aChar.charCodeAt() ^ bChar.charCodeAt());
    })
    .join('');
  return authcode;
}

module.exports = stringXOR;