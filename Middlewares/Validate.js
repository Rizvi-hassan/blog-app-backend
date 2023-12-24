require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SIGN = process.env.JWT_SIGN;
// const JWT_SIGN = "hELLO mY nAME IS rIZVI hASSAN aSNARI AND i AM LEARNING WEB dev";

const Validate = (req, res, next)=>{
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).json({ attempt: "fail", errors: { msg: "Unauthenticated user." } });
    }
    try {
        const verify = jwt.verify(token, JWT_SIGN);
        req.user = verify.user;
        next();
        
    } catch (error) {
        console.error(error);
        return res.status(401).json({ attempt: "fail", errors: { msg: "Invalid user." } });
        
    }
}

module.exports = Validate;