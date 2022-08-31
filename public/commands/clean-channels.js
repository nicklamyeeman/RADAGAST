/**
 * 
 * DISCORD SLASH COMMAND
 * /clean-channels
 * 
 * DESCRIPTION:
 * Change channels tek1/2/3/4/5 to add a channel promo-20xx
 * 
 * USAGE: 
 *  /clean-channels
 * 
 */

 const { SlashCommandBuilder } = require("discord.js");
 
 module.exports = {
   data: new SlashCommandBuilder()
      .setName('clean-channels')
      .setDescription('Modifie les salons textuels tek1/2/3/4/5 et ajoute : promo-20xx'),
    async chatInputExecute(interaction) {
      if (!interaction.member.roles.cache.find(r => r.name === 'Adm'))
        return interaction.reply({ content: `Désolé ${ interaction.user.username }, vous n'avez pas le rôle requis pour cette requête!`, ephemeral: true });
      const academicyear = (new Date().getMonth() < 7) ? new Date().getFullYear() - 1 : new Date().getFullYear();
      const new_chan = interaction.guild.channels.cache.find(channel => channel.name === `promo-${academicyear}`)
      if (new_chan === undefined) {
        interaction.guild.channels.cache.find(channel => channel.name === 'tek5').setName(`promo-${academicyear}`)
          .then(interaction.guild.channels.cache.find(channel => channel.name === 'tek4').setName('tek5')
            .then(interaction.guild.channels.cache.find(channel => channel.name === 'tek3').setName('tek4')
              .then(interaction.guild.channels.cache.find(channel => channel.name === 'tek2').setName('tek3')
                .then(interaction.guild.channels.cache.find(channel => channel.name === 'tek1').setName('tek2')
                  .then(interaction.guild.channels.create({ name: 'tek1' })
                    .then(channel => channel.setParent(interaction.guild.channels.cache.find(channel => channel.name === 'Salons Textuels'))
                      .then(channel => channel.setPosition(interaction.guild.channels.cache.find(channel => channel.name === 'tek2').position))))))));
      }
      return interaction.reply({content: `Les salons ont été modifiés!`, ephemeral: true});
    }
 }