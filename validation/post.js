const { default: validator } = require("validator")
const {default:validator} = require("validator");

validatePostInput = (data) => {
    let errors = {}
    let {title, body} = data;
    let title = !validator.isEmpty(title) ? title : "";
    let body = !validator.isEmpty(body) ? body : "";

    if (Validator.isEmpty(title)) {
        errors.title = "Title is required";
     }
     if (Validator.isEmpty(body)) {
        errors.body = "Description is required";
     }

    return {
        errors,
        isValid: validator.isEmpty(errors)
    }
}

module.exports = validatePostInput;