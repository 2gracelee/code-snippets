const aws = require('aws-sdk')

const region = 'us-west-1';

aws.config.update({credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
},
    region: region
});

const getSignedUrl = (filename, filetype) => {
    var s3 = new aws.S3();
    const bucketName = 'snappe';
    var params = {
        Bucket: bucketName,
        Key: filename,
        Expires: 60,
        ContentType: filetype
    }
    const unsignedUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${filename}`;
     return new Promise((resolve, reject) => {
        s3
        .getSignedUrl('putObject', params, function (err, data) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                const returnedData = {
                    unsignedUrl: unsignedUrl,
                    signedUrl: data
                }
                resolve(returnedData);
            }
        })
     }) 
};

module.exports = {
    getSignedUrl,
}
