const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
} = require('discord.js');
const guildLang = require('../util/Models/guildModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help command!')
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Hilfe Befehl!",
      "es-ES": 'Comando de ayuda!'
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { Help } = require(`../languages/${result.language}.json`);
        const commands = await client.application.commands.fetch({ withLocalizations: true })
        let type;
        if (result.language === "de_DE") {
          type = "de"
        } else if (result.language === "en_US") {
          type = "en"
        } else if (result.language === "es_ES") {
          type = "es"
        }
        const helpembed = new EmbedBuilder()
          .setColor('#0598F6')
          .setFooter({
            text: `${Help.embed.footer}`,
            iconURL: client.user.avatarURL(),
          })
          .setTimestamp()
          .setTitle(Help.embed.title)
          .addFields(
            {
              name: Help.embed.Fields.privacyname,
              value: Help.embed.Fields.privacy,
              inline: false,
            },
          )
          .setDescription(`${Help.embed.description}\n\n${commands.filter(e => e.name !== "reload").sort((a, b) => a.name.localeCompare(b.name)).map(n => `</${n.name}:${n.id}> - ${type === "de" ? n.descriptionLocalizations.de : type === "es" ? n.descriptionLocalizations["es-ES"] : n.description}`).join("\n")}`);

        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel(Help.button.title)
            .setStyle(5)
            .setEmoji('💫')
            .setURL('https://discord.gg/vMyXAxEznS'),
          new ButtonBuilder()
            .setLabel('Invite')
            .setStyle(5)
            .setEmoji('🤖')
            .setURL('https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=274878294080&scope=bot%20applications.commands'),
        );
        await interaction.reply({
          embeds: [helpembed],
          components: [button],
        }).catch((err) => { return; });
      });
  },
};
