const express = require('express');
const bodyParser = require('body-parser');
const app = express();
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


require('dotenv').config();
// require('./helpers/init_mongodb')

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// app.use(bodyParser.urlencoded());
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


app.listen(process.env.PORT, (req, res) => {
  console.log('connect');
});
