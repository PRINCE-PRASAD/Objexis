const Joi = require('joi');

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request", error })
    }
    next();
}
const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request", error })
    }
    next();
}
module.exports = {
    signupValidation,
    loginValidation
}

// const Joi = require('joi');

// const signupValidation = (req, res, next) => {
//     const schema = Joi.object({
//         name: Joi.string().min(3).max(100).required(),
//         email: Joi.string().email().required(),
//         password: Joi.string()
//             .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{4,100}$'))
//             .required()
//             .messages({
//                 'string.pattern.base': 'Password must include uppercase, lowercase, and a number',
//                 'string.min': 'Password should have a minimum length of 4',
//                 'any.required': 'Password is required'
//             }),
//     });

//     const { error } = schema.validate(req.body, { abortEarly: false });
//     if (error) {
//         return res.status(400).json({
//             message: 'Bad request',
//             errors: error.details.map((err) => ({
//                 field: err.context.label,
//                 message: err.message,
//             }))
//         });
//     }
//     next();
// };

// const loginValidation = (req, res, next) => {
//     const schema = Joi.object({
//         email: Joi.string().email().required(),
//         password: Joi.string().min(4).max(100).required()
//     });

//     const { error } = schema.validate(req.body, { abortEarly: false });
//     if (error) {
//         return res.status(400).json({
//             message: 'Bad request',
//             errors: error.details.map((err) => ({
//                 field: err.context.label,
//                 message: err.message,
//             }))
//         });
//     }
//     next();
// };

// module.exports = {
//     signupValidation,
//     loginValidation
// };
