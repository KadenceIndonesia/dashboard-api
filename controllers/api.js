const mongoose = require("mongoose");
const Project = require("../models/project");
const Attribute = require("../models/attributes");
const Report = require("../models/reports");
const Projects = require("../models/project");
const fs = require("fs");
const path = require("path");
const xslx = require("xlsx");
const attributes = require("../models/attributes");
require("../lib/index");

global.excelData = function (pid) {
  return new Promise((resolve) => {
    var directoryPath = path.join(process.env.DIRNAME + pid);
    fs.readdir(directoryPath, function (err, files) {
      var dataxls = [];
      var data = [];
      for (var f = 0; f < files.length; f++) {
        var workbook = xslx.readFile(directoryPath + "/" + files[f]);
        var sheetname_list = workbook.SheetNames;
        sheetname_list.forEach(async function (y) {
          var worksheet = workbook.Sheets[y];
          var headers = {};
          for (z in worksheet) {
            if (z[0] === "|") continue;
            var tt = 0;
            for (let i = 0; i < z.length; i++) {
              if (!isNaN(z[i])) {
                tt = i;
                break;
              }
            }
            var col = z.substring(0, tt);
            var row = parseInt(z.substring(tt));
            var value = worksheet[z].v;
            if (row == 1 && value) {
              headers[col] = value;
              continue;
            }
            if (!data[row]) data[row] = {};
            data[row][headers[col]] = value;
          }
          data.shift();
          data.shift();
          for (var d = 0; d < data.length; d++) {
            dataxls.push(data[d]);
          }
        });
      }
      resolve(dataxls);
    });
  });
};

global.getAttributesByPid = function (pid, qidx) {
  return new Promise((resolve) => {
    Attribute.find({ projectID: pid, questionID: qidx })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getAttributesSpecByPid = function (pid, qidx, code) {
  return new Promise((resolve) => {
    Attribute.attribute
      .find({ projectID: pid, questionID: qidx, attribute: { code: code } })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getReportsByID = function (pid, qidx) {
  return new Promise((resolve) => {
    Report.find({ projectID: pid, questionID: qidx })
      .exec()
      .then((result) => {
        resolve(result);
      });
  });
};



exports.getApi = async function (req, res) {
  var data = await excelData();
};

exports.getApiProject = async function (req, res) {
  const pid = req.params.pid;
  var data = await excelData(pid);
  res.status(200).json(data);
};

exports.getApiData = async function (req, res) {
  var qidx = req.params.qidx;
  var pid = req.params.pid;
  var data = await excelData(pid);
  var getattributebypid = await getAttributesByPid(pid, qidx);
  var rawdata = [];
  var labelAttr;
  if (getattributebypid.length > 0) {
    if (getattributebypid[0].type == "SA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        if (data[i][qidx] != -1) {
          for (let x = 0; x < labelAttr.length; x++) {
            if (labelAttr[x].code == data[i][qidx]) {
              rawdata.push({
                sbjnum: data[i]["SbjNum"],
                code: parseInt(labelAttr[x].code),
                label: labelAttr[x].label,
                kota: data[i]["Kota"],
                y: 1,
              });
            }
          }
        }
      }
    } else if (getattributebypid[0].type == "MA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        for (let y = 1; y <= getattributebypid[0].attribute.length; y++) {
          if (data[i][qidx + "_O" + y] != -1) {
            for (let z = 0; z < labelAttr.length; z++) {
              if (labelAttr[z].code == data[i][qidx + "_O" + y]) {
                rawdata.push({
                  sbjnum: data[i]["SbjNum"],
                  code: parseInt(labelAttr[z].code),
                  label: labelAttr[z].label,
                  kota: data[i]["Kota"],
                  y: 1,
                });
              }
            }
          }
        }
      }
    } else if (getattributebypid[0].type == "LOOPSA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        for (let x = 0; x < getattributebypid[0].loopLabel.length; x++) {
          if (data[i][getattributebypid[0].loopLabel[x] + "_" + qidx] != -1)
            for (let z = 0; z < labelAttr.length; z++) {
              if (
                labelAttr[z].code ==
                data[i][getattributebypid[0].loopLabel[x] + "_" + qidx]
              ) {
                var splitCode = getattributebypid[0].loopLabel[x].split(".");
                var parentCode = parseInt(splitCode);
                rawdata.push({
                  sbjnum: data[i]["SbjNum"],
                  code: parseInt(labelAttr[z].code),
                  label: labelAttr[z].label,
                  parentlabel: getattributebypid[0].loopLabel[x],
                  parentcode: parentCode,
                  kota: data[i]["Kota"],
                  y: 1,
                });
              }
            }
        }
      }
    } else if (getattributebypid[0].type == "LOOPMA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        for (let x = 0; x < getattributebypid[0].loopLabel.length; x++) {
          for (let y = 1; y <= getattributebypid[0].attribute.length; y++) {
            if (
              data[i][
                getattributebypid[0].loopLabel[x] + "_" + qidx + "_O" + y
              ] != -1
            ) {
              for (let z = 0; z < labelAttr.length; z++) {
                if (
                  labelAttr[z].code ==
                  data[i][
                    getattributebypid[0].loopLabel[x] + "_" + qidx + "_O" + y
                  ]
                ) {
                  var splitCode = getattributebypid[0].loopLabel[x].split(".");
                  var parentCode = parseInt(splitCode);
                  rawdata.push({
                    sbjnum: data[i]["SbjNum"],
                    code: parseInt(labelAttr[z].code),
                    label: labelAttr[z].label,
                    parentlabel: getattributebypid[0].loopLabel[x],
                    parentcode: parentCode,
                    kota: data[i]["Kota"],
                    y: 1,
                  });
                }
              }
            }
          }
        }
      }
    } else if (getattributebypid[0].type == "GRIDSA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        for (let x = 0; x < getattributebypid[0].loopLabel.length; x++) {
          if (data[i][`T_${qidx}_${x + 1}`] != -1) {
            var splitCode = getattributebypid[0].loopLabel[x].split(".");
            var parentCode = parseInt(splitCode);
            rawdata.push({
              sbjnum: data[i]["SbjNum"],
              code: parseInt(data[i][`T_${qidx}_${x + 1}`]),
              label: labelAttr[data[i][`T_${qidx}_${x + 1}`] - 1].label,
              parentlabel: getattributebypid[0].loopLabel[x],
              parentcode: parentCode,
              kota: data[i]["Kota"],
              y: 1,
            });
          }
        }
      }
    } else if (getattributebypid[0].type == "OE") {
      for (let i = 0; i < data.length; i++) {
        rawdata.push({
          sbjnum: data[i]["SbjNum"],
          label: data[i][qidx],
          y: 1,
        });
      }
    }
    res.send(rawdata);
  } else {
    res.status(404).json({
      message: "question not found",
    });
  }
};

exports.getDataByBreak = async function (req, res) {
  var qidx = req.params.qidx;
  var topbreak = req.params.break;
  var breakCode = req.params.code;
  var pid = req.params.pid;
  var data = await excelData(pid);
  var getattributebypid = await getAttributesByPid(pid, qidx);
  var rawdata = [];
  var labelAttr;
  if (getattributebypid.length > 0) {
    if (getattributebypid[0].type == "SA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        if (data[i][qidx] != -1 && data[i][topbreak] == breakCode) {
          for (let x = 0; x < labelAttr.length; x++) {
            if (labelAttr[x].code == data[i][qidx]) {
              rawdata.push({
                sbjnum: data[i]["SbjNum"],
                code: parseInt(labelAttr[x].code),
                label: labelAttr[x].label,
                kota: data[i]["Kota"],
                y: 1,
              });
            }
          }
        }
      }
    } else if (getattributebypid[0].type == "MA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        for (let y = 1; y <= getattributebypid[0].attribute.length; y++) {
          if (
            data[i][qidx + "_O" + y] != -1 &&
            data[i][qidx + "_O" + y] < getattributebypid[0].attribute.length &&
            data[i][topbreak] == breakCode
          ) {
            for (let z = 0; z < labelAttr.length; z++) {
              if (labelAttr[z].code == data[i][qidx + "_O" + y]) {
                rawdata.push({
                  sbjnum: data[i]["SbjNum"],
                  code: parseInt(labelAttr[z].code),
                  label: labelAttr[z].label,
                  kota: data[i]["Kota"],
                  y: 1,
                });
              }
            }
          }
        }
      }
    } else if (getattributebypid[0].type == "LOOPSA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        for (let x = 0; x < getattributebypid[0].loopLabel.length; x++) {
          if (
            data[i][getattributebypid[0].loopLabel[x] + "_" + qidx] != -1 &&
            data[i][topbreak] == breakCode
          )
            for (let z = 0; z < labelAttr.length; z++) {
              if (
                labelAttr[z].code ==
                data[i][getattributebypid[0].loopLabel[x] + "_" + qidx]
              ) {
                rawdata.push({
                  sbjnum: data[i]["SbjNum"],
                  code: parseInt(labelAttr[z].code),
                  label: labelAttr[z].label,
                  parentlabel: getattributebypid[0].loopLabel[x],
                  kota: data[i]["Kota"],
                  y: 1,
                });
              }
            }
        }
      }
    } else if (getattributebypid[0].type == "LOOPMA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        for (let x = 0; x < getattributebypid[0].loopLabel.length; x++) {
          for (let y = 1; y <= getattributebypid[0].attribute.length; y++) {
            if (
              data[i][
                getattributebypid[0].loopLabel[x] + "_" + qidx + "_O" + y
              ] != -1 &&
              data[i][topbreak] == breakCode
            ) {
              for (let z = 0; z < labelAttr.length; z++) {
                if (
                  labelAttr[z].code ==
                  data[i][
                    getattributebypid[0].loopLabel[x] + "_" + qidx + "_O" + y
                  ]
                ) {
                  rawdata.push({
                    sbjnum: data[i]["SbjNum"],
                    code: parseInt(labelAttr[z].code),
                    label: labelAttr[z].label,
                    parentlabel: getattributebypid[0].loopLabel[x],
                    kota: data[i]["Kota"],
                    y: 1,
                  });
                }
              }
            }
          }
        }
      }
    } else if (getattributebypid[0].type == "GRIDSA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        for (let x = 0; x < getattributebypid[0].loopLabel.length; x++) {
          if (
            data[i][`T_${qidx}_${x + 1}`] != -1 &&
            data[i][topbreak] == breakCode
          ) {
            var splitCode = getattributebypid[0].loopLabel[x].split(".");
            var parentCode = parseInt(splitCode);
            rawdata.push({
              sbjnum: data[i]["SbjNum"],
              code: parseInt(data[i][`T_${qidx}_${x + 1}`]),
              label: labelAttr[data[i][`T_${qidx}_${x + 1}`] - 1].label,
              parentlabel: getattributebypid[0].loopLabel[x],
              parentcode: parentCode,
              kota: data[i]["Kota"],
              y: 1,
            });
          }
        }
      }
    }
    res.send(rawdata);
  } else {
    res.status(404).json({
      message: "question not found",
    });
  }
};

exports.dataByBreak = async function (req, res) {
  var qidx = req.params.qidx;
  var break1 = req.body.break1;
  var code1 = req.body.code1;
  var break2 = req.body.break2;
  var code2 = req.body.code2;
  var break3 = req.body.break3;
  var code3 = req.body.code3;
  var pid = req.params.pid;
  var data = await excelData(pid);
  var getattributebypid = await getAttributesByPid(pid, qidx);
  var rawdata = [];
  var labelAttr;

  const filterBreak1 = (i) => {
    if (code1 != "all") {
      return data[i][break1] == code1;
    } else {
      return " ";
    }
  };

  const filterLogic = (i) => {
    if (code2 != "all" && code3 == "all") {
      return data[i][break2] == code2;
    } else if (code2 == "all" && code3 != "all") {
      return data[i][break3] == code3;
    } else if (code2 != "all" && code3 != "all") {
      return data[i][break2] == code2 && data[i][break3] == code3;
    } else {
      return " ";
    }
  };

  if (getattributebypid.length > 0) {
    if (getattributebypid[0].type == "SA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        if (data[i][qidx] != -1 && filterBreak1(i) && filterLogic(i)) {
          for (let x = 0; x < labelAttr.length; x++) {
            if (labelAttr[x].code == data[i][qidx]) {
              rawdata.push({
                sbjnum: data[i]["SbjNum"],
                code: parseInt(labelAttr[x].code),
                label: labelAttr[x].label,
                kota: data[i]["Kota"],
                y: 1,
              });
            }
          }
        }
      }
    } else if (getattributebypid[0].type == "MA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        for (let y = 1; y <= getattributebypid[0].attribute.length; y++) {
          if (
            data[i][qidx + "_O" + y] != -1 &&
            data[i][qidx + "_O" + y] < getattributebypid[0].attribute.length &&
            filterBreak1(i) &&
            filterLogic(i)
          ) {
            for (let z = 0; z < labelAttr.length; z++) {
              if (labelAttr[z].code == data[i][qidx + "_O" + y]) {
                rawdata.push({
                  sbjnum: data[i]["SbjNum"],
                  code: parseInt(labelAttr[z].code),
                  label: labelAttr[z].label,
                  y: 1,
                });
              }
            }
          }
        }
      }
    } else if (getattributebypid[0].type == "LOOPSA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        for (let x = 0; x < getattributebypid[0].loopLabel.length; x++) {
          if (
            data[i][getattributebypid[0].loopLabel[x] + "_" + qidx] != -1 &&
            filterBreak1(i) &&
            filterLogic(i)
          )
            for (let z = 0; z < labelAttr.length; z++) {
              if (
                labelAttr[z].code ==
                data[i][getattributebypid[0].loopLabel[x] + "_" + qidx]
              ) {
                var splitCode = getattributebypid[0].loopLabel[x].split(".");
                var parentCode = parseInt(splitCode);
                rawdata.push({
                  sbjnum: data[i]["SbjNum"],
                  code: parseInt(labelAttr[z].code),
                  label: labelAttr[z].label,
                  parentcode: parentCode,
                  parentlabel: getattributebypid[0].loopLabel[x],
                  kota: data[i]["Kota"],
                  y: 1,
                });
              }
            }
        }
      }
    } else if (getattributebypid[0].type == "LOOPMA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        for (let x = 0; x < getattributebypid[0].loopLabel.length; x++) {
          for (let y = 1; y <= getattributebypid[0].attribute.length; y++) {
            if (
              data[i][
                getattributebypid[0].loopLabel[x] + "_" + qidx + "_O" + y
              ] != -1 &&
              filterBreak1(i) &&
              filterLogic(i)
            ) {
              for (let z = 0; z < labelAttr.length; z++) {
                if (
                  labelAttr[z].code ==
                  data[i][
                    getattributebypid[0].loopLabel[x] + "_" + qidx + "_O" + y
                  ]
                ) {
                  var splitCode = getattributebypid[0].loopLabel[x].split(".");
                  var parentCode = parseInt(splitCode);
                  rawdata.push({
                    sbjnum: data[i]["SbjNum"],
                    code: parseInt(labelAttr[z].code),
                    label: labelAttr[z].label,
                    parentcode: parentCode,
                    parentlabel: getattributebypid[0].loopLabel[x],
                    kota: data[i]["Kota"],
                    y: 1,
                  });
                }
              }
            }
          }
        }
      }
    } else if (getattributebypid[0].type == "GRIDSA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        for (let x = 0; x < getattributebypid[0].loopLabel.length; x++) {
          if (
            data[i][`T_${qidx}_${x + 1}`] != -1 &&
            filterBreak1(i) &&
            filterLogic(i)
          ) {
            var splitCode = getattributebypid[0].loopLabel[x].split(".");
            var parentCode = parseInt(splitCode);
            rawdata.push({
              sbjnum: data[i]["SbjNum"],
              code: parseInt(data[i][`T_${qidx}_${x + 1}`]),
              label: labelAttr[data[i][`T_${qidx}_${x + 1}`] - 1].label,
              parentlabel: getattributebypid[0].loopLabel[x],
              parentcode: parentCode,
              kota: data[i]["Kota"],
              y: 1,
            });
          }
        }
      }
    }
    res.send(rawdata);
  } else {
    res.status(404).json({
      message: "question not found",
    });
  }
};

exports.topbreakByBreak = async function (req, res) {
  var qidx = req.params.qidx;
  var break1 = req.query.break1;
  var code1 = req.query.code1;
  var break2 = req.query.break2;
  var code2 = req.query.code2;
  var break3 = req.query.break3;
  var code3 = req.query.code3;
  var pid = req.params.pid;
  var data = await excelData(pid);
  var getattributebypid = await getAttributesByPid(pid, qidx);
  var rawdata = [];
  var labelAttr;

  var project = await projectByPid(pid);
  var getattributebypid = await getAttributesByPid(pid, qidx);
  async function getattributebyqidx(prjid, qidxx) {
    return await getAttributesByPid(prjid, qidxx);
  }
  var labelAttrS0 = (
    await getattributebyqidx(pid, project[0].topbreak[0].quest)
  )[0].attribute;
  var labelAttrPR7a = (
    await getattributebyqidx(pid, project[0].topbreak[1].quest)
  )[0].attribute;
  var labelAttrS7 = (
    await getattributebyqidx(pid, project[0].topbreak[2].quest)
  )[0].attribute;

  const filterBreak1 = (i) => {
    if (code1) {
      return data[i][break1] == code1;
    } else {
      return " ";
    }
  };

  const filterLogic = (i) => {
    if (code2 && !code3) {
      return data[i][break2] == code2;
    } else if (!code2 && code3) {
      return data[i][break3] == code3;
    } else if (code2 && code3) {
      return data[i][break2] == code2 && data[i][break3] == code3;
    } else {
      return " ";
    }
  };

  if (getattributebypid.length > 0) {
    if (getattributebypid[0].type == "SA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        if (data[i][qidx] != -1 && filterBreak1(i) && filterLogic(i)) {
          for (let x = 0; x < labelAttr.length; x++) {
            if (labelAttr[x].code == data[i][qidx]) {
              rawdata.push({
                sbjnum: data[i]["SbjNum"],
                code: parseInt(labelAttr[x].code),
                label: labelAttr[x].label,
                kota: data[i]["Kota"],
                y: 1,
                [project[0].topbreak[0].label]:
                  labelAttrS0[
                    await findObj(
                      labelAttrS0,
                      "code",
                      data[i][project[0].topbreak[0].quest]
                    )
                  ].label,
                [project[0].topbreak[1].label]:
                  labelAttrPR7a[
                    await findObj(
                      labelAttrPR7a,
                      "code",
                      data[i][project[0].topbreak[1].quest]
                    )
                  ].label,
                [project[0].topbreak[2].label]:
                  labelAttrS7[
                    await findObj(
                      labelAttrS7,
                      "code",
                      data[i][project[0].topbreak[2].quest]
                    )
                  ].label,
              });
            }
          }
        }
      }
    } else if (getattributebypid[0].type == "MA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        for (let y = 1; y <= getattributebypid[0].attribute.length; y++) {
          if (
            data[i][qidx + "_O" + y] != -1 &&
            filterBreak1(i) &&
            filterLogic(i)
          ) {
            for (let z = 0; z < labelAttr.length; z++) {
              if (labelAttr[z].code == data[i][qidx + "_O" + y]) {
                rawdata.push({
                  sbjnum: data[i]["SbjNum"],
                  code: parseInt(labelAttr[z].code),
                  label: labelAttr[z].label,
                  y: 1,
                  [project[0].topbreak[0].label]:
                    labelAttrS0[
                      await findObj(
                        labelAttrS0,
                        "code",
                        data[i][project[0].topbreak[0].quest]
                      )
                    ].label,
                  [project[0].topbreak[1].label]:
                    labelAttrPR7a[
                      await findObj(
                        labelAttrPR7a,
                        "code",
                        data[i][project[0].topbreak[1].quest]
                      )
                    ].label,
                  [project[0].topbreak[2].label]:
                    labelAttrS7[
                      await findObj(
                        labelAttrS7,
                        "code",
                        data[i][project[0].topbreak[2].quest]
                      )
                    ].label,
                });
              }
            }
          }
        }
      }
    } else if (getattributebypid[0].type == "LOOPSA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        for (let x = 0; x < getattributebypid[0].loopLabel.length; x++) {
          if (
            data[i][getattributebypid[0].loopLabel[x] + "_" + qidx] != -1 &&
            filterBreak1(i) &&
            filterLogic(i)
          )
            for (let z = 0; z < labelAttr.length; z++) {
              if (
                labelAttr[z].code ==
                data[i][getattributebypid[0].loopLabel[x] + "_" + qidx]
              ) {
                var splitCode = getattributebypid[0].loopLabel[x].split(".");
                var parentCode = parseInt(splitCode);
                rawdata.push({
                  sbjnum: data[i]["SbjNum"],
                  code: parseInt(labelAttr[z].code),
                  label: labelAttr[z].label,
                  parentcode: parentCode,
                  parentlabel: getattributebypid[0].loopLabel[x],
                  y: 1,
                  [project[0].topbreak[0].label]:
                    labelAttrS0[
                      await findObj(
                        labelAttrS0,
                        "code",
                        data[i][project[0].topbreak[0].quest]
                      )
                    ].label,
                  [project[0].topbreak[1].label]:
                    labelAttrPR7a[
                      await findObj(
                        labelAttrPR7a,
                        "code",
                        data[i][project[0].topbreak[1].quest]
                      )
                    ].label,
                  [project[0].topbreak[2].label]:
                    labelAttrS7[
                      await findObj(
                        labelAttrS7,
                        "code",
                        data[i][project[0].topbreak[2].quest]
                      )
                    ].label,
                });
              }
            }
        }
      }
    } else if (getattributebypid[0].type == "LOOPMA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        for (let x = 0; x < getattributebypid[0].loopLabel.length; x++) {
          for (let y = 1; y <= getattributebypid[0].attribute.length; y++) {
            if (
              data[i][
                getattributebypid[0].loopLabel[x] + "_" + qidx + "_O" + y
              ] != -1 &&
              filterBreak1(i) &&
              filterLogic(i)
            ) {
              for (let z = 0; z < labelAttr.length; z++) {
                if (
                  labelAttr[z].code ==
                  data[i][
                    getattributebypid[0].loopLabel[x] + "_" + qidx + "_O" + y
                  ]
                ) {
                  var splitCode = getattributebypid[0].loopLabel[x].split(".");
                  var parentCode = parseInt(splitCode);
                  rawdata.push({
                    sbjnum: data[i]["SbjNum"],
                    code: parseInt(labelAttr[z].code),
                    label: labelAttr[z].label,
                    parentcode: parentCode,
                    parentlabel: getattributebypid[0].loopLabel[x],
                    y: 1,
                    [project[0].topbreak[0].label]:
                      labelAttrS0[
                        await findObj(
                          labelAttrS0,
                          "code",
                          data[i][project[0].topbreak[0].quest]
                        )
                      ].label,
                    [project[0].topbreak[1].label]:
                      labelAttrPR7a[
                        await findObj(
                          labelAttrPR7a,
                          "code",
                          data[i][project[0].topbreak[1].quest]
                        )
                      ].label,
                    [project[0].topbreak[2].label]:
                      labelAttrS7[
                        await findObj(
                          labelAttrS7,
                          "code",
                          data[i][project[0].topbreak[2].quest]
                        )
                      ].label,
                  });
                }
              }
            }
          }
        }
      }
    } else if (getattributebypid[0].type == "GRIDSA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        for (let x = 0; x < getattributebypid[0].loopLabel.length; x++) {
          if (
            data[i][`T_${qidx}_${x + 1}`] != -1 &&
            data[i][`T_${qidx}_${x + 1}`] != 98 &&
            filterBreak1(i) &&
            filterLogic(i)
          ) {
            var splitCode = getattributebypid[0].loopLabel[x].split(".");
            var parentCode = parseInt(splitCode);
            rawdata.push({
              sbjnum: data[i]["SbjNum"],
              code: parseInt(data[i][`T_${qidx}_${x + 1}`]),
              label: labelAttr[data[i][`T_${qidx}_${x + 1}`] - 1].label,
              parentlabel: getattributebypid[0].loopLabel[x],
              parentcode: parentCode,
              y: 1,
              [project[0].topbreak[0].label]:
                labelAttrS0[
                  await findObj(
                    labelAttrS0,
                    "code",
                    data[i][project[0].topbreak[0].quest]
                  )
                ].label,
              [project[0].topbreak[1].label]:
                labelAttrPR7a[
                  await findObj(
                    labelAttrPR7a,
                    "code",
                    data[i][project[0].topbreak[1].quest]
                  )
                ].label,
              [project[0].topbreak[2].label]:
                labelAttrS7[
                  await findObj(
                    labelAttrS7,
                    "code",
                    data[i][project[0].topbreak[2].quest]
                  )
                ].label,
            });
          }
        }
      }
    }
    res.send(rawdata);
  } else {
    res.status(404).json({
      message: "question not found",
    });
  }
};

exports.getSliceData = async function (req, res) {
  var qidx = req.params.qidx;
  var pid = req.params.pid;
  var getreportbyid = await getReportsByID(pid, qidx);
  res.send(getreportbyid[0]);
};

exports.getAttributeData = async function (req, res) {
  var qidx = req.params.qidx;
  var pid = req.params.pid;
  var getattributebypid = await getAttributesByPid(pid, qidx);
  var attribute = [];
  for (let i = 0; i < getattributebypid[0].attribute.length; i++) {
    attribute.push(getattributebypid[0].attribute[i]);
  }
  res.status(200).json(attribute);
};

exports.getTopBreak = async function (req, res) {
  var qidx = req.params.qidx;
  var pid = req.params.pid;
  var topbreak = await topbreakByQid(pid, qidx);
  res.send(topbreak);
};

exports.getDataTopbreak = async function (req, res) {
  var qidx = req.params.qidx;
  var pid = req.params.pid;
  var data = await excelData(pid);
  var project = await projectByPid(pid);
  var getattributebypid = await getAttributesByPid(pid, qidx);
  async function getattributebyqidx(prjid, qidxx) {
    return await getAttributesByPid(prjid, qidxx);
  }
  var labelAttrS0 = (
    await getattributebyqidx(pid, project[0].topbreak[0].quest)
  )[0].attribute;
  var labelAttrPR7a = (
    await getattributebyqidx(pid, project[0].topbreak[1].quest)
  )[0].attribute;
  var labelAttrS7 = (
    await getattributebyqidx(pid, project[0].topbreak[2].quest)
  )[0].attribute;
  var rawdata = [];
  var labelAttr;
  if (getattributebypid.length > 0) {
    if (getattributebypid[0].type == "SA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        if (data[i][qidx] != -1) {
          for (let x = 0; x < labelAttr.length; x++) {
            if (labelAttr[x].code == data[i][qidx]) {
              rawdata.push({
                sbjnum: data[i]["SbjNum"],
                code: parseInt(labelAttr[x].code),
                label: labelAttr[x].label,
                y: 1,
                [project[0].topbreak[0].label]:
                  labelAttrS0[
                    await findObj(
                      labelAttrS0,
                      "code",
                      data[i][project[0].topbreak[0].quest]
                    )
                  ].label,
                [project[0].topbreak[1].label]:
                  labelAttrPR7a[
                    await findObj(
                      labelAttrPR7a,
                      "code",
                      data[i][project[0].topbreak[1].quest]
                    )
                  ].label,
                [project[0].topbreak[2].label]:
                  labelAttrS7[
                    await findObj(
                      labelAttrS7,
                      "code",
                      data[i][project[0].topbreak[2].quest]
                    )
                  ].label,
              });
            }
          }
        }
      }
    } else if (getattributebypid[0].type == "MA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        for (let y = 1; y <= getattributebypid[0].attribute.length; y++) {
          if (data[i][qidx + "_O" + y] != -1) {
            for (let z = 0; z < labelAttr.length; z++) {
              if (labelAttr[z].code == data[i][qidx + "_O" + y]) {
                rawdata.push({
                  sbjnum: data[i]["SbjNum"],
                  code: parseInt(labelAttr[z].code),
                  label: labelAttr[z].label,
                  y: 1,
                  [project[0].topbreak[0].label]:
                    labelAttrS0[
                      await findObj(
                        labelAttrS0,
                        "code",
                        data[i][project[0].topbreak[0].quest]
                      )
                    ].label,
                  [project[0].topbreak[1].label]:
                    labelAttrPR7a[
                      await findObj(
                        labelAttrPR7a,
                        "code",
                        data[i][project[0].topbreak[1].quest]
                      )
                    ].label,
                  [project[0].topbreak[2].label]:
                    labelAttrS7[
                      await findObj(
                        labelAttrS7,
                        "code",
                        data[i][project[0].topbreak[2].quest]
                      )
                    ].label,
                });
              }
            }
          }
        }
      }
    } else if (getattributebypid[0].type == "LOOPSA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        for (let x = 0; x < getattributebypid[0].loopLabel.length; x++) {
          if (data[i][getattributebypid[0].loopLabel[x] + "_" + qidx] != -1)
            for (let z = 0; z < labelAttr.length; z++) {
              if (
                labelAttr[z].code ==
                data[i][getattributebypid[0].loopLabel[x] + "_" + qidx]
              ) {
                var splitCode = getattributebypid[0].loopLabel[x].split(".");
                var parentCode = parseInt(splitCode);
                rawdata.push({
                  sbjnum: data[i]["SbjNum"],
                  code: parseInt(labelAttr[z].code),
                  label: labelAttr[z].label,
                  parentlabel: getattributebypid[0].loopLabel[x],
                  parentcode: parentCode,
                  y: 1,
                  [project[0].topbreak[0].label]:
                    labelAttrS0[
                      await findObj(
                        labelAttrS0,
                        "code",
                        data[i][project[0].topbreak[0].quest]
                      )
                    ].label,
                  [project[0].topbreak[1].label]:
                    labelAttrPR7a[
                      await findObj(
                        labelAttrPR7a,
                        "code",
                        data[i][project[0].topbreak[1].quest]
                      )
                    ].label,
                  [project[0].topbreak[2].label]:
                    labelAttrS7[
                      await findObj(
                        labelAttrS7,
                        "code",
                        data[i][project[0].topbreak[2].quest]
                      )
                    ].label,
                });
              }
            }
        }
      }
    } else if (getattributebypid[0].type == "LOOPMA") {
      labelAttr = getattributebypid[0].attribute;
      for (let i = 0; i < data.length; i++) {
        for (let x = 0; x < getattributebypid[0].loopLabel.length; x++) {
          for (let y = 1; y <= getattributebypid[0].attribute.length; y++) {
            if (
              data[i][
                getattributebypid[0].loopLabel[x] + "_" + qidx + "_O" + y
              ] != -1
            ) {
              for (let z = 0; z < labelAttr.length; z++) {
                if (
                  labelAttr[z].code ==
                  data[i][
                    getattributebypid[0].loopLabel[x] + "_" + qidx + "_O" + y
                  ]
                ) {
                  var splitCode = getattributebypid[0].loopLabel[x].split(".");
                  var parentCode = parseInt(splitCode);
                  rawdata.push({
                    sbjnum: data[i]["SbjNum"],
                    code: parseInt(labelAttr[z].code),
                    label: labelAttr[z].label,
                    parentlabel: getattributebypid[0].loopLabel[x],
                    parentcode: parentCode,
                    kota: data[i]["Kota"],
                    y: 1,
                    [project[0].topbreak[0].label]:
                      labelAttrS0[
                        await findObj(
                          labelAttrS0,
                          "code",
                          data[i][project[0].topbreak[0].quest]
                        )
                      ].label,
                    [project[0].topbreak[1].label]:
                      labelAttrPR7a[
                        await findObj(
                          labelAttrPR7a,
                          "code",
                          data[i][project[0].topbreak[1].quest]
                        )
                      ].label,
                    [project[0].topbreak[2].label]:
                      labelAttrS7[
                        await findObj(
                          labelAttrS7,
                          "code",
                          data[i][project[0].topbreak[2].quest]
                        )
                      ].label,
                  });
                }
              }
            }
          }
        }
      }
    } else if (getattributebypid[0].type == "OE") {
      for (let i = 0; i < data.length; i++) {
        rawdata.push({
          sbjnum: data[i]["SbjNum"],
          label: data[i][qidx],
          y: 1,
        });
      }
    }
    res.send(rawdata);
  } else {
    res.status(404).json({
      message: "question not found",
    });
  }
};
