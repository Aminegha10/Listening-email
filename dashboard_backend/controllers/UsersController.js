import UserModel from "../models/UserModel.js";
import logger from "../utils/Logger.js";

const GetAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find(
      {},
      "name mustChangePassword role email"
    );
    logger.info("Fetched users successfully");
    res.status(200).json(users);
  } catch (err) {
    logger.error(`Failed to fetch users: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
export { GetAllUsers };
