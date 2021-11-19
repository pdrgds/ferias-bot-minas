"use strict";

const moment = require("moment");
const Twit = require("twit");

const twit = new Twit({
  timeout_ms: 60 * 1000,
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
});

const startCountDown = 30;
const universities = [
  // ["UFOP", "21/12/2019"],
  {
    uniName: "UFMG",
    dates: [
      {
        date: "18/12/2021",
        daysLeftStr: `{{falta}} {{diffDays}} {{dia}} para o recesso de natal na {{uniName}}!`,
        semesterOverStr: `Aee! Chegou o recesso de natal na {{uniName}}!`
      },
      {
        date: "25/02/2022",
        daysLeftStr: `{{falta}} {{diffDays}} {{dia}} para o fim do semestre na {{uniName}}!`,
        semesterOverStr: `Aee! O semestre na {{uniName}} acabou!`
      }
    ]
  },
  {
    uniName: "PUC-MG",
    dates: [
      {
        date: "22/12/2021",
        daysLeftStr: `{{falta}} {{diffDays}} {{dia}} para o fim do semestre na {{uniName}}!`,
        semesterOverStr: `Aee! O semestre na {{uniName}} acabou!`
      }
    ]
  }

  // ["UFJF", "06/12/2019"],
  // ["UFLA", "18/12/2019"],
  // ["UFSJ", "20/12/2019"],
  // ["UFTM", "12/12/2019"],
  // ["UFU", "21/12/2019"],
  // ["UFV", "13/12/2019"],
  // ["UFVJM", "09/01/2020"],
  // ["UNIFAL", "20/12/2019"],
  // ["UNIFEI", "14/12/2019"]
]

exports.handler = async () => {
  const today = moment(new Date());
  
  for (const uni of universities) {
    let date = findNextDate(uni.dates);
    let uniName = uni.uniName;
    
    // if there is no next Date, skip university
    if (!date) continue;
    
    let endOfTerm = date.date;
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

    let replaceVars = {
      dia: dia,
      falta: falta,
      diffDays: diffDays,
      uniName: uni.uniName
    };

    let status = null;
    if (diffDays > 0 && diffDays <= startCountDown) {
      status = date.daysLeftStr
        ? replaceVarsInString(date.daysLeftStr, replaceVars)
        : `${falta} ${diffDays} ${dia} para o fim do semestre na ${uniName}!`;
    } else if (diffDays === 0) {
      status = date.semesterOverStr
        ? replaceVarsInString(date.semesterOverStr, replaceVars)
        : `Aee! O semestre na ${uniName} acabou!`;
    }

    if (status) {
      console.log(status);
      await new Promise(resolve => twit.post("statuses/update", { status }, resolve));
    }
  }

  function replaceVarsInString(str, replaceVars) {
    let newStr = str;
    Object.keys(replaceVars).forEach(replaceVar => {
      newStr = newStr.replace("{{" + replaceVar + "}}", replaceVars[replaceVar]);
    })
    return newStr;
  }

  // gets next date from dates array
  function findNextDate(dates) {
    let nextDate = null;
    let nextDateDiff = -1;

    dates.forEach(date => {
      let thisDateDiff = moment(date.date, "DD/MM/YYYY").diff(today, "days");

      if (thisDateDiff >= 0) {
        if (nextDateDiff == -1) {
          nextDate = date;
          nextDateDiff = thisDateDiff;
        } else if (thisDateDiff < nextDateDiff) {
          nextDate = date;
          nextDateDiff = thisDateDiff;
        }
      }
    })

    return nextDate
  }
}

// exports.handler();
