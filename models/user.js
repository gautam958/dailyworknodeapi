const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');
const validate = require('mongoose-validator');

const UseridValidator = [
    validate({
        validator: 'isLength',
        arguments: [0, 40],
        message: 'Userid must not exceed {ARGS[1]} characters.'
    })
];
const PasswordValidator = [
    validate({
        validator: 'isLength',
        arguments: [0, 20],
        message: 'Password must not exceed {ARGS[1]} characters.'
    })
];
const FullNameValidator = [
    validate({
        validator: 'isLength',
        arguments: [0, 20],
        message: 'FullNameValidator must not exceed {ARGS[1]} characters.'
    })
];

const EmailValidator = [
    validate({
        validator: 'isLength',
        arguments: [0, 20],
        message: 'EmailValidator must not exceed {ARGS[1]} characters.'
    }),
    validate({
        validator: 'isEmail',
        message: 'Email must be valid.'
    })
];

const ContactNoValidator = [
    // TODO: Make some validations here...
];
const CountryValidator = [
    // TODO: Make some validations here...
];


// Define the database model
const UserSchema = new mongoose.Schema({
    Userid: {
        type: String,
        required: [true, 'Userid is required.'],
        unique: true,
        validate: UseridValidator
    },
    Password: {
        type: String,
        required: [true, 'Password is required.'],
        validate: PasswordValidator
    },
    FullName: {
        type: String,
        required: [true, 'FullName is required.'],
        validate: FullNameValidator
    },
    Email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        validate: EmailValidator
    },
    ContactNo: {
        type: String,
        validate: ContactNoValidator
    },
    Country: {
        type: String,
        validate: CountryValidator
    }
});

// Use the unique validator plugin
UserSchema.plugin(unique, { message: 'That {PATH} is already taken.' });

const User = module.exports = mongoose.model('Users', UserSchema);