const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
var jwt = require('jsonwebtoken');

const userSchema = require("../Schema/userSchema");
const userModel = mongoose.model("USER", userSchema);

const verifyJWT = require("../Middleware/verifyJWT");
const verifyAdmin = require("../Middleware/verifyAdmin");


/******************
 Mongoose CRUD Operation
*******************/

/******   GET PART  *****/

// Get All User
router.get("/allUser", verifyJWT, verifyAdmin, (req, res) => {
    userModel.find((err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
})

// Get Single User
router.get("/singleUser/:email", (req, res) => {
    const userEmail = req.params.email;
    userModel.findOne({ email: userEmail }, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
})

// Get Single User By Id
router.get("/singleUserById/:id", (req, res) => {
    const userId = req.params.id;
    userModel.findById({ _id: userId }, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
})


/******   POST PART  *****/

// Post Single User
router.post("/createSingleUser", (req, res) => {
    const newUser = new userModel(req.body);
    newUser.save((err, data) => {
        if (err) {
            res.send(err)
        } else {
            res.send({ message: "New user Added" })
        }
    });
})

// Post Many User
router.post("/createManyUser", (req, res) => {
    const users = req.body
    userModel.insertMany(users, (err, docs) => {
        if (err) {
            res.send(err)
        } else {
            res.send(docs)
        }
    });
})


/******  PUT PART  *****/

// Update Single User

/**  upsert default value false. if true, and no documents found, insert a new document  **/
router.put("/updateSingleUser/:email", (req, res) => {
    const userEmail = req.params.email
    const updateUserInfo = req.body;
    userModel.updateOne({ email: userEmail }, { $set: updateUserInfo }, { upsert: false }, (err, docs) => {
        if (err) {
            res.send(err)
        } else {
            res.send(docs)
        }
    });
})

// Update Many User
router.put("/updateManyUser/:email", (req, res) => {
    const userEmail = req.params.email
    userModel.updateMany({ email: userEmail }, { $set: { name: 'Taufik123' } }, (err, docs) => {
        if (err) {
            res.send(err)
        } else {
            res.send(docs)
        }
    });
})

// Update Single User By Id and response which user update
router.put("/updateUserById/:id", (req, res) => {
    const userId = req.params.id;
    const userUpdateInfo = req.body;
    userModel.findByIdAndUpdate({ _id: userId }, { $set: userUpdateInfo }, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
})


/******  DELETE PART  *****/

// Delete Single User
router.delete("/deleteSingleUser/:name", (req, res) => {
    const userName = req.params.name;
    userModel.deleteOne({ name: userName }, (err, data) => {
        if (err) {
            res.send(err)
        } else {
            res.send(data)
        }
    });
})

// Delete Many User
router.delete("/deleteManyUser/:name", (req, res) => {
    const userName = req.params.name;
    userModel.deleteMany({ name: userName }, (err, data) => {
        if (err) {
            res.send(err)
        } else {
            res.send(data)
        }
    });
})

// Delete Single User By Id and response this delete user get
router.delete("/deleteSingleUserById/:id", (req, res) => {
    const id = req.params.id;
    userModel.findByIdAndDelete({ _id: id }, (err, data) => {
        if (err) {
            res.send(err)
        } else {
            res.send(data)
        }
    });
})


/******  Estimates the number of documents in the MongoDB collection PART  *****/

// Small Collection
router.get("/smallUserCollectionCount/:name", (req, res) => {
    const userName = req.params.name;
    userModel.countDocuments({ name: userName }, (err, data) => {
        if (err) {
            res.send(err)
        } else {
            res.send({ totalUser: data })
        }
    })
})

// Large Collection
router.get("/largeUserCollectionCount", (req, res) => {
    userModel.estimatedDocumentCount((err, data) => {
        if (err) {
            res.send(err)
        } else {
            res.send({ totalUser: data })
        }
    })
})


/******  Mongodb Collection Skip & Limit Process  *****/

router.get("/getData", async (req, res) => {
    const totalUser = await userModel.find().skip(2).limit(5);
    res.send(totalUser);
})


/******  Every User JWT Token Create  *****/

router.put("/user/:email", (req, res) => {
    const userEmail = req.params.email;
    const updateUserInfo = req.body;
    userModel.updateOne({ email: userEmail }, { $set: updateUserInfo }, { upsert: true }, (err, docs) => {
        if (err) {
            res.send(err)
        }
    });
    var token = jwt.sign({ email: userEmail }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "12h" })
    res.send({ token });
})

module.exports = router;