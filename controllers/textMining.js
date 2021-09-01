const mongoose = require("mongoose");
const Wordcloud = require("../models/wordcloud");
const { StatusCodes } = require("http-status-codes");
require("../lib/index");
require("../lib/wordcloud");
require("../lib/textmining");

exports.textMining = async function (req, res) {
  const pid = req.params.pid;
  const qidx = req.params.qidx;
  const data = await excelData(pid);
  const project = await projectByPid(pid);
  var rawdata = [];
  for (let i = 0; i < data.length; i++) {
    var SplitWord = data[i][qidx].split(" ");
    for (let x = 0; x < SplitWord.length; x++) {
      var words = await removeSymbol(SplitWord[x]);
      if (
        (await cekKataSambung(words)) == true &&
        (await cekExistingWords(pid, qidx, words)) == false
      ) {
        var cekTextmining = await wordsFindOne(pid, qidx, words);
        if (cekTextmining) {
          await wordsUpdateOne(pid, qidx, words);
        } else {
          await wordsInsertOne(pid, qidx, words);
        }
        rawdata.push({
          projectID: pid,
          questionID: qidx,
          sbjNum: data[i].SbjNum,
          word: words,
        });
      }
    }
  }
  Wordcloud.insertMany(rawdata)
    .then((results) => {
      res.status(StatusCodes.CREATED).json(results);
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        messages: "Internal Server Error",
      });
    });
};


exports.textMiningRead = async function(req,res){
    const pid = req.params.pid;
    const qidx = req.params.qidx;
    if(req.query.word==undefined){
        var readAllText = await readAll(pid, qidx);
    }else{
        var readAllText = await readByWords(pid, qidx, req.query.word);
    }
    if(readAllText.length > 0){
        res.status(StatusCodes.ACCEPTED)
        .json(readAllText)
    }else{
        res.status(StatusCodes.BAD_REQUEST)
        .json({
            messages: "Keyword not found"
        })
    }
}