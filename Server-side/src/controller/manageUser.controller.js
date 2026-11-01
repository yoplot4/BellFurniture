import { getAllUserModel } from '../model/manageUser.model.js';

const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUserModel();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getAllUsersController };