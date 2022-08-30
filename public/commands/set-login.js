/**
 * 
 * DISCORD SLASH COMMAND
 * /set-login
 * 
 * DESCRIPTION:
 * Set login allow user to change his/someone else's nickname from his Epitech login
 * 
 * USAGE: 
 *  /set-login nick.lam-yee-man@epitech.eu 
 *  User nickname set to 'Nick Lam-Yee-Man'
 * 
 *  /set-login nick1.lam-yee-man@epitech.eu @AnoNickmous#3803
 *  AnoNickmous#3803 nickname set to 'Nick1 Lam-Yee-Man'
 * 
 */

const { SlashCommandBuilder } = require('discord.js');

const get_member = (interaction) => {
  if (interaction.options.getUser('user') !== null)
    return interaction.guild.members.cache.find(member => member.user.id === interaction.options.getUser('user').id);
  return interaction.member;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-login")
    .setDescription("Définir votre pseudo à partir de votre login Epitech")
    .addStringOption(option => option.setName('login').setDescription('Adresse email Epitech').setRequired(true))
    .addUserOption(option => option.setName('user').setDescription('Difinir le pseudo de ce membre').setRequired(false)),
  async chatInputExecute(interaction) {
    const member = get_member(interaction);
    if (interaction.options.getUser('user') !== null && !interaction.member.roles.cache.find(r => r.name === 'Adm'))
      return interaction.reply({ content: `Désolé ${ interaction.user.username }, vous n'avez pas le droit de faire ça...`, ephemeral: true });
    if (!member.moderatable)
      return interaction.reply({ content: `Désolé ${ interaction.user.username }, je n'ai pas le droit de faire ça...`, ephemeral: true });

    const login = /^\w+-?\w+-?\w+\.[\w-]+/.exec(interaction.options.getString('login'));
    if (!login || login[0].length > 32)
      return interaction.reply({content: `Ceci n'est pas un login Epitech valide!`, ephemeral: true});
    const nickname = login[0].split('.').map(names => names.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-')).join(' ');
    if (!nickname || nickname.length > 32)
      return interaction.reply({content: `Il y a eu une erreur lors de la commande! Veuillez réessayer plus tard ou contacter un modérateur.`, components: [], ephemeral: true});

    member.setNickname(nickname);
    return interaction.reply({content: `Pseudo de ${member.user.username} mis à jour : ${nickname}!`, ephemeral: true});
  }
};