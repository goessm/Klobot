const { Events } = require('discord.js');
const {fetchIfPartial} = require("../utils/utils");
const {handleReactionRoleRemove} = require("../actions/handleReactionRoles");

module.exports = {
    name: Events.MessageReactionRemove,
    async execute(reaction, user) {
        await fetchIfPartial(reaction);
        await fetchIfPartial(user);

        if (user.id === reaction.message.client.user.id) return;
        await handleReactionRoleRemove(reaction, user);
    },
};
