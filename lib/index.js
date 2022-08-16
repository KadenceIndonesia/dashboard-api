const Attributes = require('../models/attributes');
const Project = require('../models/project');

global.findObj = function (array, attr, value) {
  return new Promise((resolve) => {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value) {
        resolve(i);
      }
    }
    resolve(-1);
  });
};

global.excelData = function (pid, subdir) {
  return new Promise((resolve) => {
    var directoryPath = path.join(
      subdir
        ? `${process.env.DIRNAME}${subdir}/${pid}`
        : `${process.env.DIRNAME}${pid}`
    );
    fs.readdir(directoryPath, function (err, files) {
      var dataxls = [];
      var data = [];
      for (var f = 0; f < files.length; f++) {
        var workbook = xslx.readFile(directoryPath + '/' + files[f]);
        var sheetname_list = workbook.SheetNames;
        sheetname_list.forEach(async function (y) {
          var worksheet = workbook.Sheets[y];
          var headers = {};
          for (z in worksheet) {
            if (z[0] === '|') continue;
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

global.projectByPid = function (pid) {
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

global.topbreakByQid = function (pid, qidx) {
  return new Promise((resolve) => {
    Project.findOne({ projectID: pid, 'topbreak.quest': qidx })
      .exec()
      .then((result) => {
        resolve(result.topbreak);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.attributeByQidx = function (pid, qidx) {
  return new Promise((resolve) => {
    Attributes.findOne({ projectID: pid, questionID: qidx })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.findObj = function (array, attr, value) {
  return new Promise((resolve) => {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value) {
        resolve(i);
      }
    }
    resolve(-1);
  });
};

global.sortObject = function (a, b) {
  if (a.count > b.count) {
    return -1;
  }
  if (a.count < b.count) {
    return 1;
  }
  return 0;
};

global.groupingAge = function (group, age) {
  var data = [];
  var index = -1;
  for (let i = 0; i < group.length; i++) {
    var splitString = group[i].label.split('-');
    if (splitString.length === 1) {
      var getNumber = splitString[0].substring(1, 3);
      var getOperator = splitString[0].substring(0, 1);
      if (getOperator === '<') {
        if (age < parseInt(getNumber)) {
          index = i;
        }
      } else if (getOperator === '>') {
        if (age > parseInt(getNumber)) {
          index = i;
        }
      }
    } else if (splitString.length === 2) {
      if (age >= parseInt(splitString[0]) && age <= parseInt(splitString[1])) {
        index = i;
      }
    }
  }
  return index;
};
