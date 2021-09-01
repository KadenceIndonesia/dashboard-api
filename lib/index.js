const Project = require("../models/project");

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

global.projectByPid = function (pid) {
  return new Promise((resolve) => {
    Project.find({projectID: pid})
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        resolve(err);
      });
  });
};
