// Import necessary libraries and models
const jwt = require('jsonwebtoken');
const { User } = require('../DB_connection');
const { JWT_SECRET } = process.env;

const updateAuth0UserTypeController = async (req, res) => {
    try {
        const { userId, type } = req.body;
        if (type !== 2 && type !== 3) {
            return res.status(400).json({ message: 'Invalid user type' });
        }
        const user = await User.findOne({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.type === 2 || user.type === 3) {
            return res.status(200).json({ message: 'User type already set', user });
        }
        user.type = type;
        user.valid = true;
        await user.save();
        // Sign a new JWT token with the updated user information
        const token = jwt.sign({ userId: user.id, email: user.email, type: user.type }, JWT_SECRET, {
            expiresIn: '1h' 
        });
        return res.status(200).json({ message: 'User type updated successfully', token, user });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


// Export 
module.exports = updateAuth0UserTypeController;
