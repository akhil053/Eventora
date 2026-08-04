import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js"

// User authentication middleware
const protect = async (req, res, next) => {
    let token =
        req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            if (!req.user) {
                return res.status(401).json({ message: "Not authorized , user not" })
            }

            next();

        } catch (error) {
            return res.status(401).json({ message: "Not authorized , token failed" })
        }
    }

    else {
        return res.status(401).json({ message: "Not authorized , no token" })
    }
}



const admin = async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();

    } else {
        return res.status(401).json({ message: "Not authorized as admin" })
    }
}


export { protect, admin }
