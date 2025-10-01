import jwt from "jsonwebtoken";
const token = jwt.sign({ service: "emailListener" }, process.env.JWT_SECRET);
console.log(token);
