const jwt = require("jsonwebtoken")

const generateAccessToken = (user) =>{
    return jwt.sign(
        {id : user.id, role : user.role},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : process.env.ACCESS_TOKEN_EXPIRY || "10m"}
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {id : user.id},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d"}
    );
};


module.exports = {generateAccessToken,generateRefreshToken};