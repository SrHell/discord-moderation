const GuildModel = require('../schemas/GuildSchema')
const UserModel = require('../schemas/UserSchema')
const TicketSchema = require('../schemas/TicketSchema')
const ConsultGuildSchema = require('../schemas/ConsultGuildSchema')
const ConsultUserSchema = require('../schemas/ConsultUserSchema')

module.exports = async (client) => {
    client.GuildModel = GuildModel
    client.UserModel = UserModel
    client.TicketSchema = TicketSchema
    client.ConsultGuildSchema = ConsultGuildSchema
    client.ConsultUserSchema = ConsultUserSchema
    client.findOrCreateGuild = async function findOrCreateGuild(guildId) {
        let consultUser = await client.ConsultGuildSchema.findOne({ guildID: guildId});
        if (consultUser) {
            let userData = await client.ConsultGuildSchema.findOneAndUpdate({guildID: guildId }, { guildID: guildId, guildConsultCounter: 0, guildConsultParentCategoryID: "", guildConsultSupportRoleID: "", guildConsultLogChannelID: "" }, { upsert: true, new: true } );
        } else {
            let userData = await client.ConsultGuildSchema.create({ guildID: guildId, guildConsultCounter: 0, guildConsultParentCategoryID: "", guildConsultSupportRoleID: "", guildConsultLogChannelID: "" });
        }
        let guild = await GuildModel.findOne({ guildID: guildId});
        if (guild) { let guildData = await GuildModel.findOneAndUpdate({
                    guildID: guildId,
                },
                {
                    guildID: guildId,
                    songArray: [],
                },
                {
                    upsert: true,
                    new: true
                }
            );
            return guildData;
        } else {
            let guildData = await GuildModel.create({
                guildID: guildId,
                antiRaidStatus: false,
                moderationLogChannel: "",
                embedColour: `${client.config.defaults.embedColour}`,
                embedFooter: `${client.config.defaults.embedFooter}`
            });
            return guildData;
        }
    }
    client.findOrCreateUser = async function findOrCreateUser(userId, guildId) {
        let guild = await UserModel.findOne({ userID: userId, guildID: guildId});
        if (guild) {
            let userData = await UserModel.findOneAndUpdate(
                {
                    userID: userId,
                    guildID: guildId,
                },
                {
                    userID: userId,
                    guildID: guildId,
                },
                {
                    upsert: true,
                    new: true
                }
            );
            return userData;
        } else {
            let userData = await UserModel.create({
                userID: userId,
                guildID: guildId,
            });
            return userData;
        }
    }
}