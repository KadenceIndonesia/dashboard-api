const mongoose = require("mongoose");
const Wordcloud = require("../models/wordcloud");
const Textmining = require("../models/textmining");

global.wordsFindOne = function (pid, qid, word) {
  return new Promise((resolve) => {
    Textmining.findOne({
      projectID: pid,
      questionID: qid,
      word: word,
    })
      .catch()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => resolve(error));
  });
};

global.wordsInsertMany = function (pid, qid, data) {
  return new Promise((resolve) => {
    Textmining.insertMany(data)
      .catch()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => resolve(error));
  });
};

global.wordsInsertOne = function (pid, qid, word) {
  return new Promise((resolve) => {
    Textmining.insertMany({
      projectID: pid,
      questionID: qid,
      word: word,
      count: 1,
    })
      .catch()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => resolve(error));
  });
};

global.wordsUpdateOne = function (pid, qid, word) {
  return new Promise((resolve) => {
    Textmining.updateOne(
      {
        projectID: pid,
        questionID: qid,
        word: word,
      },
      {
        $inc: {
          count: 1,
        },
      }
    )
      .catch()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => resolve(error));
  });
};

global.readAll = function(pid, qid){
    return new Promise(resolve => {
        Textmining.find({
            projectID: pid,
            questionID: qid
        })
        .catch()
        .then((result) => {
            resolve(result)
        })
        .catch((error) => resolve(error))
    })
}

global.readByWords = function(pid, qid, word){
    return new Promise(resolve => {
        Textmining.find({
            projectID: pid,
            questionID: qid,
            word: word
        })
        .catch()
        .then((result) => {
            resolve(result)
        })
        .catch((error) => resolve(error))
    })
}