require('../lib/score');
exports.testController = async function (req, res) {
  try {
    res.status(200).json({
      statusCode: 200,
      message: 'Success test',
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getScoreCountry = async function (req, res) {
  try {
    const pid = req.params.pid;
    var result = [];
    var data = await scoreCountry(pid);
    result.push({
      name: 'Indonesia',
      data: [0, 0, 0, 0, 0],
    });
    for (let i = 0; i < data.length; i++) {
      result.push({
        name: data[i]._id.country,
        data: [
          data[i].score,
          data[i].logo,
          data[i].typography,
          data[i].color,
          data[i].imageStyle,
          data[i].graphicSystem,
        ],
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Success GET Score By Country',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getScoreCountryRegion = async function (req, res) {
  try {
    const pid = req.params.pid;
    var result = [
      {
        name: 'Indonesia',
        region: '',
      },
      {
        name: 'Thailand',
        region: [],
      },
      {
        name: 'Philippines',
        region: [],
      },
      {
        name: 'Vietnam',
        region: [],
      },
    ];

    for (let i = 0; i < result.length; i++) {
      var _scoreRegion = await scoreRegion(pid, result[i].name);
      if (_scoreRegion.length > 0) {
        result[i].region = _scoreRegion;
      }
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Success GET Score By Country',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getScoreCountryChannel = async function (req, res) {
  try {
    const pid = req.params.pid;
    var result = [
      {
        name: 'Indonesia',
        channel: '',
      },
      {
        name: 'Thailand',
        channel: [],
      },
      {
        name: 'Philippines',
        channel: [],
      },
      {
        name: 'Vietnam',
        channel: [],
      },
    ];

    for (let i = 0; i < result.length; i++) {
      var _scoreCountryChannel = await scoreCountryChannel(pid, result[i].name);
      if (_scoreCountryChannel.length > 0) {
        result[i].channel = _scoreCountryChannel;
      }
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Success GET Score By Country',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getScoreChannel = async function (req, res) {
  try {
    const pid = req.params.pid;
    var result = [];
    var data = await scoreChannel(pid);
    for (let i = 0; i < data.length; i++) {
      result.push({
        name: data[i]._id.channel,
        data: [
          data[i].score,
          data[i].logo,
          data[i].typography,
          data[i].color,
          data[i].imageStyle,
          data[i].graphicSystem,
        ],
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Success GET Score By Country',
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
