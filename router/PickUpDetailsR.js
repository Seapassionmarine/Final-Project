const express = require('express')
const { createWaste, deleteWaste, getAllWaste, getOne, updateWaste } = require('../controller/pickUpDetailsC')
const { authenticate, isAdmin } = require('../middleware/auth copy')  

const router = express.Router()

router.post('/create-waste/:id',createWaste)
router.post('/update-waste',updateWaste)
router.get('/get-all',authenticate,getAllWaste)
router.get('/get-one',getOne)
router.delete('/delete-waste',isAdmin,deleteWaste)

module.exports = router