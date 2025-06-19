const Joi = require("joi");

const signUpSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  confirm: Joi.ref("password"),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});

const signInSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

const studentSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),

  rollNo: Joi.string().min(1).max(8),
});

const testValidator = Joi.object({
  date: Joi.date().required(),
  subject: Joi.string().required(),
  duration: Joi.number().required(),
  title: Joi.string().required(),
  active: Joi.boolean(),
  delete: Joi.boolean(),
  questions: Joi.array()
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)) 
    .default([]),
});

const questionValidator = Joi.object({
    question : Joi.string().required(),
    options : Joi.array()
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .default([])
    .length(4),

    correctAnswer : Joi.string().required(),
})

const optionValidator = Joi.object({
    option : Joi.string().required(),
})

module.exports = { signUpSchema, 
    studentSchema, 
    signInSchema, 
    testValidator,
    questionValidator, 
    optionValidator 
};
