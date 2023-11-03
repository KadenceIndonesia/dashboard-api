const Panel = require('../models/panels');

global.countTargetPanel = function (pid, directorate, panel) {
  return new Promise((resolve) => {
    Panel.aggregate([
      {
        $match: {
          idProject: pid,
          idDirectorate:
            directorate === 0 || !directorate ? { $ne: null } : directorate,
          idPanel: panel === 0 || !panel ? { $ne: null } : panel,
        },
      },
      {
        $group: {
          _id: null,
          target: { $sum: '$target' },
        },
      },
    ])
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
