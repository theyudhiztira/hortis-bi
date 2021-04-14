const Validator = require('validatorjs');

module.exports = {
    register : (req, res, next) => {
        let rules = {
            email: "required|email",
            password: "required|min:8",
            phone: "required|min:5",
            full_name: "required",
            role: "required|in:admin,user"
        };

        let validation = new Validator(req.body, rules); //(form input, rules) 

        if (!validation.fails()){
            return next();
        }
        
        let errors = validation.errors.errors;

        const extractedErrors = [];
        for (var key in errors) {
            extractedErrors.push(errors[key][0]);
        }

        return res.status(422).json({
            errors: extractedErrors,
        })
    },

    login : (req, res, next) => {
        
        let rules = {
            email: "required|email",
            password: "required|min:8"
        };

        let validation = new Validator(req.body, rules); //(form input, rules) 

        if (!validation.fails()){
            return next();
        }
        
        let errors = validation.errors.errors;

        const extractedErrors = [];
        for (var key in errors) {
            extractedErrors.push(errors[key][0]);
        }

        return res.status(422).json({
            errors: extractedErrors,
        })
    },

    edit : async (req, res, next) => {
        let rules = {
            email: "email",
            phone: "min:5",
            password: "min:8"
        };

        let validation = new Validator(req.body, rules); //(form input, rules) 

        if (!validation.fails()){
            return next();
        }
        
        let errors = validation.errors.errors;

        const extractedErrors = [];
        for (var key in errors) {
            extractedErrors.push(errors[key][0]);
        }

        return res.status(422).json({
            errors: extractedErrors,
        })
    }
}