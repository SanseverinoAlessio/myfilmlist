const AWS = require('aws-sdk');
const s3Bucket = new AWS.S3({
  accessKeyId: process.env.aws_key,
  secretAccessKey: process.env.aws_secret,
  Bucket:process.env.bucket_name,
});
module.exports = s3Bucket;
