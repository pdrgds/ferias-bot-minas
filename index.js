"use strict";

const moment = require("moment");
const Twit = require("twit");

const twit = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
  timeout_ms: 60 * 1000
});

const universidades = [
  ["UFOP", "21/12/2019"],
  ["UFMG", "07/12/2019"]
  // ["UFJF", "06/12/2019"],
  // ["UFLA", "18/12/2019"],
  // ["UFSJ", "20/12/2019"],
  // ["UFTM", "12/12/2019"],
  // ["UFU", "21/12/2019"],
  // ["UFV", "13/12/2019"],
  // ["UFVJM", "09/01/2020"],
  // ["UNIFAL", "20/12/2019"],
  // ["UNIFEI", "14/12/2019"]
];

exports.handler = async () => {
  for (const [nome, fimSemestre] of universidades) {
    const hoje = moment(new Date());
    const diferencaDias = moment(fimSemestre, "DD/MM/YYYY").diff(hoje, "days") + 1;

    let falta = "falta";
    if (diferencaDias > 1) {
      falta = falta + "m";
    }

    let dia = "dia";
    if (diferencaDias > 1) {
      dia = dia + "s";
    }

    let status;
    if (diferencaDias > 0) {
      status = `${falta} ${diferencaDias} ${dia} para o fim do semestre na ${nome}!`;
    } else {
      status = `Aee! O semestre na ${nome} acabou!`;
    }

    console.log(status);

    await new Promise(resolve => twit.post("statuses/update", {status}, resolve));
  }
};
