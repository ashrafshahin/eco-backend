const User = require('../models/userModel');
const { sendVerificationEmail, resetPasswordEmail } = require('../utils/mailer');
const bcrypt = require('bcrypt')
const { emptyFieldValidation } = require('../utils/validation');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');


const registrationController = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already registerred...'
            })
        };

        emptyFieldValidation(res, name, email, password, confirmPassword);

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
        
        const token = generateToken(
            { id: createProfile._id, email: createProfile.email },
            process.env.ACCESS_TOKEN_SECRET,
            "1d",
        );

        sendVerificationEmail(token, email);

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
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'please register...' })
        };

        emptyFieldValidation(res, email, password);

        // const token = generateToken(existingUser);

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
                // token,
                success: true,
                message: 'Login Successfully done...',
                data: {
                    _id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    role: existingUser.role,
                    isVerified: existingUser.isVerified,
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

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async function (err, decoded) {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized...",
        });
      }
        try {
            const userId = decoded.id;
            const findUser = await User.findOne({_id: userId})
            
            if (!findUser) {
                return res.status(404).json({success: false, message: "User not found..."});
            };

            if (findUser.isVerified) {
                return res.status(200).json({
                success: true,
                message: "User already verified...",
          });
        }

            findUser.isVerified = true;

            await findUser.save();

            return res.status(200).json({
                success: true,
                message: "Email verified successfully...",
        });
            

        
    } catch (error) {
        console.error("Email verification error:", error);

            return res.status(500).json({
                success: false,
                message: "Email verification server error...",
            });

        }
    }
  );
};


module.exports = { registrationController, loginController, forgotPasswordController, resetPasswordController, resendVerificationEmailController, verifyEmailController }