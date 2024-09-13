const {pickUpWasteTemplate} = require('../helpers/HTML')
const {sendMail} = require('../helpers/sendMail')
const userModel = require("../model/userM")
const wasteModel = require('../model/PickUpDetailsM')

exports.createWaste = async (req, res) => {
  try {
    const id = req.params.id;  // Destructure 'id' from req.params

    // Check if user ID is provided
    if (!id) {
      return res.status(400).json({
        message: 'User is required',
      });
    }

    // Find user by ID
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Create new waste entry from request body
    const createWaste = new wasteModel(req.body);

    // Validate that waste entry exists and has the required field 'WasteKG'
    if (!createWaste || createWaste.WasteKG === undefined) {
      return res.status(400).json({
        message: 'Missing required fields',
      });
    }

    // Assign user's email to the waste entry
    createWaste.Email = user.Email;

    // Ensure that the waste weight is at least 10 kg
    if (createWaste.WasteKG < 10) {
      return res.status(400).json({
        message: 'Waste must be at least 10 kg',
      });
    }

    // Associate the waste entry with the user
    createWaste.user.push(id);
    await createWaste.save();

    // Update user with waste details and save
    user.wasteDetail = createWaste._id;
    await user.save();

    // Send confirmation email
    await sendMail({
      subject: 'Waste Recycling Confirmation Email',
      email: createWaste.Email,
      html: pickUpWasteTemplate(user.Name),
    });

    // Respond with success message and created waste entry
    res.status(201).json({
      message: 'Waste entry created successfully',
      data: createWaste,
    });
  } catch (err) {
    // Handle server errors
    res.status(500).json({
      message: err.message,
    });
  }
};


exports.getAllWaste= async(req, res)=>{
  try {
    const getAllWaste = await userModel.find();
    if (getAllWaste.length=== 0) {
      res.status(200).json({
        message:"list of all waste detail.",
        data: getAllWaste
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "internal server error" + error.message
    });
  }
}

exports.getOne = async (req, res) => {
  try {
      const contents = await userModel.find().populate("user").exec();

      res.status(200).json({
          message: "Contents retrieved successfully",
          totalNumberOfContents: contents.length,
          data: contents
      });

  } catch (error) {
      res.status(500).json({
          message: error.message 
      });
  }
}

//UPDATE
exports.updateWaste= async(req, res)=>{
  try {
    const  Id = req.params.id
    const updateWaste = await userModel.findByIdAndUpdate(Id,req.body,{new: true});
    if (!updateWaste) {
      res.status(404).json({
        message: `updateWaste with ID: ${Id} update successfully`,
        data: updateWaste
      })
    }else{
      res.status(200).json({
        message: `list found`,
        data: updateWaste
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
    }
  }

//DELETE 
exports.deleteWaste= async(req, res)=>{
  try {
    const Id = req.params.id
    const deleteWaste = await userModel.findByIdAndDelete(Id);
    if (!deleteWaste) {
      res.status(404).json({
        message: `Waste  with ID: ${Id} not found`,
        data: deleteWaste
      })
    }res.status(200).json({
        message: `waste with the ID ${Id} deleted successfully`,
        data: deleteWaste
      })
    
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}



  