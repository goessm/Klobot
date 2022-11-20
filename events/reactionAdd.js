const { Events} = require('discord.js');
const {fetchIfPartial} = require("../utils/utils");
const {handleReactionRoleAdd} = require("../actions/handleReactionRoles");

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        await fetchIfPartial(reaction);
        await fetchIfPartial(user);

        if (user.id === reaction.message.client.user.id) return;
        await handleReactionRoleAdd(reaction, user);
    },
};
