import UserModel from "../models/UserModel.js";
import logger from "../utils/Logger.js";

const GetAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find(
      {},
      "name mustChangePassword role email createdAt"
    );

    const formattedUsers = users.map((user) => {
      const date = new Date(user.createdAt);

      // Format day, month, year
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleString("en-US", { month: "short" }); // e.g. "Sep"
      const year = date.getFullYear();

      // Format hours and minutes
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      const finalDate = `${day}, ${month}, ${year} ${hours}:${minutes}`;

      return {
        ...user.toObject(),
        createdAt: finalDate,
      };
    });

    logger.info("Fetched users successfully");
    res.status(200).json(formattedUsers);
  } catch (err) {
    logger.error(`Failed to fetch users: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
export { GetAllUsers };
