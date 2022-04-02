const mongoose = require('mongoose');

const GuildSchema = new mongoose.Schema({
    guildID: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    verifyMemberRole: mongoose.SchemaTypes.String,
    antiRaidStatus: mongoose.SchemaTypes.Boolean,
    moderationLogChannel: mongoose.SchemaTypes.String,
    embedColour: mongoose.SchemaTypes.String,
    
    //Music Player
    songArray: mongoose.SchemaTypes.Array,
    volume: mongoose.SchemaTypes.Number,
    DJRoleID: mongoose.SchemaTypes.String,
    skipCount: mongoose.SchemaTypes.Number,

    
    
    

}, { strict: false });

module.exports = mongoose.model('Guild', GuildSchema);