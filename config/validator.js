const joi = require("joi");

const validator = (req, res, next) => {
  const schema = joi.object({
    //method that contains all of the data that I need to validate
    email: joi.string().email({ minDomainSegments: 2 }).required().messages({
      "string.email": '"mail": incorrect format',
    }),
    firstName: joi.string()
    .min(3)
    .max(30)
    .trim()
    .pattern(new RegExp('[a-zA-Z]'))
    .required()
    .messages({
      'string.pattern.base':'"firstName" :can not contain numbers',
      'string.min': '"firstName": min 3 characters',
      'string.max': '"firstName": max 60 characters'
    }),
    lastName: joi.string()
    .min(3)
    .max(30)
    .pattern(new RegExp('[a-zA-Z]'))
    .trim()
    .required()
    .messages({
      'string.pattern.base':'"lastName" :can not contain numbers',
      'string.min': '"lastName": min 3 characters',
      'string.max': '"lastName": max 60 characters'
    }),
    password: joi
      .string()
      .min(8)
      .max(30)
      .pattern(new RegExp("[a-zA-Z0-9]"))
      .required()
      .messages({
        "string.min": '"password": min 8 characters',
        "string.max": '"password": max 30 characters',
      }),
    role: joi.string().required(),
    from: joi.string().required(),
    country: joi.string(),
    city: joi.string(),
    address: joi.string(),

    // photo: joi.string().required(),
   
    phoneNumber: joi.string(),
  });
  const validation = schema.validate(req.body.userData, { abortEarly: false });
  if (validation.error) {
    return res.json({
      success: false,
      from: "validator",
      message: validation.error.details,
      test: validation,
    });
  }
  next();
};
module.exports = validator;
