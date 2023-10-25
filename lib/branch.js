const Branch = require('../models/branch');

global.getBranchList = function (pid, tags, page, perPage) {
  return new Promise((resolve) => {
    Branch.find({
      projectID: pid,
      tags: tags !== '0' ? tags : { $ne: null },
    })
      .limit(perPage ? perPage : 20)
      .skip(page * perPage)
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

global.getBranchByRawdata = function (pid, rawdata) {
  return new Promise((resolve) => {
    Branch.findOne({
      projectID: pid,
      rawdata: rawdata,
    })
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
