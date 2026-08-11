const User = require('../models/userModel');
const { sendVerificationEmail, resetPasswordEmail } = require('../utils/mailer');
const bcrypt = require('bcrypt')
const { emptyFieldValidation } = require('../utils/validation');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken')

const registrationController = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    try {
        //mailer email pai na tai dese...
        const email = req.body.email;
        
        // emptyFieldValidation(res, email, password, confirmPassword, terms);
        emptyFieldValidation(res, name, email, password, confirmPassword);

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Already registerred...' })
        };

        // if (!terms) {
        //     return res.status(400).json({ success: false, message: 'Please accept our Terms and Conditions...' })
        // };

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'password not matched...' })
        };

        // hash password...
        const hashPassword = bcrypt.hashSync(password, 10);

        const createProfile = await new User({
            email: email,
            password: hashPassword,
            // terms: terms,
            name: name,
        }).save()

        // Email varification ...//
        await sendVerificationEmail(email);

        const token = generateToken(createProfile);

        return res.status(201).json({
            token,
            success: true,
            message: 'Registration successful...',
            user: {
                id: createProfile._id,
                email: createProfile.email
            }
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, message: 'Server error on register...' })
    }
};

const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {

        emptyFieldValidation(res, email, password);

        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'please register...' })
        };

        const token = generateToken(existingUser);

        // compare hash vs plain password...
        const passMatch = bcrypt.compareSync(
            password,                   // user deya plain password...
            existingUser.password       // hashed password from DB...
        );
        // Credential thik thakle login hobe...
        if (!passMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Credential...'
            });
            // delete existingUser[password]
        } else {
            return res.status(200).json({
                token,
                success: true,
                message: 'Login Successfully done...',
                data: {
                    userId: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    role: existingUser.role,
                    isVarified: existingUser.isVarified,
                    ishold: existingUser.isHold,

                },
            });
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server error...' })
    }

};

const forgotPasswordController = async (req, res) => {
    const { email } = req.body;
    try {
        emptyFieldValidation(res, email);

        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User not found...' })
        };

        // aber forgot email jabe...//
        await resetPasswordEmail(email);

        const token = generateToken(existingUser);

        res.status(200).json({ token, success: true, message: "Please check your email..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Server error...' })
    }
};

const resetPasswordController = (req, res) => {
    const { newPassword, confirmPassword } = req.body
    const { token } = req.params;

    try {
        if (newPassword !== confirmPassword) {
            res.send({ message: "Confirm password not matched..." })
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                res.send({ message: 'Unauthorised token...' })
            } else {
                const hashPassword = bcrypt.hashSync(newPassword, 10);
                const updatePassword = await User.findByIdAndUpdate(
                    { _id: decoded.id },
                    { password: hashPassword },
                    { returnDocument: 'after' })
                res.send({ message: "Password updated..." })
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Server error...' })
    }
};

const resendVerificationEmailController = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User not found...' })
        };
        const token = generateToken(existingUser);
        await resetPasswordEmail(email);
        res.status(200).json({ token, success: true, message: "Check your email to reset password..." })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Server error...' })
    }
}

const verifyEmailController = async (req, res) => {
    const { token } = req.params;
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                res.send({ message: 'Unauthorised token...' })
            } else {
                const userId = decoded.id
                const findUser = await User.findOne({ userId });
                if (findUser.isVarified) {
                    return res.send({ message: 'User already verified...' })
                } else {
                    findUser.isVarified = true;
                    findUser.save()
                    return res.status(200).json({ success: true, message: "Email varification successful..." });

                }
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Server error...' })
    }
};

module.exports = { registrationController, loginController, forgotPasswordController, resetPasswordController, resendVerificationEmailController, verifyEmailController }