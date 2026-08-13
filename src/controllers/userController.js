const { default: mongoose } = require('mongoose');
const User = require('../models/userModel')

const getAllUsersController = async (req, res) => {
    try {
        const userData = await User.find({}).select("-password")
        
        return res.status(200).json({
            success: true,
            message: "All User data displayed...",
            users: userData
        })
        
    } catch (error) {
        console.log('Get all users error:...', error)
        return res.status(500).json({ success: false, message: 'Server error...' });
    }
};

const singleUserDataController = async (req, res) => {
    try {
        const { id } = req.params;

        // id valid kina check korse...
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID..."
            })
        };

        // no need to send password  to FRONEND with user data... tai SELECT
        const userData = await User.findById(id).select("-password")
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found..."
            })
        } else {
            return res.status(200).json({
                success: true,
                message: `user: ${userData.email} - Information below...`,
                userData: userData
            })
        }

    } catch (error) {
        console.log('get Single User data error:...', error)
        return res.status(500).json({ success: false, message: 'Server error in get single data...' });
    }
};

const deleteDataController = async (req, res) => {
    try {
        const { id } = req.params
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID"
            })
        };

        const userData = await User.findByIdAndDelete(id)
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found...' })
        } else {
            return res.status(200).json({ success: true, message: 'User deleted...' })
        }

    } catch (error) {
        console.log('Delete error:...', error)
        return res.status(500).json({ success: false, message: 'Server error...' });
    }

};

const updateUserDataController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID"
            })
        };
        const userData = await User.findByIdAndUpdate(id, req.body, { returnDocument: 'after' })

        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found...' })
        } else {
            return res.status(200).json({ success: true, message: 'User Updated...' })
        }

    } catch (error) {
        console.log('Update error:...', error)
        return res.status(500).json({ success: false, message: 'Server error...' });
    }
}

module.exports = { getAllUsersController, singleUserDataController, deleteDataController, updateUserDataController }