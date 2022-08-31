/**
 * 
 * DISCORD SLASH COMMAND
 * /happy-birthday
 * 
 * DESCRIPTION:
 * Wish an happy birthday to a user
 * 
 * USAGE: 
 *  /happy-birthday @Nickauteen#0778
 * 
 */

const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('happy-birthday')
    .setDescription('Souhaite un anniversaire à un membre du discord')
    .addUserOption(option => option.setName('user').setDescription('Membre du discord').setRequired(true)),
  async chatInputExecute(interaction) {
    const member = interaction.guild.members.cache.find(member => interaction.options.getUser('user').id === member.user.id);
    require('axios').request({
      url: `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_ID}&q=Happy+Birthday&limit=25&offset=0&rating=g&lang=en`,
      method: "get"
    }).then(res => {
      const embed = new EmbedBuilder()
    	.setColor(0x22CC22)
	    .setTitle(`Joyeux anniversaire ${(member.nickname) ? member.nickname : member.user.username}! 🎉`)
      .setImage(res.data.data[Math.floor(Math.random() * 25)].images.fixed_height.url)
      .setTimestamp()
      return interaction.reply({
        content: `${ interaction.member } t'a envoyé une carte d'anniversaire ${ member } ! 🥳`,
        embeds: [embed],
        ephemeral: false
      });
    });
  }
}