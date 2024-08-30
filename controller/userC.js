const userModel = require('../model/userM')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {sendMail} = require('../helpers/sendMail')
const {signUpTemplate,verifyTemplate,forgotPasswordTemplate} = require('../helpers/HTML')
const fs = require('fs')
require ("dotenv").config()


exports.signUp = async(req,res)=>{
    try {
        const {fullName,Email,Password,PhoneNumber,Location} = req.body
        if(!fullName || !Email || !Location || !Password || !PhoneNumber){
            return res.status(400).json({
                message: `Please enter all details`
            })
        }
        
        const existingUser = await userModel.findOne({Email})
        if (existingUser) {
            return res.status(400).json({
                message: `User with email already exist`
            })
        } 
            const saltedPassword = await bcryptjs.genSalt(12)
            const hashedPassword = await bcryptjs.hash(Password,saltedPassword) 
            
            const user = new userModel({
                fullName,
                Email,
                Location,
                Password:hashedPassword,
                PhoneNumber
            })
            const Token = jwt.sign({
                id:user._id,
                Email:user.Email
                },process.env.JWT_SECRET,
                {expiresIn:"30 minutes"}
            )
            const verifyLink = `https://final-project-eldw.onrender.com/api/v1/user/verify/${Token}`
            await user.save()
            await sendMail({
                subject:`Verification email`,
                email:user.Email,
                html:signUpTemplate(verifyLink,user.fullName)
            })
            res.status(200).json({
                message: `User created successfully`,
                data:user
            })
        
    } catch (err) {
        res.status(500).json(err.message)
    }
}
exports.login = async(req,res)=>{
    try {
        const {Email,Password} = req.body
        if(!Email || !Password){
            return res.status(400).json({
                message:`Please enter all details`
            })
        }
        const checkMail = await userModel.findOne({Email:Email.toLowerCase()})
        if(!checkMail){
            return res.status(400).json({
                message:`User with email not found`
            })
        }
        const confirmPassword = await bcryptjs.compare(Password,checkMail.Password)
        if(!confirmPassword){
            return res.status(400).json({
                message:`Incorrect password`
            })
        }
        req.session.user = checkMail.Email

        if(!checkMail.isVerified){
            return res.status(400).json({
                message:`User not verified,Please check your mail to verify your account`
            })
        }
        const Token = await jwt.sign({
            userId:checkMail._id,
            Email:checkMail.Email,
        },process.env.JWT_SECRET,{expiresIn:'1h'})

        res.status(200).json({
            message:`Login succssfully`,
            data:checkMail,
            Token
        })
    } catch (err) {
        res.status(500).json(err.message)
    }
}
exports.makeAdmin = async(req, res)=> {
    try {
        const {userId} = req.params
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json(`User with ID ${userId} was not found`)
        }
        user.isAdmin = true
        await user.save()
        res.status(200).json({
            message: `Dear ${user.fullName}, you're now an admin`,
            data: user
        })

    } catch (err) {
        res.status(500).json(err.message)
    }
}

exports.verifyEmail = async (req, res) => {
    try {
        // Extract the token from the request params
        const {Token} = req.params;
        // Extract the email from the verified token
        const {Email} = jwt.verify(Token,process.env.JWT_SECRET);
        // Find the user with the email
        const user = await userModel.findOne({Email});
        // Check if the user is still in the database
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        // Check if the user has already been verified
        if (user.isVerified) {
            return res.status(400).json({
                message: 'User already verified'
            })
        }
        // Verify the user
        user.isVerified = true;
        // Save the user data
        await user.save();
        // Send a success response
        res.status(200).json({
            message: 'User verified successfully'
        })

    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            return res.json({message: 'Link expired.'})
        }
        res.status(500).json(err.message)
    }
}

exports.resendVerificationEmail = async (req, res) => {
    try {
        const {Email} = req.body;
        // Find the user with the email
        const user = await userModel.findOne({Email});
        // Check if the user is still in the database
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        // Check if the user has already been verified
        if (user.isVerified) {
            return res.status(400).json({
                message: 'User already verified'
            })
        }

        const Token = jwt.sign({
        Email: user.Email 
       }, process.env.JWT_SECRET, 
       { expiresIn: '20mins' 
       });
        const verifyLink = `https://final-project-eldw.onrender.com/api/v1/user/verify/${Token}`

        let mailOptions = {
            email: user.Email,
            subject: 'Verification email',
            html: verifyTemplate(verifyLink, user.fullName),
        }
        // Send the the email
        await sendMail(mailOptions);
        // Send a success message
        res.status(200).json({
            message: 'Verification email resent successfully'
        })

    } catch (err) {
        res.status(500).json(err.message)
    }
}

exports.ForgetPassword = async(req,res) =>{
    try {
        const {Email} = req.body
        // Find the user with the email
        const user = await userModel.findOne({Email});
        // Check if the user is still in the database
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const ResetToken = jwt.sign({
        Email: user.Email 
        }, process.env.JWT_SECRET,
        { expiresIn: '20mins' 
        });

        const verifyLink = `https://final-project-eldw.onrender.com/api/v1/user/reset-password/${ResetToken}`
        const mailOptions = {
            email: user.Email,
            subject: 'Reset password',
            html:forgotPasswordTemplate(verifyLink,user.fullName)
        }

        await sendMail(mailOptions)

        res.status(200).json({
            message:`Email for reset password sent successfully`
        })
    } catch (err) {
        res.status(500).json(err.message)
    }
}

exports.ResetPassword = async (req,res)=>{
    try {
        //get the token from params
        const {Token} = req.params
        const {Password} = req.body

        //confirm the new password
        const {Email} = jwt.verify(Token,process.env.JWT_SECRET)
        // Find the user with the email
        const user = await userModel.findOne({Email});
        // Check if the user is still in the database
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const saltedeRounds = await bcryptjs.genSalt(12);
        const hashedPassword = await bcryptjs.hash(Password, saltedeRounds);

        user.Password = hashedPassword
        // console.log(hashedPassword)
        
        await user.save()

        res.status(200).json({
            message:`Reset password successfully`
        })
    } catch (err) {
        if(err instanceof jwt.JsonWebTokenError){
            return res.status(400).json('Link has expired,Please request for a new link')
        }
        res.status(500).json(err.message)
    }
}

exports.changePassword = async(req,res)=>{
    try {
       const Token = req.params
       const {Password,OldPassword} = req.body
       const {Email} = jwt.verify(Token,process.env.JWT_SECRET) 
       //check for user
       const user = await userModel.findOne({Email})
       if(!user){
        return res.status(400).json('User not found')
    }
       const verifyPassword = await bcryptjs.compare(OldPassword,user.Password)
       if(!verifyPassword){
        return res.status(400).json('Password does not correspond with the previous password')
    }
       const saltedeRounds = await bcryptjs.genSalt(12)
       const hashedPassword = await bcryptjs.hash(Password,saltedeRounds)
       user.Password = hashedPassword

       await user.save()
       res.status(200).json('Password changed successfully')

    } catch (err) {
       res.status(500).json(err.message) 
    }
}

exports.updateUser = async(req,res)=>{
    try {
        const id = req.params.id
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message:`Id format is invalid`
            })
        }
        const{FullName} = req.body
        const data = {FullName}
        const update = await userModel.findByIdAndUpdate(id,data,{new:true})
        if(!update){
            return res.status(400).json({
                message:`User with id does not exist`
            })
        }
         res.status(200).json({ 
            message:`Full name updated successfully`
         })
    } catch (err) {
        res.status(500).json(err.message)
    }
}

exports.getAll = async(req,res)=>{
    try {
        const all = await userModel.find()
        res.status(200).json({
            message:`kindly find below all ${all.length}`,
            data:all})
    } catch (err) {
        res.status(500).json(err.message)
    }
}

exports.oneUser = async (req,res)=>{
    try {
        const userId = req.params.id
        const user = await userModel.findById({userId})
        if(!user){
            return res.status(400).json({
                message:`User not found`
            })
        }
        res.status(200).json({
            message:`Dear ${user.firstName},kindly find your information below`,
            data:user
        })
    } catch (err) {
        res.status(500).json(err.message)
    }
}
exports.logOut = async (req, res) => {
    try {
        const auth = req.headers.authorization;
        const token = auth.split(' ')[1];
        
        if(!token){
            return res.status(401).json({
                message: 'invalid token'
            })
        }
        // Verify the user's token and extract the user's email from the token
        const { email } = jwt.verify(token, process.env.jwt_secret);
        // Find the user by ID
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        user.blackList.push(token);
        // Save the changes to the database
        await user.save();
        //   Send a success response
        res.status(200).json({
            message: "User logged out successfully."
        });
    } catch (error) {
        res.status(500).json(err.message);
    }
}

exports.deleteUser = async (req,res)=>{
    try {
        const {userId} = req.params
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({
                message: `User not found`
            })
        }

        const deletedUser = await userModel.findByIdAndDelete(userId)
      res.status(200).json({
        message: `User deleted successfully`
      })

    } catch (err) {
        res.status(500).json(err.message)
    }
}
