const express = require('express')
const { createWaste, deleteWaste, getAllWaste, getOne, updateWaste } = require('../controller/pickUpDetailsC')
const { authenticate, isAdmin } = require('../middleware/auth copy')  
const { PickUpDetailsValidator } = require('../middleware/validator')

const router = express.Router()

router.post('/create-waste/:id',PickUpDetailsValidator,createWaste)
router.post('/update-waste',authenticate,updateWaste)
router.get('/get-all',authenticate,isAdmin,getAllWaste)
router.get('/get-one',authenticate,getOne)
router.delete('/delete-waste',isAdmin,deleteWaste)

module.exports = router