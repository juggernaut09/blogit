const {default:validator} = require('validator');
const isEmpty = require('is-empty');


validateSignupInput = (data) => {
    let errors = {};

    let {user_name, email, password} = data;

    user_name = !validator.isEmpty(user_name) ? user_name : "";
    email = !validator.isEmpty(email) ? email : "";
    password = !validator.isEmpty(password) ? password : "";


    if(validator.isEmpty(user_name)){
        errors.user_name = "User name cannot be empty";
    }

    if (Validator.isEmpty(email)) {
        errors.email = "Email is required";
     } else if (!Validator.isEmail(email)) {
        errors.email = "Enter a valid email id";
     }
  
    if(validator.isEmpty(password)) {
        errors.password = "Password cannot be empty";
    } else if(!validator.isLength(password, {min: 6, max:30})){
        errors.password = "Password must be at least 6 characters"
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = validateSignupInput;