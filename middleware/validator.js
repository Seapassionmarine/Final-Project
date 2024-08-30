const Joi = require('@hapi/joi');

exports.signUpValidator = async (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().required().min(3).trim().regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/).messages({
        "any.required": "please provide Name",
        "string.empty": "Name cannot be empty",
        "string.min": "the minimum name must be at least 3 character long",
        "string.pattern.base": "Name should only contain letters",
      }),
       Email: Joi.string().email().min(7).required().messages({
        "any.required": "please provide your email address",
        "string.empty": "email cannot be empty",
        "string.email":"invalid email format. please enter a valid email address",
      }),
       Password: Joi.string().required().min(8).max(50).regex( /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,50}$/).messages({
          "string.pattern.base":"Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
          "string.empty": "Password cannot be empty",
        }),
        Location:Joi.string().required().messages({
            'any.required': 'Address is a required field.',
            'string.empty': 'please provide an address'
        }),
        PhoneNumber:Joi.string().regex(/^\d{11}$/).message('Phone number must be exactly 11 digits'),
     })
    const {err} = schema.validate(req.body);

    if (err) {
        return res.status(400).json({
            message: err.details[0].message
        })
    }

    next()
}

exports.logInValidator = async (req, res, next) => {
    const schema = Joi.object({
        Email: Joi.string().email().min(7).required().messages({
            "any.required": "please provide your email address",
            "string.empty": "email cannot be empty",
            "string.email":"invalid email format. please enter a valid email address",
          }),
           Password: Joi.string().required().min(8).max(50).regex( /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,50}$/).messages({
              "string.pattern.base":"Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
              "string.empty": "Password cannot be empty",
            }),
    })
    const {err} = schema.validate(req.body);

    if (err) {
        return res.status(400).json({
            message: err.details[0].message
        })
    }

    next()
}