const express = require('express')
const { signUp, login, verifyEmail, resendVerificationEmail, ForgetPassword, changePassword, ResetPassword, makeAdmin, updateUser, deleteUser, oneUser, getAll, logOut } = require('../controller/userC')
const { authenticate, isAdmin } = require('../middleware/auth copy')  
const { signUpValidator, logInValidator } = require('../middleware/validator')

const router = express.Router()

router.post('/sign-up',signUpValidator,signUp)
router.post('/sign-in',logInValidator,login)
router.get('/verify/:token',verifyEmail)
router.post('/resend-verification',resendVerificationEmail)
router.post('/forgot-password',ForgetPassword)
router.post('/change-password/:token',changePassword)
router.post('/reset-password/:token',ResetPassword)
router.put('/make-admin/:id',isAdmin,makeAdmin)
router.put('/update/:id',authenticate,updateUser)
router.get('/getone/:id',authenticate,oneUser)
router.get('/getall',authenticate,isAdmin,getAll)
router.post('/log-out', authenticate,logOut)
router.delete('/delete/:id',authenticate,isAdmin,deleteUser)

module.exports = router 