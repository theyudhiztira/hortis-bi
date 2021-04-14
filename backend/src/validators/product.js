const Validator = require('validatorjs');

module.exports = {
    create: (req, res, next) => {
        const rules = {
            category_id: "required",
            name: "required",
            unit: "required|in:pcs,kg,ltr",
            price_per_unit_retail: "required|integer|min:0",
            price_per_unit_reseller: "required|integer|min:0",
            stock: "required|integer|min:0",
        }

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