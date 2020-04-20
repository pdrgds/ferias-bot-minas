"use strict";

const moment = require("moment");
const Twit = require("twit");

const apiKeys = require("./api-keys.json");

const twit = new Twit({
  timeout_ms: 60 * 1000,
  ...apiKeys
  // consumer_key: process.env.consumer_key,
  // consumer_secret: process.env.consumer_secret,
  // access_token: process.env.access_token,
  // access_token_secret: process.env.access_token_secret,
});

const universities = [
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
  for (const [name, endOfTerm] of universities) {
    const today = moment(new Date());
    let diffDays;

    if (today.isSame(moment(endOfTerm, "DD/MM/YYYY"), "day")) {
      diffDays = 0;
    } else {
      diffDays = moment(endOfTerm, "DD/MM/YYYY").diff(today, "days") + 1;
    }

    let falta = "falta";
    if (diffDays > 1) {
      falta = falta + "m";
    }

    let dia = "dia";
    if (diffDays > 1) {
      dia = dia + "s";
    }

    let status = null;
    if (diffDays > 0) {
      status = `${falta} ${diffDays} ${dia} para o fim do semestre na ${name}!`;
    } else if (diffDays === 0) {
      status = `Aee! O semestre na ${name} acabou!`;
    }

    if (status) {
      console.log(status);
      await new Promise(resolve => twit.post("statuses/update", {status}, resolve));
    }
  }
};

// exports.handler();
