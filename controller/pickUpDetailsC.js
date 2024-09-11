const {pickUpWaste} = require('../helpers/HTML')
const {sendMail} = require('../helpers/sendMail')
const userModel = require("../model/userM")
const wasteModel = require('../model/PickUpDetailsM')

exports.createWaste  = async(req, res)=>{
  
  try {
    const id = req.params.id
    if (!id) {
      return res.status(400).json({
         message: 'User id is required' });
    }
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ 
        message: 'User with id not found' });
    }

    const createWaste = new wasteModel(req.body)
    if (createWaste.WasteKG < 1) {
      return res.status(400).json({
         message: 'Waste must be at least 1kg' });
    }
    createWaste.user = user
    await createWaste.save()

    user.userDetail.push(createWaste)
    await user.save()

    await sendMail({
      subject: 'Waste Recycling Confirmation Email',
      email: createWaste.Email,
      html: pickUpWasteTemplate(user.fullName)
    });

    res.status(201).json({
      message: 'List created successfully',
      data: createWaste
    })
  
  } catch (error) {
    if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyValue)[0]; 
        const duplicateValue = error.keyValue[duplicateField];

        return res.status(400).json({
            error: `Duplicate value: ${duplicateValue} for field: ${duplicateField}. Please use another one.`,
        });
    }

    res.status(500).json({
      message: (error.message)
  })
  }
}

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



  