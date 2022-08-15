const mongoose = require('mongoose');
const userSchema = require("../Schema/userSchema");
const userModel = mongoose.model("USER", userSchema);


// Verify Admin Start
const verifyAdmin = (req, res, next) => {
    const requester = req.decoded.email;
    userModel.findOne({ email: requester }, (err, data) => {
        if (err) {
            res.status(401).send({ message: "UnAutharized" });
        } else {
            if (data.role === 'Admin') {
                next();
            } else {
                return res.status(403).send({ message: "You are not a Admin" });
            }
        }
    });

}
// Verify Admin End

module.exports = verifyAdmin;