"use strict";

const moment = require("moment");
const Twit = require("twit");

const apiKeys = require("./api-keys.json");

const twit = new Twit({
  ...apiKeys,
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
    let diferencaDias;

    if (hoje.isSame(moment(fimSemestre, "DD/MM/YYYY"), "day")) {
      diferencaDias = 0;
    } else {
      diferencaDias = moment(fimSemestre, "DD/MM/YYYY").diff(hoje, "days") + 1;
    }

    let falta = "falta";
    if (diferencaDias > 1) {
      falta = falta + "m";
    }

    let dia = "dia";
    if (diferencaDias > 1) {
      dia = dia + "s";
    }

    let status = null;
    if (diferencaDias > 0) {
      status = `${falta} ${diferencaDias} ${dia} para o fim do semestre na ${nome}!`;
    } else if (diferencaDias === 0) {
      status = `Aee! O semestre na ${nome} acabou!`;
    }

    if (status) {
      console.log(status);
      // await new Promise(resolve => twit.post("statuses/update", {status}, resolve));
    }
  }
};

exports.handler();
