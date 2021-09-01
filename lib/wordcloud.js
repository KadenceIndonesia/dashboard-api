const mongoose = require("mongoose");
const Wordcloud = require("../models/wordcloud");

global.cekKataSambung = function(kata){
    return new Promise(resolve => {
        const kataSambung = ["yang", "Yang", "YANG", "dan", "jika", "kalau", "agar", "supaya", "dengan", "bahwa", "seolah", "seolah-olah", "seakan", "seakan-akan", "karema", "oleh", "sebab", "meskipun", "walaupun", "biarpun", "sekalipun", "adalah", "atau"];
        if(kataSambung.indexOf(kata)==-1){
            resolve(true)
        }else{
            resolve(false)
        }
    })
}

global.removeSymbol = function(kata){
    return new Promise(resolve => {
        resolve(kata.replace(/[^\w\s]/gi, ''))
    })
}

global.cekExistingWords = function(pid, qidx, kata){
    return new Promise(resolve => {
        Wordcloud
        .findOne({
            projectID: pid,
            questionID: qidx,
            word: kata
        })
        .exec()
        .then((result) => {
            if(result==null){
                resolve(false)
            }else{
                resolve(true)
            }
        })
        .catch((err) => resolve(err))
    })
}