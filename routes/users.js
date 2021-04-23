const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const stringCapitalizeName = require('string-capitalize-name');
const User = require('../models/user');

mongoose.set('useFindAndModify', false);

// Attempt to limit spam post requests for inserting data
const minutes = 5;
const postLimiter = new RateLimit({
    windowMs: minutes * 60 * 1000, // milliseconds
    max: 100, // Limit each IP to 100 requests per windowMs 
    delayMs: 0, // Disable delaying - full speed until the max limit is reached 
    handler: (req, res) => {
        res.status(429).json({ success: false, msg: `You made too many requests. Please try again after ${minutes} minutes.` });
    }
});

// READ (ALL)
router.get('/', (req, res) => {
    //console.warn("users object ", User.countDocuments());
    User.find({})
        .then((result) => {
            res.json(result);
            //  console.warn("user Data ", result);
        })
        .catch((err) => {
            res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
        });
});

// READ (ONE)
router.get('/:id', (req, res) => {
    User.findById(req.params.id)
        .then((result) => {
            res.json(result);
            // console.warn("user Data userid " + req.params.id, result);
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: `No such user.` });
        });
});

// CREATE
router.post('/', postLimiter, (req, res) => {

    // // Validate the age
    // let age = sanitizeAge(req.body.age);
    // if (age < 5 && age != '') return res.status(403).json({ success: false, msg: `You're too young for this.` });
    // else if (age > 130 && age != '') return res.status(403).json({ success: false, msg: `You're too old for this.` });

    let newUser = new User({
        Userid: sanitizeName(req.body.Userid),
        Password: sanitizeName(req.body.Password),
        FullName: sanitizeName(req.body.FullName),
        Email: sanitizeName(req.body.Email),
        ContactNo: sanitizeName(req.body.ContactNo),
        Country: sanitizeName(req.body.Country),

    });
    //console.warn('new User', newUser);
    newUser.save()
        .then((result) => {
            res.json({
                success: true,
                msg: `Successfully added!`,
                result: {
                    _id: result._id,
                    Userid: result.Userid,
                    FullName: result.FullName,
                    Email: result.Email,
                    ContactNo: result.ContactNo,
                    Country: result.Country
                }
            });
        })
        .catch((err) => {
            if (err.errors) {
                if (err.errors.name) {
                    res.status(400).json({ success: false, msg: err.errors.name.message });
                    return;
                }
                if (err.errors.email) {
                    res.status(400).json({ success: false, msg: err.errors.email.message });
                    return;
                }
                if (err.errors.age) {
                    res.status(400).json({ success: false, msg: err.errors.age.message });
                    return;
                }
                if (err.errors.gender) {
                    res.status(400).json({ success: false, msg: err.errors.gender.message });
                    return;
                }
                // Show failed if all else fails for some reasons
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            }
        });
});

// UPDATE
router.put('/:id', (req, res) => {
    // check this condition PUT  http://localhost:3010/api/users/60829830d9bb6d5ad851cfc6
    //console.warn("id", req.params.id);
    // // Validate the age
    // let age = sanitizeAge(req.body.age);
    // if (age < 5 && age != '') return res.status(403).json({ success: false, msg: `You're too young for this.` });
    // else if (age > 130 && age != '') return res.status(403).json({ success: false, msg: `You're too old for this.` });

    let updatedUser = {
        Userid: sanitizeName(req.body.Userid),
        Password: sanitizeName(req.body.Password),
        FullName: sanitizeName(req.body.FullName),
        Email: sanitizeName(req.body.Email),
        ContactNo: sanitizeName(req.body.ContactNo),
        Country: sanitizeName(req.body.Country),
    };

    User.findOneAndUpdate({ _id: req.params.id }, updatedUser, { runValidators: true, context: 'query' })
        .then((oldResult) => {
            User.findOne({ _id: req.params.id })
                .then((newResult) => {
                    res.json({
                        success: true,
                        msg: `Successfully updated!`,
                        result: {
                            _id: newResult._id,
                            Userid: result.Userid,
                            FullName: result.FullName,
                            Email: result.Email,
                            ContactNo: result.ContactNo,
                            Country: result.Country
                        }
                    });
                })
                .catch((err) => {
                    res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
                    return;
                });
        })
        .catch((err) => {
            if (err.errors) {
                if (err.errors.name) {
                    res.status(400).json({ success: false, msg: err.errors.name.message });
                    return;
                }
                if (err.errors.email) {
                    res.status(400).json({ success: false, msg: err.errors.email.message });
                    return;
                }
                if (err.errors.age) {
                    res.status(400).json({ success: false, msg: err.errors.age.message });
                    return;
                }
                if (err.errors.gender) {
                    res.status(400).json({ success: false, msg: err.errors.gender.message });
                    return;
                }
                // Show failed if all else fails for some reasons
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            }
        });
});

// DELETE
router.delete('/:id', (req, res) => {

    User.findByIdAndRemove(req.params.id)
        .then((result) => {
            res.json({
                success: true,
                msg: `It has been deleted.`,
                result: {
                    _id: result._id,
                    Userid: result.Userid,
                    FullName: result.FullName,
                    Email: result.Email,
                    ContactNo: result.ContactNo,
                    Country: result.Country
                }
            });
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: 'Nothing to delete.' });
        });
});

module.exports = router;


// Minor sanitizing to be invoked before reaching the database
sanitizeName = (name) => {
    return stringCapitalizeName(name);
}
sanitizeEmail = (email) => {
    return email.toLowerCase();
}
sanitizeAge = (age) => {
    // Return empty if age is non-numeric
    if (isNaN(age) && age != '') return '';
    return (age === '') ? age : parseInt(age);
}
sanitizeGender = (gender) => {
    // Return empty if it's neither of the two
    return (gender === 'm' || gender === 'f') ? gender : '';
}