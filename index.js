const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fileupload = require('express-fileupload');
const cors = require('cors');
const mongoose = require('mongoose');
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

require('dotenv').config();
// require('./helpers/init_mongodb')

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
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

app.listen(process.env.PORT, (req, res) => {
  console.log('connect');
});
