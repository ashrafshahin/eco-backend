const User = require('../models/userModel')

const getAllUsersController = async (req, res) => {
    const { id } = req.params;
    try {
        const userData = await User.find(id)
        if (userData) {
            res.status(200).json({ success: true, message: "All User data displayed...", users: userData })
        } else {
            res.status(404).json({ success: false, message: "User data not found..." })
        }

    } catch (error) {
        console.log('gell all data error:...', error)
        return res.status(500).json({ success: false, message: 'Server error...' });
    }
};

const singleUserDataController = async (req, res) => {
    const { id } = req.params;
    try {
        const userData = await User.findById(id)

        if (userData) {
            res.status(200).json({ success: true, message: `user: ${userData.email} data`, Data: userData })
        } else {
            res.status(404).json({ success: false, message: "User data not found..." })
        }

    } catch (error) {
        console.log('gell Single User data error:...', error)
        return res.status(500).json({ success: false, message: 'Server error...' });
    }
}

const deleteDataController = async (req, res) => {
    try {
        const { id } = req.params
        const userData = await User.findByIdAndDelete(id)
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User data not found...' })
        } else {
            return res.status(200).json({ success: true, message: 'User data deleted...' })
        }

    } catch (error) {
        console.log('Delete data error:...', error)
        return res.status(500).json({ success: false, message: 'Server error...' });
    }

};

const updateUserDataController = async (req, res) => {
    try {
        const { id } = req.params;
        const userData = await User.findByIdAndUpdate(id, req.body, { returnDocument: 'after' })

        if (!userData) {
            return res.status(404).json({ success: false, message: 'User data not found...' })
        } else {
            return res.status(200).json({ success: true, message: 'User data Updated...' })
        }

    } catch (error) {
        console.log('Update data error:...', error)
        return res.status(500).json({ success: false, message: 'Server error...' });
    }
}

module.exports = { getAllUsersController, singleUserDataController, deleteDataController, updateUserDataController }