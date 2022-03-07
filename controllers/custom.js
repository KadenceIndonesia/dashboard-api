require("../lib/dataExcel");
require("../lib/index");
require("../lib/dataPropana");

global.getProjectByPid = function (pid) {
  return new Promise((resolve) => {
    Project.find({ projectID: pid })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        resolve(err);
      });
  });
};

exports.getCustomGroupData = async function (req, res) {
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
                group: labelAttr[x].group,
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
                if (
                  parseInt(labelAttr[z].code) == 1 ||
                  parseInt(labelAttr[z].code) == 2
                ) {
                  var Group = "Aware";
                } else {
                  var Group = "Not Aware";
                }
                rawdata.push({
                  sbjnum: data[i]["SbjNum"],
                  code: parseInt(labelAttr[z].code),
                  label: Group,
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

exports.getNPSDataBreaks = async function (req, res) {
  var pid = req.params.pid;
  var qidx = req.params.qidx;
  var breaks = req.params.break;
  const break1 = req.query.break1;
  const break2 = req.query.break2;
  const break3 = req.query.break3;
  var code1 = req.query.code1;
  var code2 = req.query.code2;
  var code3 = req.query.code3;
  const project = await projectByPid(pid);
  const filterLogic = (x) => {
    if (code1 && !code2 && !code3) {
      return data[x][break1] == code1;
    } else if (code1 && code2 && !code3) {
      return data[x][break1] == code1 && data[x][break2] == code2;
    } else if (code1 && code2 && code3) {
      return (
        data[x][break1] == code1 &&
        data[x][break2] == code2 &&
        data[x][break3] == code3
      );
    } else if (!code1 && code2 && !code3) {
      return data[x][break2] == code2;
    } else if (!code1 && code2 && code3) {
      return data[x][break2] == code2 && data[x][break3] == code3;
    } else if (!code1 && !code2 && code3) {
      return data[x][break3] == code3;
    } else {
      return true;
    }
  };
  if (project.length > 0) {
    var attribute = await attributeByQidx(pid, qidx);
    var attributeBreaks = await attributeByQidx(pid, breaks);
    if (attribute && attributeBreaks) {
      var rawdata = [];
      for (let i = 0; i < attributeBreaks.attribute.length; i++) {
        rawdata.push({
          code: attributeBreaks.attribute[i].code,
          label: attributeBreaks.attribute[i].label,
          count: 0,
          y: 0,
        });
      }
      var data = await excelData(pid);
      for (let x = 0; x < data.length; x++) {
        if (filterLogic(x)) {
          if (data[x][qidx] != -1 && data[x][breaks] != -1) {
            var findOnObject = await findObj(rawdata, "code", data[x][breaks]);
            rawdata[findOnObject].y =
              rawdata[findOnObject].y + parseInt(data[x][qidx]);
            rawdata[findOnObject].count++;
          }
        }
      }
      res.status(200).send(rawdata);
    } else {
      res.status(404).send({
        messages: "Question not found",
      });
    }
  } else {
    res.status(404).send({
      messages: "Project not found",
    });
  }
};

exports.getNPSData = async function (req, res) {
  var pid = req.params.pid;
  var qidx = req.params.qidx;
  const break1 = req.query.break1;
  const break2 = req.query.break2;
  const break3 = req.query.break3;
  var code1 = req.query.code1;
  var code2 = req.query.code2;
  var code3 = req.query.code3;
  const filterLogic = (i) => {
    if (code1 && !code2 && !code3) {
      return data[i][break1] == code1;
    } else if (code1 && code2 && !code3) {
      return data[i][break1] == code1 && data[i][break2] == code2;
    } else if (code1 && code2 && code3) {
      return (
        data[i][break1] == code1 &&
        data[i][break2] == code2 &&
        data[i][break3] == code3
      );
    } else if (!code1 && code2 && !code3) {
      return data[i][break2] == code2;
    } else if (!code1 && code2 && code3) {
      return data[i][break2] == code2 && data[i][break3] == code3;
    } else if (!code1 && !code2 && code3) {
      return data[i][break3] == code3;
    } else {
      return true;
    }
  };
  const project = await projectByPid(pid);
  if (project.length > 0) {
    var attribute = await attributeByQidx(pid, qidx);
    if (attribute) {
      var rawdata = [];
      for (let i = 0; i < attribute.loopLabel.length; i++) {
        rawdata.push({
          code: attribute.loopLabel[i].code,
          label: attribute.loopLabel[i].label,
          count: 0,
          y: 0,
        });
      }
      var data = await excelData(pid);
      for (let i = 0; i < data.length; i++) {
        if (filterLogic(i)) {
          for (let x = 0; x < attribute.loopLabel.length; x++) {
            if (data[i][`T_${qidx}_${attribute.loopLabel[x].code}`] != -1) {
              rawdata[x].y =
                rawdata[x].y +
                parseInt(data[i][`T_${qidx}_${attribute.loopLabel[x].code}`]);
              rawdata[x].count++;
            }
          }
        }
      }
      res.status(200).send(rawdata);
    } else {
      res.status(404).send({
        messages: "Question not found",
      });
    }
  } else {
    res.status(404).send({
      messages: "Project not found",
    });
  }
};

exports.getDataPropanaFlexmonster = async function (req, res) {
  try {
    const pid = "IDD3999";
    const qidx = "Kelurahan_pangkalan";
    const break1 = req.query.break1;
    const break2 = req.query.break2;
    const break3 = req.query.break3;
    var code1 = req.query.code1;
    var code2 = req.query.code2;
    var code3 = req.query.code3;
    const filterLogic = (x) => {
      if (code1 && !code2 && !code3) {
        return data[x][break1] == code1;
      } else if (code1 && code2 && !code3) {
        return data[x][break1] == code1 && data[x][break2] == code2;
      } else if (code1 && code2 && code3) {
        return (
          data[x][break1] == code1 &&
          data[x][break2] == code2 &&
          data[x][break3] == code3
        );
      } else if (!code1 && code2 && !code3) {
        return data[x][break2] == code2;
      } else if (!code1 && code2 && code3) {
        return data[x][break2] == code2 && data[x][break3] == code3;
      } else if (!code1 && !code2 && code3) {
        return data[x][break3] == code3;
      } else {
        return true;
      }
    };
    const project = await projectByPid(pid);
    var attribute = await attributeByQidx(pid, qidx);
    if (project.length > 0) {
      if (attribute) {
        var data = await excelData(pid);
        var data_screening = await excelData("IDD3999_screening");
        var rawdata = [];
        if (attribute.type === "SA") {
          for (let i = 0; i < attribute.attribute.length; i++) {
            var pangkalan = getDataKelurahan(attribute.attribute[i].code);
            var targetPangkalan = Math.ceil(
              pangkalan.target / pangkalan.pangkalan
            );
            rawdata.push({
              code: attribute.attribute[i].code,
              label: attribute.attribute[i].label,
              y: 0,
              pangkalan: pangkalan.pangkalan,
              targetPangkalan: pangkalan.target,
              target_pangkalan: targetPangkalan,
              target_pangkalan_percent: Math.ceil((targetPangkalan * 90) / 100),
              rekrut_pangkalan: 0,
              rekrutmen: 0,
              sosialisasi: 0,
              pembelian1: 0,
              pembelian2: 0,
            });
          }
          for (let x = 0; x < data.length; x++) {
            if (filterLogic(x) && data[x]["Kelurahan_pangkalan"] != -1) {
              var findOnObject = await findObj(
                rawdata,
                "code",
                parseInt(data[x][qidx])
              );
              if (findOnObject !== -1) {
                rawdata[findOnObject].y++;
              }
              if (
                data[x]["Q7"] == 1 ||
                data[x]["Q7"] == 2 ||
                data[x]["Q7b"] == 1 ||
                data[x]["Q7b"] == 2 ||
                data[x]["Q7d"] == 1 ||
                data[x]["Q7d"] == 2
              ) {
                rawdata[findOnObject].pembelian1++;
              }
              if (
                data[x]["Q9"] == 1 ||
                data[x]["Q9"] == 2 ||
                data[x]["Q9b"] == 1 ||
                data[x]["Q9b"] == 2 ||
                data[x]["Q9d"] == 1 ||
                data[x]["Q9d"] == 2
              ) {
                rawdata[findOnObject].pembelian2++;
              }
              if (data[x]["S20"] == 3) {
                rawdata[findOnObject].rekrutmen++;
              }
              if (data[x]["Q1"] == 1) {
                rawdata[findOnObject].sosialisasi++;
              }
            }
          }
        }
        for (let x = 0; x < data_screening.length; x++) {
          if (data_screening[x]["UB11"] === 4) {
            var findOnObject = await findObj(
              rawdata,
              "code",
              parseInt(data_screening[x]["Kelurahan"])
            );
            if (findOnObject !== -1) {
              rawdata[findOnObject].rekrut_pangkalan++;
            }
          }
        }
        res.status(200).send(rawdata);
      } else {
        res.status(404).send({
          messages: "Question not found",
        });
      }
    } else {
      res.status(404).send({
        messages: "Project not found",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getDetailPropana = async function (req, res) {
  try {
    const pid = "IDD3999";
    const qidx = "Kelurahan_pangkalan";
    const break1 = req.query.break1;
    const break2 = req.query.break2;
    const break3 = req.query.break3;
    var code1 = req.query.code1;
    var code2 = req.query.code2;
    var code3 = req.query.code3;
    const filterLogic = (x) => {
      if (code1 && !code2 && !code3) {
        return data[x][break1] == code1;
      } else if (code1 && code2 && !code3) {
        return data[x][break1] == code1 && data[x][break2] == code2;
      } else if (code1 && code2 && code3) {
        return (
          data[x][break1] == code1 &&
          data[x][break2] == code2 &&
          data[x][break3] == code3
        );
      } else if (!code1 && code2 && !code3) {
        return data[x][break2] == code2;
      } else if (!code1 && code2 && code3) {
        return data[x][break2] == code2 && data[x][break3] == code3;
      } else if (!code1 && !code2 && code3) {
        return data[x][break3] == code3;
      } else {
        return true;
      }
    };
    const project = await projectByPid(pid);
    var attribute = await attributeByQidx(pid, qidx);
    if (project.length > 0) {
      if (attribute) {
        var data = await excelData(pid);
        var rawdata = [];
        if (attribute.type === "SA") {
          for (let i = 0; i < attribute.attribute.length; i++) {
            var pangkalan = getDataKelurahan(attribute.attribute[i].code);
            // rawdata.push({
            //   code: attribute.attribute[i].code,
            //   label: attribute.attribute[i].label,
            //   y: 0,
            //   pangkalan: pangkalan.pangkalan,
            //   targetPangkalan: pangkalan.target,
            //   rekrutmen: 0,
            //   sosialisasi: 0,
            //   pembelian1: 0,
            //   pembelian2: 0,
            // });
          }
          for (let x = 0; x < data.length; x++) {
            if (filterLogic(x) && data[x]["Kelurahan_pangkalan"] != -1) {
              rawdata.push({
                sbjnum: data[x]["SbjNum"],
                nama: data[x]["NAMA_PENERIMA"],
                no_hp: data[x]["U5A_Tlp"] !== -1 ? data[x]["U5A_Tlp"] : "N/A",
                my_pertamina:
                  data[x]["Q2"] === 1 ||
                  data[x]["UA6A"] === 1 ||
                  data[x]["UA6B"] === 1 ||
                  data[x]["Q2g_2"] === 1
                    ? "Sudah"
                    : "Belum",
                smartphone:
                  data[x]["UA1"] === 1 || data[x]["UA2"] === 1 ? "ya" : "tidak",
                pembelian1:
                  data[x]["Q7"] === 1 ||
                  data[x]["Q7"] === 2 ||
                  data[x]["Q7d"] === 1 ||
                  data[x]["Q7d"] === 2
                    ? "Sudah"
                    : "Belum",
                pembelian2: "",
              });
              // var findOnObject = await findObj(
              //   rawdata,
              //   "code",
              //   parseInt(data[x][qidx])
              // );
              // if (findOnObject !== -1) {
              //   rawdata[findOnObject].y++;
              // }
              // if (
              //   data[x]["Q7"] == 1 ||
              //   data[x]["Q7"] == 2 ||
              //   data[x]["Q7"] == 1 ||
              //   data[x]["Q7b"] == 2
              // ) {
              //   rawdata[findOnObject].pembelian1++;
              // }
              // if (
              //   data[x]["Q9"] == 1 ||
              //   data[x]["Q9"] == 2 ||
              //   data[x]["Q9"] == 1 ||
              //   data[x]["Q9b"] == 2
              // ) {
              //   rawdata[findOnObject].pembelian2++;
              // }
              // if (data[x]["S20"] == 3) {
              //   rawdata[findOnObject].rekrutmen++;
              // }
              // if (data[x]["Q1"] == 1) {
              //   rawdata[findOnObject].sosialisasi++;
              // }
            }
          }
        }
        res.status(200).send(rawdata);
      } else {
        res.status(404).send({
          messages: "Question not found",
        });
      }
    } else {
      res.status(404).send({
        messages: "Project not found",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getOverviewPropana = async function (req, res) {
  try {
    const pid = "IDD3999";
    const S20 = "S20";
    const screeningpangkalan = await excelData("IDD3999_screening");
    var data = await excelData(pid);
    var countS20 = 0;
    var countRecruit = 0;
    var countPembelian1 = 0;
    var countPembelian2 = 0;
    for (let x = 0; x < data.length; x++) {
      if (
        data[x][S20] === 1 ||
        data[x][S20] === 3 ||
        data[x][S20] === 4 ||
        data[x][S20] === 5 ||
        data[x][S20] === 6 ||
        data[x][S20] === 7
      ) {
        countS20++;
      }
      if (data[x][S20] === 3) {
        countRecruit++;
      }
      if (
        data[x]["Q7"] === 1 ||
        data[x]["Q7"] === 2 ||
        data[x]["Q7b"] === 1 ||
        data[x]["Q7b"] === 2 ||
        data[x]["Q7d"] === 1 ||
        data[x]["Q7d"] === 2
      ) {
        countPembelian1++;
      }
      if (
        data[x]["Q9"] === 1 ||
        data[x]["Q9"] === 2 ||
        data[x]["Q9b"] === 1 ||
        data[x]["Q9b"] === 2 ||
        data[x]["Q9d"] === 1 ||
        data[x]["Q9d"] === 2
      ) {
        countPembelian2++;
      }
    }
    var countScreeningPangkalan = screeningpangkalan.length;
    var rawdata = [
      {
        label: "Contact Pangkalan",
        y: countScreeningPangkalan,
        percent: ((countScreeningPangkalan * 100) / 638).toFixed(2),
      },
      {
        label: "Total Contact KPM",
        y: countS20,
        percent: ((countS20 * 100) / 114930).toFixed(4),
      },
      {
        label: "Total Recruit KPM",
        y: countRecruit,
        percent: ((countRecruit * 100) / 100000).toFixed(4),
      },
      {
        label: "Total Pembelian1",
        y: countPembelian1,
        percent: ((countPembelian1 * 100) / 100000).toFixed(4),
      },
      {
        label: "Total Pembelian2",
        y: countPembelian2,
        percent: ((countPembelian2 * 100) / 100000).toFixed(4),
      },
    ];
    res.status(200).send(rawdata);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getOverviewAchievementPropana = async function (req, res) {
  try {
    const pid = "IDD3999";
    const qidx = req.params.qidx;
    const project = await projectByPid(pid);
    var attribute = await attributeByQidx(pid, qidx);
    if (project.length > 0) {
      if (attribute) {
        var data = await excelData(pid);
        var rawdata = [];
        var base = 0;
        if (attribute.type === "SA") {
          for (let i = 0; i < attribute.attribute.length; i++) {
            rawdata.push({
              code: attribute.attribute[i].code,
              label: attribute.attribute[i].label,
              y: 0,
              count: 0,
              target: 0,
            });
          }
          for (let x = 0; x < data.length; x++) {
            if (data[x]["S20"] === 3) {
              var findOnObject = await findObj(
                rawdata,
                "code",
                parseInt(data[x][qidx])
              );
              base++;
              if (findOnObject !== -1) {
                rawdata[findOnObject].count++;
                rawdata[findOnObject].y = parseFloat(
                  ((rawdata[findOnObject].count * 100) / base).toFixed(2)
                );
              }
            }
          }
        }
        for (let i = 0; i < rawdata.length; i++) {
          rawdata[i].target = base;
        }
        res.status(200).send(rawdata);
      } else {
        res.status(404).send({
          messages: "Question not found",
        });
      }
    } else {
      res.status(404).send({
        messages: "Project not found",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAchievementPropana = async function (req, res) {
  try {
    const pid = "IDD3999";
    const project = await projectByPid(pid);
    const break1 = req.query.break1;
    const break2 = req.query.break2;
    const break3 = req.query.break3;
    var code1 = req.query.code1;
    var code2 = req.query.code2;
    var code3 = req.query.code3;
    const filterLogic = (x) => {
      if (code1 && !code2 && !code3) {
        return data[x][break1] == code1;
      } else if (code1 && code2 && !code3) {
        return data[x][break1] == code1 && data[x][break2] == code2;
      } else if (code1 && code2 && code3) {
        return (
          data[x][break1] == code1 &&
          data[x][break2] == code2 &&
          data[x][break3] == code3
        );
      } else if (!code1 && code2 && !code3) {
        return data[x][break2] == code2;
      } else if (!code1 && code2 && code3) {
        return data[x][break2] == code2 && data[x][break3] == code3;
      } else if (!code1 && !code2 && code3) {
        return data[x][break3] == code3;
      } else {
        return true;
      }
    };
    if (project.length > 0) {
      var data = await excelData(pid);
      var target = 0;
      if (break1 === "UA1") {
        target = 70000;
      } else if (break1 === "UA2") {
        target = 30000;
      } else {
        if (code1 && !code2) {
          var pangkalan = getDataKelurahan(code1);
          target = pangkalan.target;
        } else if (code1 && code2) {
          var pangkalan = getDataKelurahan(code1);
          var targetPangkalan = Math.ceil(
            pangkalan.target / pangkalan.pangkalan
          );
          target = Math.ceil((targetPangkalan * 90) / 100);
        } else {
          target = 100000;
        }
      }
      var rawdata = [
        {
          label: "Recruitment",
          y: 0,
          count: 0,
          target: target,
        },
        {
          label: "Sosialisasi",
          y: 0,
          count: 0,
          target: target,
        },
        {
          label: "Download & Install My Pertamina",
          y: 0,
          count: 0,
          target: target,
        },
        {
          label: "Download & Install Link aja",
          y: 0,
          count: 0,
          target: target,
        },
        {
          label: "Pembelian 1",
          y: 0,
          count: 0,
          target: target,
        },
        {
          label: "Pembelian 2",
          y: 0,
          count: 0,
          target: target,
        },
        {
          label: "Pembelian 1", // my pertamina
          y: 0,
          count: 0,
          target: target,
        },
        {
          label: "Pembelian 2", // my pertamina
          y: 0,
          count: 0,
          target: target,
        },
      ];
      for (let x = 0; x < data.length; x++) {
        if (filterLogic(x)) {
          if (data[x]["S20"] === 3) {
            rawdata[0].count++;
            rawdata[0].y = parseFloat(
              ((rawdata[0].count * 100) / target).toFixed(2)
            );
          }
          if (data[x]["Q1"] === 1) {
            rawdata[1].count++;
            rawdata[1].y = parseFloat(
              ((rawdata[1].count * 100) / target).toFixed(2)
            );
          }
          if (
            data[x]["UA6A"] === 1 ||
            data[x]["UA6B"] === 1 ||
            data[x]["Q2"] === 1 ||
            data[x]["Q2g_2"] === 1
          ) {
            rawdata[2].count++;
            rawdata[2].y = parseFloat(
              ((rawdata[2].count * 100) / target).toFixed(2)
            );
          }
          if (
            data[x]["UA8A"] === 1 ||
            data[x]["UA8B"] === 1 ||
            data[x]["Q3"] === 1 ||
            data[x]["Q2i_2"] === 1
          ) {
            rawdata[3].count++;
            rawdata[3].y = parseFloat(
              ((rawdata[3].count * 100) / target).toFixed(2)
            );
          }
          if (
            data[x]["Q7"] === 1 ||
            data[x]["Q7"] === 2 ||
            data[x]["Q7b"] === 1 ||
            data[x]["Q7b"] === 2 ||
            data[x]["Q7d"] === 1 ||
            data[x]["Q7d"] === 2
          ) {
            rawdata[4].count++;
            rawdata[4].y = parseFloat(
              ((rawdata[4].count * 100) / target).toFixed(2)
            );
          }
          if (
            data[x]["Q9"] === 1 ||
            data[x]["Q9"] === 2 ||
            data[x]["Q9b"] === 1 ||
            data[x]["Q9b"] === 2 ||
            data[x]["Q9d"] === 1 ||
            data[x]["Q9d"] === 2
          ) {
            rawdata[5].count++;
            rawdata[5].y = parseFloat(
              ((rawdata[5].count * 100) / target).toFixed(2)
            );
          }
          if (
            data[x]["Q7"] === 1 ||
            (data[x]["Q7"] === 2 && data[x]["Q4"] === 2)
          ) {
            rawdata[6].count++;
            rawdata[6].y = parseFloat(
              ((rawdata[6].count * 100) / target).toFixed(4)
            );
          }
          if (
            data[x]["Q9"] === 1 ||
            (data[x]["Q9"] === 2 && data[x]["Q4c"] === 2)
          ) {
            rawdata[7].count++;
            rawdata[7].y = parseFloat(
              ((rawdata[7].count * 100) / target).toFixed(4)
            );
          }
        }
      }
      res.status(200).send(rawdata);
    } else {
      res.status(404).send({
        messages: "Project not found",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getOverviewAchievementAgePropana = async function (req, res) {
  try {
    const pid = "IDD3999";
    const qidx = "S4";
    const project = await projectByPid(pid);
    var attribute = await attributeByQidx(pid, qidx);
    if (project.length > 0) {
      if (attribute) {
        var data = await excelData(pid);
        var rawdata = [];
        var base = 0;
        if (attribute.type === "SA") {
          for (let i = 0; i < attribute.attribute.length; i++) {
            rawdata.push({
              code: attribute.attribute[i].code,
              label: attribute.attribute[i].label,
              y: 0,
              count: 0,
              target: 0,
            });
          }
          for (let x = 0; x < data.length; x++) {
            if (data[x]["S20"] === 3) {
              base++;
              if (data[x][qidx] === 1) {
                rawdata[0].count++;
                rawdata[0].y = parseFloat(
                  ((rawdata[0].count * 100) / base).toFixed(2)
                );
              }
              if (data[x][qidx] === 2) {
                rawdata[1].count++;
                rawdata[1].y = parseFloat(
                  ((rawdata[1].count * 100) / base).toFixed(2)
                );
              }
              if (data[x][qidx] === 3) {
                rawdata[2].count++;
                rawdata[2].y = parseFloat(
                  ((rawdata[2].count * 100) / base).toFixed(2)
                );
              }
              if (data[x][qidx] === 4) {
                rawdata[3].count++;
                rawdata[3].y = parseFloat(
                  ((rawdata[3].count * 100) / base).toFixed(2)
                );
              }
              if (data[x][qidx] === 5) {
                rawdata[4].count++;
                rawdata[4].y = parseFloat(
                  ((rawdata[4].count * 100) / base).toFixed(2)
                );
              }
              if (data[x][qidx] === 6) {
                rawdata[5].count++;
                rawdata[5].y = parseFloat(
                  ((rawdata[5].count * 100) / base).toFixed(2)
                );
              }
              if (data[x][qidx] === 7) {
                rawdata[6].count++;
                rawdata[6].y = parseFloat(
                  ((rawdata[6].count * 100) / base).toFixed(2)
                );
              }
            }
          }
        }
        for (let i = 0; i < rawdata.length; i++) {
          rawdata[i].target = base;
        }
        res.status(200).send(rawdata);
      } else {
        res.status(404).send({
          messages: "Question not found",
        });
      }
    } else {
      res.status(404).send({
        messages: "Project not found",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getOverviewAchievementSESPropana = async function (req, res) {
  try {
    const pid = "IDD3999";
    const qidx = "S11";
    var attribute = await attributeByQidx(pid, qidx);
    if (attribute) {
      var data = await excelData(pid);
      var rawdata = [];
      var base = 0;
      if (attribute.type === "SA") {
        for (let i = 0; i < attribute.attribute.length; i++) {
          rawdata.push({
            code: attribute.attribute[i].code,
            label: attribute.attribute[i].label,
            y: 0,
            count: 0,
            target: 0,
          });
        }
        for (let x = 0; x < data.length; x++) {
          if (data[x]["S20"] === 3) {
            base++;
            if (data[x][qidx] === 1) {
              rawdata[0].count++;
              rawdata[0].y = parseFloat(
                ((rawdata[0].count * 100) / base).toFixed(2)
              );
            }
            if (data[x][qidx] === 2) {
              rawdata[1].count++;
              rawdata[1].y = parseFloat(
                ((rawdata[1].count * 100) / base).toFixed(2)
              );
            }
            if (data[x][qidx] === 3) {
              rawdata[2].count++;
              rawdata[2].y = parseFloat(
                ((rawdata[2].count * 100) / base).toFixed(2)
              );
            }
            if (data[x][qidx] === 4) {
              rawdata[3].count++;
              rawdata[3].y = parseFloat(
                ((rawdata[3].count * 100) / base).toFixed(2)
              );
            }
            if (data[x][qidx] === 5) {
              rawdata[4].count++;
              rawdata[4].y = parseFloat(
                ((rawdata[4].count * 100) / base).toFixed(2)
              );
            }
          }
        }
      }
      for (let i = 0; i < rawdata.length; i++) {
        rawdata[i].target = base;
      }
      res.status(200).send(rawdata);
    } else {
      res.status(404).send({
        messages: "Question not found",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getOverviewAchievementKKSPropana = async function (req, res) {
  try {
    const pid = "IDD3999";
    const qidx = "S1a";
    var data = await excelData(pid);
    var base = 0;
    rawdata = [
      {
        code: 1,
        label: "Pemilik KKS",
        y: 0,
        count: 0,
        target: 0,
      },
      {
        code: 2,
        label: "Non Pemilik KKS",
        y: 0,
        count: 0,
        target: 0,
      },
    ];
    for (let x = 0; x < data.length; x++) {
      if (data[x]["S20"] === 3) {
        base++;
        if (data[x][qidx] === 1) {
          rawdata[0].count++;
          rawdata[0].y = parseFloat(
            ((rawdata[0].count * 100) / base).toFixed(2)
          );
        }
        if (data[x][qidx] === 2) {
          rawdata[1].count++;
          rawdata[1].y = parseFloat(
            ((rawdata[1].count * 100) / base).toFixed(2)
          );
        }
      }
    }
    for (let i = 0; i < rawdata.length; i++) {
      rawdata[i].target = base;
    }
    res.status(200).send(rawdata);
  } catch (error) {
    res.status(400).send(error);
  }
};
