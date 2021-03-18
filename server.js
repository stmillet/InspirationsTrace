//Require Statements
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const Captions = require('./dbHelper')
const request = require('request')


//Variables
const app = express();
const port = 5500


//Set up the server
app.use(cors())
app.use(bodyParser())
app.use(express.json())
app.use(express.static('views'))


//Post method to create a new caption record
//Used when naming an existing picture of reseting the chain
app.post("/api/caption", (req, res) => {
    
    //If statement to determine if we are reseting the database first or not.
    console.log('this is a test')
    if (req.body.reset === 'true') {
        Captions.del()
    }    

    //Add Record to the database and then return the id
    Captions.add(req.body)
    .then(caption => {
        console.log(caption)
        res.status(200).json(caption)
    })
    .catch(error => {
        res.status(500).json({message: 'cannot add caption'})
    })
})

//Post method to save the draw picture and update the database with the file name. 
app.post("/api/image", (req, res) => {
    
    //Insert the name of the file into the database
    Captions.getLatest()
        .then((latestCaption) => {
            let data = JSON.stringify(req.body)
            data = data.replace(/[{}]/g, '');
            data = data.replace(/"|:/g, '')
            data = data.replace(/data[A-Za-z-+\/]+;base64,/g, '')
            const imageNum = latestCaption[0].id
            const imageName = `${imageNum}caption.png`
            const imageDetails = {id: imageNum, fileName: imageName, base64: data}
            Captions.update(imageDetails)
                .then((id) => {
                    //Save the file on the server
                    res.end('File Saved')
                })
        })
})

//Get method to return the last record in the database
app.get("/api/latest", (req, res) => {
    Captions.getLatest()
        .then(data1 => {
            res.end(JSON.stringify(data1))
        })
})

//Update local database with all the online submittions
app.get("/api/api/updatedb", (req, res) => {
    request('https://inspirations-trace.herokuapp.com/api/latest', function(error, response, body) {
        const data = JSON.parse(body)
        Captions.del()
            .then(() => {
                data.forEach((item) => {
                    Captions.insertAll(item)
                        .then(id => {
                            console.log(id)
                        })
                })
                res.end()
            })
        
    });
})
//Listen to traffic on the port
app.listen(process.env.PORT || port, () => console.log(`listening on port ${port}`))



