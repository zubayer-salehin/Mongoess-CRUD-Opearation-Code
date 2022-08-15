const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const userSchema = require("../Schema/userSchema");
const User = mongoose.model("USER", userSchema)


router.get("/users", (req, res) => {
    User.find({ status: "active" }, (err, data) => {
        if (err) {
            res.status(500).json({ error: "Server did not response" })
        } else {
            res.status(200).json({ message: "All User loaded", result: data })
        }
    })
})


router.get("/user/:id", (req, res) => {
    User.find({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.status(500).json({ error: "Server did not response" })
        } else {
            res.status(200).json({ message: "User loaded", result: data })
        }
    })
})


router.post("/createUser", async (req, res) => {

    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(444).json({ error: "Please fill the form" })
    }

    const exists = await User.findOne({ email });

    if (exists) {
        return res.status(450).json({ error: "Email Already Exists" })
    }

    const newUser = new User(req.body);
    await newUser.save((err) => {
        if (err) {
            res.status(500).json({ error: "Server did not response" })
        } else {
            res.status(200).json({ message: "New user Added" })
        }
    });

})


router.post("/createManyUser", (req, res) => {

    User.insertMany(req.body, (err) => {
        if (err) {
            res.status(500).json({ error: "Server did not response" })
        } else {
            res.status(200).json({ message: "New users Added" })
        }
    })

})


router.put("/user/:id", (req, res) => {

    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, doc) => {
        if (err) {
            res.status(500).json({ error: "Server did not response" })
        } else {
            res.status(200).json(doc)
        }
    })

})


router.delete("/user", (req, res) => {
    User.deleteMany(req.body , (err) => {
        if (err) {
            res.status(500).json({ error: "Server did not response" })
        } else {
            res.status(200).json({ message: "User was deleted"})
        }
    })
})


module.exports = router;