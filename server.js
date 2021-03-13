//Require Statements
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const Captions = require('./dbHelper')
const rimraf = require('rimraf')


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
        const path ='./data/images'
        rimraf(path, () => {
            fs.mkdir(path, ()=> console.log('made folder'))
        })
        console.log('deleted')
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
            const imageNum = latestCaption[0].id
            const imageName = `${imageNum}caption.png`
            const imageDetails = {id: imageNum, fileName: imageName}
            Captions.update(imageDetails)
                .then((id) => {
                    //Save the file on the server
                    let data = JSON.stringify(req.body)
                    data = data.replace(/[{}]/g, '');
                    data = data.replace(/"|:/g, '')
                    data = data.replace(/data[A-Za-z-+\/]+;base64,/g, '')
                    const buffer = Buffer.from(data, "base64")

                    fs.writeFileSync(`./data/images/${imageName}`, buffer)
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

app.get("/api/image/", (req, res) => {
    const data = req.query.image_name;
    console.log(data)
    
    const base64 = fs.readFileSync(`/Users/spencermillett/ColeWebsite/Node/data/images/${data}`, "base64")
    const image = {
        image: encodeURI(base64)
    }
    res.send(image)
})

//Get method to return every record in the database

//Listen to traffic on the port
app.listen(process.env.PORT || port, () => console.log(`listening on port ${port}`))



