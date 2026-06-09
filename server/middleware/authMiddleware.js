import User from "../modules/User.js";

import Jwt from "jsonwebtoken";

const verifyUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = Jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ success: false, message: "Token is not valid" });
        }

        if (!decoded || !decoded.id) {
            return res.status(401).json({ success: false, message: "Token is not valid" });
        }

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (e) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
};

export default verifyUser;