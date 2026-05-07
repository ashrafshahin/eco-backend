const User = require('../models/userModel');
const { sendVerificationEmail } = require('../utils/mailer');
const bcrypt = require('bcrypt')

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
        // hash password...
        const hashPassword = bcrypt.hashSync(password, 10);

        const createProfile = await new User({
            email: email,
            password: hashPassword,
            terms: terms,
        }).save()
       return res.status(201).json({ success: true, message: 'Registration successful...' })
    } catch (error) {
        console.log(error);
        
       return res.status(500).json({ success: false, message: 'Server error...' })
    }
};

const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'please register...' })
        };

        if (!email || !password) {
            return res.status(404).json({ success: false, message: 'Please fill all the fields...' })
        };
        // compare hash vs plain password...
        const passMatch = bcrypt.compareSync(
            password,                   // user deya plain password...
            existingUser.password       // hashed password from DB...
        );
        // Credential thik thakle login hobe...
        if (!passMatch) {
            return res.status(400).json({ success: false, message: 'Invalid Credential...' });
        } else {
            return res.status(200).json({ success: true, message: 'Login Successfully done...' });
        }


    } catch (error) {
        console.log(error);
        
        return res.status(500).json({ success: false, message: 'Server error...' })  
    }

}

module.exports = {registrationController, loginController, }