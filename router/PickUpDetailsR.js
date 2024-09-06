const express = require('express')
const { createWaste, deleteWaste, getAllWaste, getOne, updateWaste } = require('../controller/pickUpDetailsC')

const router = express.Router()

router.post('/create-waste/:id',createWaste)
router.post('/update-waste',updateWaste)
router.get('/get-all',getAllWaste)
router.get('/get-one',getOne)
router.delete('/delete-waste',deleteWaste)

module.exports = router