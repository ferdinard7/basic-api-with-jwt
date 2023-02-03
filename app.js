const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");


const app = express();

app.use(bodyParser.urlencoded({extended: true}));


app.get("/api", (req, res) => {
    res.send("Welcome to the Api");
})

// PROTECTED ROUTE

app.post("/api/secret", verifyToken, (req, res) => {
    jwt.verify(req.token, "secretkey", (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            // res.send("Your have discovered my secret!");
            res.json({
                message: "You have discovered my secret!",
                authData
            })
        }
    })
   
})

app.post("/api/login", (req, res) => {
    // You can create a mock user or uncomment mine below
    // const user = {
    //     id: 1,
    //     name: chucks,
    //     email: chucks@bmail.com
    // }

    const user = {
        name: req.body.name,
        email: req.body.email 
    }

    jwt.sign({user}, "secretkey", { expiresIn: "30s"}, (err, token) => {
        res.send(token)
    })
})

// FORMAT TOKEN
// Authorization: bearer <access_token>

// VERIFY TOKEN
function verifyToken(req, res, next) {
    //  Get the auth header value
    const bearerHeader = req.headers["authorization"];
    // check if bearer is undefined
    if(typeof bearerHeader !== "undefined") {
        // split at the space
        const bearer = bearerHeader.split(" ");
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403)
    }

}






app.listen(3000, () => {
    console.log("port started on port 3000");
})