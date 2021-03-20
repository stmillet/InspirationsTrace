const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json')

const bucket_name = "colefinalproject"

function uploadImage(image) {
    let bucket = new AWS.S3({ params: {Bucket: bucket_name}})
    const buf = Buffer.from(image.base64, "base64")
    const data  = {
        Key: image.fileName,
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: 'image/png'
    };
    bucket.putObject(data, (err, data) => {
        if (err) {
            console.log('err');
        } else {
            console.log('Image Uploaded...')
            updateCaption(image)
        }
    })
}

function uploadCaption(data) {
    const dynamo = new AWS.DynamoDB({apiVersion: '2012-08-10'})
    console.log(data)
    const params = {
        TableName: 'Captions',
        Item: {
            "caption_id": {S: data.id.toString()},
            "caption_text": {S: data.caption},
        }
    }
    dynamo.putItem(params, (err, data) => {
        if(err) {
            console.log(err)
        } else {
            console.log('Successfully Added!')
        }
    })
}

function updateCaption(data) {
    const docClient = new AWS.DynamoDB.DocumentClient();
    console.log(data.fileName)
    const params = {
        TableName: 'Captions',
        Key: {
            caption_id: data.id.toString()
        },
        UpdateExpression: 'set #a = :next_image',
            ExpressionAttributeNames:{
                "#a": "next_image_name"
            },
            ExpressionAttributeValues: {
                ':next_image': data.fileName
            },
            ReturnValues:'UPDATED_NEW'
    }
    docClient.update(params, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Successfully Updated!')
        }
    })
}

module.exports = {
    uploadImage,
    uploadCaption,
    updateCaption
}