const User = require('../models/userModel');
const { sendVerificationEmail } = require('../utils/mailer');

const registrationController = async (req, res) => {
    const { email, password, confirmPassword, terms } = req.body;
    
    try {
        //mailer email pai na tai dese...
        const email = req.body.email;

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ success: true, message: 'Already registerred...' })
        };
        if (!terms) {
            return res.status(400).json({ success: false, message: 'Please accept our Terms and Conditions...' })
        };
        if (!email || !password || !confirmPassword) {
            return res.status(404).json({ success: false, message: 'Please fill all the fields...' })
        }

        await sendVerificationEmail(email);

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'password not matched...' })
        }
        const createProfile = await new User({
            email: email,
            password: password,
            terms: terms,
        }).save()
       return res.status(201).json({ success: true, message: 'Registration successful...' })
    } catch (error) {
        console.log(error);
        
       return res.status(500).json({ success: false, message: 'Server error...' })
    }
};

module.exports = {registrationController,}