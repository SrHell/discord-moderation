const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userID: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    guildID: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    

}, { strict: false });

module.exports = mongoose.model('User', UserSchema);