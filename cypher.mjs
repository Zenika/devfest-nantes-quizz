import fs from 'node:fs';

let datas = fs.readFileSync("data.json")

function b64EncodeUnicode(str) {
  // first we use encodeURIComponent to get percent-encoded Unicode,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
          return String.fromCharCode('0x' + p1);
  }));
}


fs.writeFileSync("data-cypher", b64EncodeUnicode(datas))
