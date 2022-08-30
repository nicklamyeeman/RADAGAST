/**
 * 
 * DISCORD SLASH COMMAND
 * /clean-roles
 * 
 * DESCRIPTION:
 * Allow Adm-roled members to clean Epitech discord server with every available roles (Tech1/2/3/4/5, Alumni, MSC, Web@c)
 * This command uses a token cookie from Epitech intra.
 * You can retreive your token with this : "https://github.com/Epitech-Reunion/intra-epitech-retrieve-token"
 * The command can either be used without the token if it is set to environment variable
 * 
 * USAGE: 
 *  /clean-roles
 * 
 *  /clean-roles intra-token
 * 
 */

const { SlashCommandBuilder } = require("discord.js");

const transform_login = (login) => {
  const user = /^\w+-?\w+-?\w+\.[\w-]+/.exec(login);
  if (user && user[0])
    return user[0].split('.').map(names => names.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-')).join(' ');
  return null;
};

const fill_promotions = (all_courses) => {
  const promotions = { 'HP': [], 'Tech1' : [], 'Tech2' : [], 'Tech3' : [], 'Tech4' : [], 'Tech5' : [], 'Alumni' : [], 'MSC' : [], 'Web@c' : [] };
  for (key in all_courses) {
    const semester_code = all_courses[key].semester_code.split('/');
    if (!all_courses[key] || !semester_code)
      continue;
    if (semester_code.length >= 2 && semester_code[1].split('-')[1] === 'Hors Parcours')
      all_courses[key].logins.split(' ').map(login => promotions['HP'].push(transform_login(login)));
    else {
      if (all_courses[key].semester_owner === 'msc' || all_courses[key].semester_owner === 'premsc')
        all_courses[key].logins.split(' ').map(login => promotions['MSC'].push(transform_login(login)));
      else if (all_courses[key].semester_owner === 'webacademie')
        all_courses[key].logins.split(' ').map(login => promotions['Web@c'].push(transform_login(login)));
      else {
        if (all_courses[key].semester_owner === 'bachelor') {
          if (all_courses[key].semester_code.slice(0, 2) === 'B1')
            all_courses[key].logins.split(' ').map(login => promotions['Tech1'].push(transform_login(login)));
          if (all_courses[key].semester_code.slice(0, 2) === 'B2' || all_courses[key].semester_code.slice(0, 2) === 'B3')
            all_courses[key].logins.split(' ').map(login => promotions['Tech2'].push(transform_login(login)));
          if (all_courses[key].semester_code.slice(0, 2) === 'B4' || all_courses[key].semester_code.slice(0, 2) === 'B5')
            all_courses[key].logins.split(' ').map(login => promotions['Tech3'].push(transform_login(login)));
          if (all_courses[key].semester_code.slice(0, 2) === 'B6')
            all_courses[key].logins.split(' ').map(login => promotions['Tech4'].push(transform_login(login)));
        }
        if (all_courses[key].semester_owner === 'master') {
          if (all_courses[key].semester_code.slice(0, 3) === 'S07')
            all_courses[key].logins.split(' ').map(login => promotions['Tech4'].push(transform_login(login)));
          if (all_courses[key].semester_code.slice(0, 3) === 'S08' || all_courses[key].semester_code.slice(0, 3) === 'S09')
            all_courses[key].logins.split(' ').map(login => promotions['Tech5'].push(transform_login(login)));
          if (all_courses[key].semester_code.slice(0, 3) === 'S10')
            all_courses[key].logins.split(' ').map(login => promotions['Alumni'].push(transform_login(login)));
        }
      }
    }
  }
  return promotions;
};

const fill_courses = (res) => {
  const all_courses = [];
  for (course in res.data.tree) {
    if (Array.isArray(res.data.tree[course].items))
      res.data.tree[course].items.map(i => { if (i.logins !== null) all_courses.push(i)});
    else {
      for (c in res.data.tree[course].items) {
        if (Array.isArray(res.data.tree[course].items[c].items))
          res.data.tree[course].items[c].items.map(i => { if (i.logins !== null) all_courses.push(i)});
      }
    }
  }
  return all_courses;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clean-roles')
    .setDescription('Gère tous les rôles de promotion de tous les membres du Discord')
    .addStringOption(option => option.setName('intra-token').setDescription('Entrez votre cookie token intranet')),
  async chatInputExecute(interaction) {
    if (!interaction.member.roles.cache.find(r => r.name === 'Adm'))
      return interaction.reply({ content: `Désolé ${ interaction.user.username }, vous n'avez pas le rôle requis pour cette requête!`, ephemeral: true });
    const all_promise = [];
    return interaction.reply({content: `Nettoyage du serveur en cours...\n`, ephemeral: true}).then(() => {
      const intraToken = (interaction.options.getString('intra-token')) ? interaction.options.getString('intra-token') : process.env.INTRA_TOKEN;
      const academicyear = new Date().getFullYear();
      [ `https://intra.epitech.eu/admin/promo/?school=&location=FR%2FRUN&scolaryear=${academicyear-1}&format=json`,
        `https://intra.epitech.eu/admin/promo/?school=&location=FR%2FRUN&scolaryear=${academicyear}&format=json`,
        `https://intra.epitech.eu/admin/promo/?school=&location=FR%2FPAR&scolaryear=${academicyear-1}&format=json`,
        `https://intra.epitech.eu/admin/promo/?school=&location=FR%2FPAR&scolaryear=${academicyear}&format=json`,
      ].forEach(url => {
        require('axios').request({
          url: url,
          method: "get",
          headers: {
            Cookie: "user=" + intraToken
          }
        })
        .then(res => {
          if (!res.data.tree)
            return (interaction.editReply({content: `Il y a eu une erreur lors de la commande! Veuillez réessayer plus tard ou contacter un modérateur.`, ephemeral: true}));
          const all_courses = fill_courses(res);
          const promotions = fill_promotions(all_courses);
          for (promo in promotions) {
            promotions[promo].forEach(logins => {
              const member = interaction.guild.members.cache.find(member => member.user.username === logins || member.nickname === logins);
              if (member !== undefined && member.moderatable) {
                if (promo === 'HP') {
                  all_promise.push(member.kick(`Vous avez été kick du serveur Epitech car vous n'êtes plus étudiant. Bonne continuation !\nS'il s'agit d'une erreur contactez un modérateur (@Nickauteen#0778).`).then(console.log(`${member.nickname} a été kick\n`)));
                } else {
                  const new_role = interaction.guild.roles.cache.find(r => r.name === promo);
                  if (new_role !== undefined) {
                    ['Tech1', 'Tech2', 'Tech3', 'Tech3', 'Tech4', 'Tech5', 'Alumni', 'MSC', 'Web@c'].forEach(role => {
                      if ((to_delete_role = member.roles.cache.find(r => r.name === role)) !== undefined && to_delete_role.name !== new_role.name)
                        all_promise.push(member.roles.remove(to_delete_role).then(console.log(`${member.nickname} perd le rôle: ${to_delete_role.name}`)));
                    });
                    all_promise.push(member.roles.add(new_role).then(console.log(`${(member.nickname) ? member.nickname : member.user.username} a eu le rôle: ${new_role.name}`)));
                  }
                }
              }
            });
          }
        })
        .catch(error => {
          console.error(error);
        });
      })
    }).then(() => {
      Promise.all(all_promise).then(() => {
        return interaction.editReply({content: `Nettoyage en cours, les rôles se mettront au fur et à mesure.`, ephemeral: true});
      });
    })
  }
};