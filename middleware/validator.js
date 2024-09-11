const joiValidation = require('@hapi/joi');

exports.signUpValidator = async (req, res, next) => {
    const Schema = joiValidation.object({
      Name: joiValidation.string().min(3).required().pattern(new RegExp(/^[^\s].+[^\s]$/)).messages({
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
    
        Password: joiValidation.string().required().min(8).max(50).pattern(new RegExp("^(?=.*[!@#$%^&*.])(?=.*[A-Z]).{8,}$")).messages({
            "string.pattern.base":"Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
            "string.empty": "Password cannot be empty",
            "string.min":"password length must be at least 8 characters long"
          }),
          Location:joiValidation.string().required().pattern(/^[a-zA-Z0-9-,\. ]+$/).messages({
        'string.pattern.base': 'Location can contain only alphabetic characters, numbers, spaces, or punctuations.',
        'any.required': 'Location is required.',
        'string.empty': 'Location cannot be empty.'
      }),
          // Location:joiValidation.string().required().messages({
          //   "string.empty":"Location cannot be empty"
          // }),
          // phoneNumber:joiValidation.string().length(11).pattern(/^\d+$/).required().messages({
          //   "any.required": "Phone number is required.",
          //   "string.length": "Phone number must be exactly 11 digits.",
          //   "string.pattern.base": "Phone number must contain only numeric digits.",
          //   "string.base": "Phone number cannot be empty."
          //   }),
         PhoneNumber:joiValidation.string().pattern(/^\d+$/).message({
          "any.required":"Phone number is not allowed to be empty",
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
