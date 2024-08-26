const express = require('express')
const upload = require('../utils/multer')
const { signUp, login, verifyEmail, resendVerificationEmail, ForgetPassword, changePassword, ResetPassword, makeAdmin, updateUser, deleteUser, oneUser, getAll, logOut, HomePage, signWithGoogle, callback, createInfoWithReturnedInfo } = require('../controller/userC')
// const { authenticate, isAdmin } = require('../middleware/auth copy')  
const { signUpValidator, logInValidator } = require('../middleware/validator')

const router = express.Router()

router.post('/sign-up',signUpValidator,upload.single('profilePicture'),signUp)
router.post('/sign-in',logInValidator,login)
router.get('/verify/:token',verifyEmail)
router.post('/resend-verification',resendVerificationEmail)
router.post('/forgot-password',ForgetPassword)
router.post('/change-password/:token',changePassword)
router.post('/reset-password/:token',ResetPassword)
router.put('/make-admin/:userId',makeAdmin)
router.put('/update/:userId',updateUser)
router.get('/getone/:userId',oneUser)
router.get('/getall',getAll)
router.post('/log-out',logOut)
router.get('/homepage',HomePage) 
router.get('/signupwithgoogle',signWithGoogle);
router.get('/google/cb',callback)
router.get('/success/signup',createInfoWithReturnedInfo)
router.delete('/delete/:userId',deleteUser)

module.exports = router 