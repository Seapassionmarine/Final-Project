const express = require('express')
const { createWaste, deleteWaste, getAllWaste, updateWaste, getUserWasteRecords, wasteHistory, pickWaste, declinedWaste } = require('../controller/pickUpDetailsC')
const { authenticate, isAdmin } = require('../middleware/auth copy')  
const { PickUpDetailsValidator } = require('../middleware/validator')

const router = express.Router()

router.post("/create-waste", authenticate, PickUpDetailsValidator, createWaste);
router.post("/update-waste", authenticate, updateWaste);
router.get("/waste-records", authenticate, getUserWasteRecords);
router.get("/get-all", authenticate, isAdmin, getAllWaste);
router.delete("/delete-waste/:id", authenticate, isAdmin, deleteWaste);
router.get("/wasteHistory", authenticate, wasteHistory);
router.get('/pick-waste/:wasteId', authenticate, isAdmin, pickWaste);
router.get('/decline-waste/:wasteId', authenticate, isAdmin, declinedWaste);

module.exports = router