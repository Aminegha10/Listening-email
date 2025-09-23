import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  //   console.log(authHeader);
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send(err);
    req.user = decoded;
    console.log(decoded);
    next();
  });
};
