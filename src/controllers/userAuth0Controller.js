const { User } = require('../DB_connection');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { SECRET } = require('../config.js');

const userAuth0Controller = {};

userAuth0Controller.loginOrSignup = async (req, res) => {
    try {
        // Extract email and Auth0 ID from the request
        const email = req.email;
        const auth0Id = req.auth0Id;

        // Try to find a user with the provided email
        let user = await User.findOne({
            where: {
                email: email,
            }
        });

        // If no user exists with the provided email, create a new user
        if (!user) {
            // Generating a temporary password for placeholder
            const temporaryPassword = crypto.randomBytes(10).toString('hex');
            user = await User.create({
                username: email,
                email: email,
                password: temporaryPassword, // Saving a hashed password should be considered
                auth0Id: auth0Id,
                type: 4,
                // Additional fields should be included if necessary
            });
            
            // Generating a JWT token for the new user
            const token = jwt.sign({ userId: user.id, email: user.email, type: user.type }, SECRET, {
                expiresIn: '1h' 
            });

            // Sending the token and user details as a response
            return res.status(201).json({ message: 'Placeholder account created', token, user });
        }

        // If the Auth0 ID matches with the one in the database, log the user in
        if (user.auth0Id === auth0Id) {
            // Generating a JWT token for the logged-in user
            const token = jwt.sign({ userId: user.id, email: user.email }, SECRET, {
                expiresIn: '1h' 
            });

            // Sending the token and user details as a response
            return res.status(200).json({ message: 'Logged in using Auth0', token, user });
        } 
        // If user found but Auth0 ID is not set, update the Auth0 ID
        else if (user.auth0Id === null) {
            user.auth0Id = auth0Id;
            await user.save();
            
            // Generating a JWT token for the user after updating Auth0 ID
            const token = jwt.sign({ userId: user.id, email: user.email }, SECRET, {
                expiresIn: '1h' 
            });

            // Sending the token and user details as a response
            return res.status(200).json({ message: 'Auth0 ID added to existing user', token, user });
        } 
        // If Auth0 IDs mismatch, send an error message
        else {
            return res.status(400).json({ message: 'Mismatch in Auth0 ID' });
        }

    } catch (error) {
        // In case of an error, send an error message as a response
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = userAuth0Controller;
