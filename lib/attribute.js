const Attribute = require('../models/attributes');

global.getAttributeList = function ({pid, qidx}) {
  return new Promise((resolve) => {
    Attribute.findOne({
      projectID: pid,
      questionID: qidx,
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
