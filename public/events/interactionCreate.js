/**
 * 
 * DISCORD SLASH COMMAND EVENT
 * interactionCreate
 * 
 * DESCRIPTION:
 * Create the event interactionCreate from slash command
 * Events that are managed : chat input command, select menu option, modal response
 * 
 */

const { InteractionType } = require("discord.js");

module.exports = {
  name: 'interactionCreate',
  execute(interaction) {
    console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);  
      if (!command) return;
      try {
        command.chatInputExecute(interaction);
      } catch (error) {
        console.error(error);
        interaction.reply({ content: `Il y a eu une erreur durant l'éxecution de la commande!`, ephemeral: true });
      }
    }
    if (interaction.isSelectMenu()) {
      const command = interaction.client.commands.get(interaction.customId);  
      if (!command) return;
      try {
        command.selectMenuExecute(interaction);
      } catch (error) {
        console.error(error);
        interaction.reply({ content: `Il y a eu une erreur durant l'éxecution de la commande!`, ephemeral: true });
      }
    }
    if (interaction.type === InteractionType.ModalSubmit) {
      const command = interaction.client.commands.get(interaction.customId);  
      if (!command) return;
      try {
        command.modalExecute(interaction);
      } catch (error) {
        console.error(error);
        interaction.reply({ content: `Il y a eu une erreur durant l'éxecution de la commande!`, ephemeral: true });
      }
    }
  },
};