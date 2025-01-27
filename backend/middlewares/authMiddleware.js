import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
    
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ error: "Autorisierungsheader fehlt" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token fehlt" });
  

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = user;
        next();
    } catch (err) {
        res.status(403).json({ error: "Bitte log dich ein." });
    }
}

export default authMiddleware;