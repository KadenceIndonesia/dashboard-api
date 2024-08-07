const Attributes = require('../models/attributes');
const Project = require('../models/project');
const moment = require('moment');

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
global.groupingByQidx = function (pid, qidx) {
  return new Promise((resolve) => {
    Attributes.findOne({ projectID: pid, questionID: qidx })
      .exec()
      .then((result) => {
        resolve(result.grouping);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.findObj = function (array, attr, value) {
  return new Promise((resolve) => {
    for (var i = 0; i < array.length; i += 1) {
      if (Array.isArray(array[i][attr])) {
        if (array[i][attr].indexOf(value) !== -1) {
          resolve(i);
        }
      } else {
        if (array[i][attr] === value) {
          resolve(i);
        }
      }
    }
    resolve(-1);
  });
};

global.findSubObj = function (array, attr, subAttr, value) {
  return new Promise((resolve) => {
    for (var i = 0; i < array.length; i += 1) {
      if (Array.isArray(array[i][attr])) {
        if (array[i][attr][subAttr].indexOf(value) !== -1) {
          resolve(i);
        }
      } else {
        if (array[i][attr][subAttr] === value) {
          resolve(i);
        }
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

global.getAttributesByPid = function (pid, qidx) {
  return new Promise((resolve) => {
    Attributes.find({ projectID: pid, questionID: qidx })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.decimalPlaces = function (value, decimal) {
  if (value % 1 !== 0) {
    var valueToFixed = value.toFixed(decimal);
    var result = parseFloat(valueToFixed);
  } else {
    var result = value;
  }
  return result;
};

global.countPercent = function (value, base) {
  var count = (value / base) * 100;
  var values = count.toFixed(2);
  var result;
  if (value > 0) {
    if (result % 1 !== 0) {
      result = parseFloat(values);
    } else {
      result = values;
    }
  } else {
    result = 0;
  }

  return result;
};

global.excelDatetoJS = function (serial) {
  var utc_days = Math.floor(serial - 25569);
  var utc_value = utc_days * 86400;
  var date_info = new Date(utc_value * 1000);

  var fractional_day = serial - Math.floor(serial) + 0.0000001;

  var total_seconds = Math.floor(86400 * fractional_day);

  var seconds = total_seconds % 60;

  total_seconds -= seconds;

  var hours = Math.floor(total_seconds / (60 * 60));
  var minutes = Math.floor(total_seconds / 60) % 60;

  return new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate(),
    hours,
    minutes,
    seconds
  );
};

global.randomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

global.rangeDate = function (startDate, endDate) {
  var start = moment(startDate);
  var end = moment(endDate);
  var diff = end.diff(start, 'days');
  var dates = [];

  for (let i = 0; i < diff; i++) {
    var getDate = moment(start).add(i, 'days');
    var getDay = moment(getDate).format('dddd');
    if (getDay !== 'Saturday' && getDay !== 'Sunday') {
      dates.push(moment(getDate).format('YYYY-MM-DD'));
    }
  }

  return dates;
};
