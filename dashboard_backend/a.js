import jwt from "jsonwebtoken";
const token = jwt.sign(
  { service: "emailListener" },
  "545189cf9e5098ecc9e2130127610cf16f272ee1c3c3ffedebb99b49b4547b9813e6d82a0778027c7a76be468c14edb8b9540992fc50471919cd55337e97aee6"
);
console.log(token);
