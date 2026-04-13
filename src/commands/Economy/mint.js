const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mint')
    .setDescription('Mint money into a user account')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('User to give money to')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount to mint')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const target = interaction.options.getUser('target');
    const amount = interaction.options.getInteger('amount');

    if (amount <= 0) {
      return interaction.reply({ content: 'Amount must be greater than 0.', ephemeral: true });
    }

    // Example economy structure (adjust to your system)
    let userData = await client.db.get(`money_${target.id}`);

    if (!userData) {
      userData = 0;
    }

    userData += amount;

    await client.db.set(`money_${target.id}`, userData);

    await interaction.reply(`💰 Successfully minted **${amount}** coins to ${target.tag}.`);
  }
};
