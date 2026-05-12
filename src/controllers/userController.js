const User = require('../models/userModel')

const getAllUsers = async (req, res) => {
    const { id } = req.params;
    try {
        const userData = await User.find(id)
        if (userData) {
            res.status(200).json({ success: true, message: "All User data displayed...", users: userData })
        } else {
            res.status(400).json({success:false, message:"User data not found..."})
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Server error...' });
    }
};

const singleUserData = async (req, res) => {
    const { id } = req.params;
    try {
        const userData = await User.findById(id)
        if (userData) {
            res.status(200).json({ success: true, message: `user: ${userData.email} data`, Data: userData })
        } else {
            res.status(400).json({ success: false, message: "User data not found..." })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Server error...' });
    }
}

module.exports = {getAllUsers, singleUserData,  }