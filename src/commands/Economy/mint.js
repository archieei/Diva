const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mint')
        .setDescription('Mint money into a user account')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to give money to')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of money to mint')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, client) {
        const target = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        // ❌ Prevent bad values
        if (amount <= 0) {
            return interaction.reply({
                content: '❌ Amount must be greater than 0.',
                ephemeral: true
            });
        }

        // 🔹 Get current balance (TitanBot style key)
        const key = `balance_${target.id}`;
        let balance = await client.db.get(key);

        if (!balance) balance = 0;

        // ➕ Add money
        balance += amount;

        // 💾 Save back to DB
        await client.db.set(key, balance);

        // ✅ Confirm
        await interaction.reply({
            content: `💰 Successfully minted **${amount}** coins to **${target.tag}**.\nNew balance: **${balance}**`,
        });
    }
};
