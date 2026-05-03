const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            message: "Authorization token is missing"
        });
    }

    const token = authHeader.split(" ")[1];
    console.log(token);

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = {id: decoded.id, email: decoded.email};
        next();
    }
    catch(error){
        console.log("JWT ERROR:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }

    console.log(authHeader);
    console.log(req);

}

module.exports = { authMiddleware };