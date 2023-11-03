const fs = require('fs');
const path = require('path');
const xlsx = require('node-xlsx');
const moment = require('moment');

require('../lib/index');
require('../lib/administration');
require('../lib/celestia');
exports.getTargetTotal = async function (req, res) {
  try {
    const pid = req.params.pid;
    const directorate = parseInt(req.query.directorate);
    const panel = parseInt(req.query.panel);
    // const region = req.query.region;

    var result = await countTargetPanel(pid, directorate, panel);

    res.status(200).json({
      statusCode: 200,
      message: 'Success get Target',
      data: result[0],
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
