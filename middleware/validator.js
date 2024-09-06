const joiValidation = require('@hapi/joi');

exports.signUpValidator = async (req, res, next) => {
    const Schema = joiValidation.object({
        Name: joiValidation.string().min(3).required().trim().pattern(new RegExp(/^[^\s].+[^\s]$/)).messages({
          "any.required": "Name is required.",
          "string.empty": "Name cannot be empty.",
          "string.min": "Name must be at least 3 characters long.",
          "string.pattern.base": "Name cannot start or end with a whitespace.",
        }),
        Email: joiValidation.string().email().min(7).required().messages({
          "any.required": "please kindly fill your email address",
          "string.empty": "email cannot be empty",
          "string.email":"invalid email format. please enter a valid email address",
        }),
    
        Password: joiValidation.string().required().min(8).max(50).messages({
          // .regex(
          //   /^(?=.[a-z])(?=.[A-Z])(?=.[0-9])(?=.[!@#$%^&(),.?":{}|<>])[A-Za-z0-9!@#$%^&(),.?":{}|<>]{8,50}$/
          // )
            "string.pattern.base":"Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
            "string.empty": "Password cannot be empty",
            "string.min":"password length must be at least 8 characters long"
          }),
          Location:joiValidation.string().required().messages({
            "string.empty":"Location cannot be empty"
          }),
        
         PhoneNumber:joiValidation.string().regex(/^\d{11}$/).message({
          "string.empty":"Phone number cannot be empty",
          "string.pattern.base":"Phone number must be exactly 11 digits"
          
         }) 
          });
            const { error } = Schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
        });
      }
      next();
    };


exports.logInValidator = async (req, res, next) => {
    const Schema = joiValidation.object({
        Email: joiValidation
        .string()
        .email()
        .min(7)
        .required()
        .messages({
          "any.required": "please kindly fill your email address",
          "string.empty": "email cannot be empty",
          "string.email":
            "invalid email format. please enter a valid email address",
        }),
    
        Password: joiValidation
          .string()
          .required()
          .min(8)
          .max(50)
          // .regex(
          //   /^(?=.[a-z])(?=.[A-Z])(?=.[0-9])(?=.[!@#$%^&(),.?":{}|<>])[A-Za-z0-9!@#$%^&(),.?":{}|<>]{8,50}$/
          // )
          .messages({
            "string.pattern.base":"Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
            "string.empty": "Password cannot be empty",
          }),
        })
        
    const {err} = Schema.validate(req.body);

    if (err) {
        return res.status(400).json({
            message: err.details[0].message
        })
    }

    next()
}
