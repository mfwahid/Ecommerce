const AWS = require('aws-sdk');
AWS.config.update({region:'ap-south-1'});
const ssm = new AWS.SSM();

module.exports = ssm;