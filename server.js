const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    // { fileName: 'hii', message: 'Hey this is text' }
    // console.log(req.body);
    // __dirname+`\\hii ji`.split(" ").join("") + ".txt"
    fs.readdir('./files', (err,files) => {
        if(err){
            console.log("Error Reading Files ... ");
        }
        res.render("Home", {fileName: files});
    })
});

var counter = 1;
app.post("/submitForm", (req,res)=> {
    console.log(__dirname + `\\files\\${req.body.fileName}.txt`);
    if(fs.existsSync(__dirname + `\\files\\${req.body.fileName}.txt`)){
        console.log("file already exists");
        fs.writeFile(path.join(__dirname+`\\files\\${req.body.fileName}`.split(" ").join("") + counter + ".txt"), req.body.message , (err) => {
            console.log("updated counter " + counter);
            if(err){
                console.log("Error Writing into files");
            }
            console.log("File Created successfully without overwriting");
            res.redirect('/');
        })
        counter++;
        console.log(counter);

    }
    else if(`${req.body.fileName}`.split(" ").join("")==''){
        res.render("Error");
    }
    else{
        fs.writeFile(path.join(__dirname+`\\files\\${req.body.fileName}`.split(" ").join("") + ".txt"), req.body.message , (err) => {
            if(err){
                console.log("Error Writing into files");
            }
            console.log("File Created successfully");
            res.redirect('/');
        })
    }
})

app.get('/viewFile/:nameOfFile', (req, res) => {
    // nameOfFile: 'myfile.txt' 
    // console.log(req.params.nameOfFile);
    fs.readFile(`./files/${req.params.nameOfFile}`, (err,data)=> {
        if(err){
            console.log("the error is : ", err);
        }
        res.render("View", {name: req.params.nameOfFile, message: data})
    })
    // console.log(data);
    
})

app.get("/edit/:requestedFile", (req,res) => {
    res.render("edit", {filename: req.params.requestedFile});
})

app.post("/edit", (req,res) => {
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}` , (err)=> {
        console.log("error occored -- ", err);
    })
    console.log("file updated"); 
    res.redirect("/");   
})

app.get("/delete/:fileToDelete", (req,res) => {
    // console.log(req.body);
    // console.log(req.params);
    fs.unlink(path.join(__dirname + `/files/${req.params.fileToDelete}`), (err) => {
        console.log("error in file --", err);
    })
    res.render("Delete");
})

app.listen(PORT, (err)=> {
    if(err) {
        console.log(err);
    }
    console.log(`Server is running on port ${PORT}`);
})