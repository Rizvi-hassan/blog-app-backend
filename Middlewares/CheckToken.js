require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SIGN = process.env.JWT_SIGN;
// const JWT_SIGN = "hELLO mY nAME IS rIZVI hASSAN aSNARI AND i AM LEARNING WEB dev";

const CheckToken = (token) => {
    try {
        const verify = jwt.verify(token, JWT_SIGN);
        return verify.user;
    } catch (error) {
        console.log(error);
        // return null;
    }
}



module.exports = CheckToken;