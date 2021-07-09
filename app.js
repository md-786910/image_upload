const express = require("express")
const app = express();
const http = require("http");
const path = require("path")
const mongoose = require('mongoose');
const multer = require("multer")
const hbs = require("hbs");
const bodyParser = require("body-parser");
const mongodb = require("mongodb").MongoClient
const server = http.createServer(app)
app.use(express.urlencoded())
const port = 3001 || env.process.PORT;

// add req with express
app.use(express.json())

// add body parser 

app.use(bodyParser());
// add mongoose header

// connect to mongodb database
//mongodb+srv://db:6O3rHBpJYYLnGjbV@database.l2fnk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
// ', { useNewUrlParser: true, useUnifiedTopology: true });


const mongoCon = async () => {
    try {

        await mongoose.connect("mongoose.connect('mongodb://localhost:27017/image2",

            {
                keepAlive: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            }).then(() => {
                console.log("connected")
            }).catch((error) => {
                console.log(error)
            });
    } catch (error) {
        console.log(error)
    }

}
// function call
mongoCon();

// for image
const imageSchema = new mongoose.Schema({
    file: String,

});

const image1 = mongoose.model('image1', imageSchema);

// for form
const allformdata = new mongoose.Schema({
    name: String,
    email: String,
    password: String

});

const commentBox = mongoose.model("commentBox", allformdata);

// only for comment

const comment = new mongoose.Schema({
    commentval: String
});

const newcomment = mongoose.model("newcomment", comment);


// serve static file
app.use(express.static(path.join(__dirname, "/public")));
const templateviews = path.join(__dirname, "/templates/views")
const templatepartial = path.join(__dirname, "/templates/partials")
app.use(express.static(templatepartial))
// app.use(express.static(templateviews));

// set hbs engine
app.set("view engine", "hbs");
app.set("views", templateviews)

// set partials 
hbs.registerPartials(templatepartial);

// uplaod image 
let storage = multer.diskStorage({
    destination: "./public/upload",
    filename: (req, file, cb) => {

        // cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))

        cb(null, file.originalname);
    }
})

// multer middleware
let uploads = multer({
    storage: storage,
}).single("file")


// get method
app.get("/", async (req, res) => {
    try {
        // get image
        let getdata = await image1.find();

        // get name
        const data = await commentBox.find();
        let len = data.length;
        let name = data[len - 1].name;
        res.render("index", {
            src: getdata,
            md: name,
        });
        len++;
    } catch (error) {
        console.log(error)
    }

})
// post method
app.post("/", async (req, res) => {
    try {
        // for comment

        console.log("/", req.body.comments)
        let doc = new newcomment(req.body);
        let data = await doc.save();
        // console.log(data)
        let box = "Your Comment Successfully Send!"
        res.render("index", {
            box: box,
        });

    }
    catch (error) {
        console.log(error)
    }

})
app.get("/about", async (req, res) => {
    try {
        // get name
        const data = await commentBox.find();
        let len = data.length;
        // let len = 0
        // let name = data[len - 1].name;
        let name = data[len - 1].name;
        res.render("about", {
            md: name
        });
        len++;
    } catch (error) {
        console.log(error)
    }

})
app.post("/about", async (req, res) => {
    try {
        // console.log("/about", req.body.comments)
        let doc = new newcomment(req.body);
        let data = await doc.save();
        // console.log(data)
        let box = "Your Comment Successfully Send!"
        res.render("about", {
            box: box,
        });
    } catch (error) {
        console.log(error)
    }
})
app.get("/all_image", async (req, res) => {
    try {
        // comment get name
        const data = await commentBox.find();
        let len = data.length;
        // let len = 0;
        let name = data[len - 1].name;

        // get image
        let getdata = await image1.find();
        // console.log(getdata)
        res.render("all_image", {
            src: getdata,
            md: name
        });
        len++;
    } catch (error) {
        console.log(error)
    }

})

app.get("/upload", async (req, res) => {
    try {
        // get name
        const data = await commentBox.find();
        let len = data.length;
        let name = data[len - 1].name;

        // get image
        let getdata = await image1.find();
        // console.log("get methiod upload")
        res.render("upload", {
            src: getdata,
            md: name
        })
        len++;
    } catch (error) {
        console.log(error)
    }
})

app.post("/upload", uploads, async (req, res) => {
    try {
        let doc = new image1({ file: req.file.originalname });
        let data = await doc.save();

        let getdata = await image1.find();

        // console.log("post methid upload", getdata)
        let success = req.file.filename + " your image succesfully submited"
        // console.log(success)
        res.render("upload", {
            title: "upload file ",
            success: success,
            src: getdata
        })
        // console.log(req.file)

    } catch (error) {
        console.log("error")
    }
})

app.get("/users", async (req, res) => {
    try {
        const data = await commentBox.find();

        let len = (data.length)

        console.log("user", req.body)
        let name = data[len - 1].name;
        let email = data[len - 1].email;
        let pass = data[len - 1].password;
        if (name && email && pass) {

            res.render("md", {
                user: {
                    name: name,
                    email: email,
                    password: pass
                }
            });
        }
        len++;
    } catch (error) {
        console.log(error)
    }

    // console.log(userdata)
})

app.get("/login", async (req, res) => {
    try {

        res.render("login");

    } catch (error) {
        console.log(error)
    }

})
// login post
app.post("/login", async (req, res) => {
    try {
        let success = "Your Account Successfully Created!"
        let doc = new commentBox(req.body);
        let data = await doc.save();
        let name = data.name;
        res.render("index", {
            msg: success,
            md: name,
        });



    } catch (error) {
        console.log(error)
    }
})
app.get("/signin", (req, res) => {
    res.render("signin");
})

app.post("/signin", async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;

        // get data from database

        let logindata = await commentBox.findOne({ email: email, password: password });
        if (logindata != null) {
            let success = "Your Signin Successfully!"
            console.log(logindata)
            res.render("index", {
                msg: success
            });
        }
        else {
            let success = "Your Email And Password Are Incorrect!"
            res.render("signin", {
                msg: success
            });
        }
    } catch (error) {
        console.log(error)
    }

})


app.get("/forget", (req, res) => {
    res.render("forget");
})
// post
app.post("/forget", async (req, res) => {
    try {
        let { email } = req.body;//not used here
        // console.log(email)
        let pass = await commentBox.find();
        let len = pass.length;
        let forgetpass = pass[len - 1].password;
        if (forgetpass === email) {

            res.render("forget", {
                pass: forgetpass,
                status: "Verified Successfully!"
            });
        }
        else {
            let status = "Your Email Is Incorrent Fill Correctly!"
            let pass = "Password Not Available"
            res.render("forget", {
                pass: pass,
                status: status
            });
        }
    } catch (error) {
        console.log(error)
    }

})


// delete image from database
app.post("/delete", async (req, res) => {
    try {
        const deleteId = req.body.delete;
        let deleteData = await image1.findByIdAndDelete(deleteId);
        let getdata = await image1.find();
        console.log(deleteData)
        res.status(200).render("index", {
            src: getdata
        });
    } catch (error) {
        console.log(error)
    }



})

// app listen on port
server.listen((port), () => {
    console.log("app is running at ", port)
})