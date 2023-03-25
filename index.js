"use strict";

const moment = require("moment");
const { TwitterApi } = require("twitter-api-v2");
require("dotenv").config();

const client = new TwitterApi({
  appKey: process.env.api_key,
  appSecret: process.env.api_key_secret,
  accessToken: process.env.access_token,
  accessSecret: process.env.access_secret,
});

const universities = [
  ["UFOP", "01/04/2023"],
  //["UFMG", "07/12/2019"],
];

exports.handler = async () => {
  await client.appLogin();

  for (const [name, endOfTerm] of universities) {
    let today = moment(new Date());
    today = today.set("hour", 0);
    today = today.set("minute", 0);
    today = today.set("second", 0);
    today = today.set("millisecond", 0);
    let diffDays;

    const endOfTermMoment = moment(endOfTerm, "DD/MM/YYYY");

    if (today.isSame(endOfTermMoment, "day")) {
      diffDays = 0;
    } else {
      diffDays = endOfTermMoment.diff(today, "days");
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
      try {
        const newTweet = await client.v1.tweet(status);
      } catch (error) {
        console.log(status);
      }
    }
  }
};
