/**
 * 
 * DISCORD SLASH COMMAND
 * /role-claim
 * 
 * DESCRIPTION:
 * Set role of user from his Epitech promotion with a SelectMenu
 * 
 * USAGE: 
 *  /role-claim
 * 
 */

const { SlashCommandBuilder } = require("discord.js");
const { ActionRowBuilder, SelectMenuBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role-claim')
    .setDescription('Sélectionne ton premier rôle en fonction de ta promotion'),
  async chatInputExecute(interaction) {
    if (!interaction.member.moderatable)
      return interaction.reply({ content: `Désolé ${ interaction.user.username }, je ne peux pas faire ça...`, ephemeral: true });
    const row = new ActionRowBuilder()
      .addComponents(
        new SelectMenuBuilder()
          .setCustomId('role-claim')
          .addOptions(
            { label: 'Tech 1', value: 'Tech1' },
            { label: 'Tech 2', value: 'Tech2' },
            { label: 'Tech 3', value: 'Tech3' },
            { label: 'Tech 4', value: 'Tech4' },
            { label: 'Tech 5', value: 'Tech5' },
            { label: 'Alumni', value: 'Alumni' },
            { label: 'MSC', value: 'MSC' },
            { label: 'Coding Academy', value: 'Cod@c' },
            { label: 'Web@cademie', value: 'Web@c' })
      );
      return interaction.reply({ content: 'Sélectionne ta promotion', components: [row], ephemeral: true});
  },
  async selectMenuExecute(interaction) {
    if (!interaction.member.moderatable)
      return interaction.reply({ content: `Désolé ${ interaction.user.username }, je ne peux pas faire ça...`, ephemeral: true });
    if ((!(role_to_set = interaction.values[0])) || (!(new_role = interaction.guild.roles.cache.find(r => r.name === role_to_set))))
      return interaction.reply({content: `Il y a eu une erreur lors de la commande! Veuillez réessayer plus tard ou contacter un modérateur.`, components: [], ephemeral: true});
    if (interaction.member.roles.cache.find(r => r.name === role_to_set) !== undefined)
      return interaction.reply({content: `Vous avez déjà ce rôle!`, ephemeral: true});

    ['Tech1', 'Tech2', 'Tech3', 'Tech3', 'Tech4', 'Tech5', 'Alumni', 'MSC', 'Cod@c', 'Web@c'].forEach(role => {
      if (to_delete_role = interaction.member.roles.cache.find(r => r.name === role))
        interaction.member.roles.remove(to_delete_role);
    });
    interaction.member.roles.add(new_role);
    return interaction.reply({content: `Vos rôles ont été mis à jour avec : ${interaction.values}!`, components: [], ephemeral: true});
  }
};