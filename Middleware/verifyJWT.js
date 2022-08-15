var jwt = require('jsonwebtoken');


// Verify JWT Token Start
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ Unauthorized: "access" })
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (error) {
            console.log(error);
            return;
        }
        req.decoded = decoded;
        next();
    })
}
// Verify JWT Token End

module.exports = verifyJWT;