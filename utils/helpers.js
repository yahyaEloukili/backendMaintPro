const JsBarcode = require('jsbarcode');
const Canvas = require("canvas");
const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

const fillZeros = (code) => {
  zerofill = '';
  for (let i = 0; i< 8 - code.length; i++) {
    zerofill += '0';
  }
  return (zerofill + code);
};

const codeBarFactory = (qst,name) => {
  qst = fillZeros(qst + '');
  console.log("=====>",qst);
  let canvas = createCanvas();
  JsBarcode(canvas, qst.trim(), {
    displayValue: true,
    fontSize: 16,
    marginTop: 15,
    fontoptions: 'bold',
    width: 3,
    height: 150,
  });
  let buf = canvas.toBuffer();
  fs.writeFileSync(path.join(__dirname, '../uploads', name + '.png'), buf);
};


module.exports = {
  fillZeros,
  codeBarFactory,
};
