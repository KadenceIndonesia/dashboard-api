require("../lib/dataExcel");
require("../lib/index");

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
