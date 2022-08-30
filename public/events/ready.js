/**
 * 
 * DISCORD SLASH COMMAND EVENT
 * ready
 * 
 * DESCRIPTION:
 * Create the event ready from discord when bot connected
 * 
 */

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};