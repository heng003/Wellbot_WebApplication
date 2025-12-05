const express = require('express');
const router = express.Router();

const gratitudeController = require("../controllers/gratitudeController");

router.get("/:userId", gratitudeController.getGratitudesByUser);
router.patch("/:id/fav", gratitudeController.updateGratitudeFav);
router.patch("/update/:gratitudeId", gratitudeController.updateGratitude);
router.post("/create", gratitudeController.createGratitude);
router.delete('/delete/:gratitudeId', gratitudeController.deleteGratitude);

module.exports = router;