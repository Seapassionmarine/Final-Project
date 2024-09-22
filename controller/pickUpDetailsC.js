const { pickUpWasteTemplate,pickUpWastePendingTemplate,pickUpWasteDeclinedTemplate } = require("../helpers/HTML");
const userModel = require("../model/userM");
const wasteModel = require("../model/PickUpDetailsM");
const { sendMail } = require("../helpers/sendMail");
require("dotenv").config();

exports.createWaste = async (req, res) => {
  try {
    const id = req.user.userId;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const createWaste = new wasteModel(req.body);
    createWaste.Name = user.Name;
    createWaste.Email = user.Email;
    await createWaste.save();

    if (createWaste.WasteKG < 10) {
      return res.status(400).json({
        message: "Waste must be at least 10 kg",
      });
    }

    createWaste.userId.push(id);
    user.wasteDetail = createWaste;
    await user.save();

    await sendMail({
      subject: "Waste Recycling Pending Email",
      email: createWaste.Email,
      html: pickUpWastePendingTemplate(createWaste),
    });

    return res.status(201).json({
      message: "Waste re created successfully",
      data: createWaste,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllWaste = async (req, res) => {
  try {
    const getAllWaste = await wasteModel.find();
    if (getAllWaste.length === 0) {
     return res.status(200).json({
        message: "Database currently empty"
      });
    }
    res.status(200).json({
      message: "list of all to do in the database",
      data: getAllWaste,
    });
  } catch (error) {
   return res.status(500).json({
      message: "internal server error" + error.message,
    });
  }
};

exports.getUserWasteRecords = async (req, res) => {
  try {
    const id = req.user.userId;
    const wasteRecords = await wasteModel.find({ userId: id });

   return res.status(200).json({
      message: "Retrieved waste records successfully",
      data: wasteRecords,
    });
  } catch (error) {
   return res.status(500).json({
      message: error.message,
    });
  }
};

//DELETE
exports.deleteWaste = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteWaste = await wasteModel.findByIdAndDelete(id);
    if (!deleteWaste) {
    return  res.status(404).json({
        message: `Waste  with ID: ${id} not found`,
        data: deleteWaste,
      });
    }
   return res.status(200).json({
      message: `waste with the ID ${id} deleted successfully`,
      data: deleteWaste
    });
  } catch (error) {
   return res.status(500).json({
      message: error.message,
    });
  }
};

//UPDATE
exports.updateWaste = async (req, res) => {
  try {
    const Id = req.params.id;
    const updateWaste = await wasteModel.findByIdAndUpdate(Id, req.body, {
      new: true,
    });
    if (!updateWaste) {
     return res.status(404).json({
        message: `updateWaste with ID: ${Id} update successfully`,
        data: updateWaste,
      });
    } else {
      return res.status(200).json({
        message: `list found`,
        data: updateWaste,
      });
    }
  } catch (error) {
   return res.status(500).json({
      message: error.message,
    });
  }
};

exports.wasteHistory = async (req, res) => {
  try {
    const { userId } = req.user;
    const wasteHistory = await wasteModel
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("userId");

    //count the number of pending request
    const pendingRequest = wasteHistory.filter(
      (waste) => waste.status === "pending"
    ).length;
    console.log("Pending Request: " + pendingRequest);

    // Sum all the wasteKG that are either approved or pending
    const totalWasteKg = wasteHistory
      .filter((waste) => waste.status !== "declined")
      .reduce((acc, waste) => acc + (waste.WasteKG || 0), 0);

    //Waste yet to be picked and not declined  
    const unpickedWasteKg = wasteHistory
      .filter((waste) => waste.status === "pending")
      .reduce((acc, waste) => acc + (waste.WasteKG || 0), 0);

    return res.status(200).json({
      message: "User waste history",
      data: {
        pendingRequest: pendingRequest,
        totalWasteKg: totalWasteKg,
        unpickedWasteKg: unpickedWasteKg
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error" + error.message,
    });
  }
};

exports.pickWaste = async (req, res) => {
  try {
    const { wasteId } = req.params;
    const wasteRequest = await wasteModel.findById(wasteId);
    if (!wasteRequest) {
      return res.status(404).json({
        message: `Waste request with id: ${wasteId} does not exist`,
      });
    }

    if (wasteRequest.status == "approved") {
      return res.status(403).json({
        message: `Waste request with id: ${wasteId} is already approved`,
      });
    }

    wasteRequest.status = "approved";
    await wasteRequest.save();
    await sendMail({
      subject: "Waste Recycling Confirmation Email",
      email: wasteRequest.Email,
      html: pickUpWasteTemplate(wasteRequest),
    });
    return res.status(200).json({
      message: "Waste pick-up approved successfully",
      data: wasteRequest,
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error" + error.message,
    });
  }
};
exports.declinedWaste = async (req, res) => {
  try {
    const { wasteId } = req.params;
    const wasteRequest = await wasteModel.findById(wasteId);
    if (!wasteRequest) {
      return res.status(404).json({
        message: `Waste request with id: ${wasteId} does not exist`,
      });
    }

    if (wasteRequest.status == "Declined") {
      return res.status(403).json({
        message: `Waste request with id: ${wasteId} is already declined`,
      });
    }

    wasteRequest.status = "declined";
    await wasteRequest.save();
    await sendMail({
      subject: "Waste Recycling Declined Email",
      email: wasteRequest.Email,
      html: pickUpWasteDeclinedTemplate(wasteRequest),
    });
    return res.status(200).json({
      message: "Waste pick-up declined successfully",
      data: wasteRequest,
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error" + error.message,
    });
  }
};