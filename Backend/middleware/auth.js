import jwt from "jsonwebtoken";

export const applyMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({ message: "Token not found" });
    }
    try {
        const tokenWithoutBearer = token.split(" ")[1];
        const decode = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET_KEY);
        req.user = decode.userID;
        next();
    } catch (err) {
        console.log(err, "Something went wrong");
        return res.status(400).json({ message: "Token is not valid" });
    }
};