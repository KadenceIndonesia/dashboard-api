const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fileupload = require('express-fileupload');
const cors = require('cors');
const mongoose = require('mongoose');
const { koins, shoko } = require('./config/db');
const indexRoutes = require('./routes/index');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project');
const formRoutes = require('./routes/form');
const attributeRoutes = require('./routes/attribute');
const hyundaiRoutes = require('./routes/hyundai');
const administrationRoutes = require('./routes/administration');
const propanaRoutes = require('./routes/propana');
const propana2Routes = require('./routes/propana2');
const branchRoutes = require('./routes/branch');
const celestiaRoutes = require('./routes/celestia');
const steglitzRoutes = require('./routes/steglitz');
const albusRoutes = require('./routes/albus');
const evidenceRoutes = require('./routes/evidence');
const vehicleRoutes = require('./routes/vehicle');
const speechToTextRoutes = require('./routes/speechToText');
const hakkinenRoutes = require('./routes/hakkinen');
const shokoRoutes = require('./routes/shoko');
const clementineRoutes = require('./routes/clementine');

require('dotenv').config();
// require('./helpers/init_mongodb')

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

app.use(fileupload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.use('/', indexRoutes);
app.use('/api', apiRoutes);
app.use('/administration', administrationRoutes);
app.use('/project', projectRoutes);
app.use('/auth', authRoutes);
app.use('/form', formRoutes);
app.use('/attribute', attributeRoutes);
app.use('/hyundai', hyundaiRoutes);
app.use('/propana', propanaRoutes);
app.use('/propana2', propana2Routes);
app.use('/branch', branchRoutes);
app.use('/celestia', celestiaRoutes);
app.use('/steglitz', steglitzRoutes);
app.use('/speech-to-text', speechToTextRoutes);
app.use('/evidence', evidenceRoutes);
app.use('/vehicle', vehicleRoutes);
app.use('/albus', albusRoutes);
app.use('/hakkinen', hakkinenRoutes);
app.use('/shoko', shokoRoutes);
app.use('/clementine', clementineRoutes);

app.listen(process.env.PORT, (req, res) => {
  console.log('connect');
});
