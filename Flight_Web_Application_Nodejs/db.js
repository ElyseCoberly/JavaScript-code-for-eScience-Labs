var mongoose = require('mongoose');

mongoose.connect('mongodb://cqiang:cui3238999@ds027483.mlab.com:27483/flights111');

module.export = mongoose.connection;