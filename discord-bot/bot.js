const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Bot configuration
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages
  ]
});

// Data storage (in production, use a real database)
const DATA_FILE = path.join(__dirname, 'bot-data.json');

// Initialize data
let botData = {
  inviteCodes: [],
  linkedAccounts: [],
  stats: {
    totalCodes: 0,
    totalLinks: 0
  }
};

// Load existing data
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      botData = JSON.parse(raw);
      console.log('📊 Data loaded successfully');
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Save data
function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(botData, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Generate random invite code
function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Register slash commands
async function registerCommands() {
  const commands = [
    new SlashCommandBuilder()
      .setName('gen')
      .setDescription('Generate an invitation code for GitUp')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    new SlashCommandBuilder()
      .setName('genfor')
      .setDescription('Generate an invitation code for a specific user')
      .addUserOption(option =>
        option.setName('user')
          .setDescription('User to generate code for')
          .setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    new SlashCommandBuilder()
      .setName('link')
      .setDescription('Link your Discord account to GitUp')
      .addStringOption(option =>
        option.setName('code')
          .setDescription('Your invite code from GitUp')
          .setRequired(true)),
    
    new SlashCommandBuilder()
      .setName('me')
      .setDescription('View your GitUp profile and stats'),
    
    new SlashCommandBuilder()
      .setName('codes')
      .setDescription('List all generated invitation codes')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    new SlashCommandBuilder()
      .setName('revoke')
      .setDescription('Revoke an unused invitation code')
      .addStringOption(option =>
        option.setName('code')
          .setDescription('Code to revoke')
          .setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    new SlashCommandBuilder()
      .setName('stats')
      .setDescription('View GitUp bot statistics')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  ].map(command => command.toJSON());

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log('🔄 Registering slash commands...');
    
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands }
    );

    console.log('✅ Slash commands registered successfully!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

// Bot ready event
client.once('ready', async () => {
  console.log('🤖 GitUp Bot is online!');
  console.log(`📝 Logged in as ${client.user.tag}`);
  console.log(`🌐 Serving ${client.guilds.cache.size} servers`);
  
  loadData();
  await registerCommands();
  
  client.user.setActivity('gitup.dev | /gen', { type: 'WATCHING' });
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, user } = interaction;

  try {
    // Command: /gen - Generate invite code
    if (commandName === 'gen') {
      const code = generateCode();
      
      const newCode = {
        code: code,
        generatedBy: user.id,
        generatedAt: new Date().toISOString(),
        used: false,
        usedBy: null,
        usedAt: null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      };

      botData.inviteCodes.push(newCode);
      botData.stats.totalCodes++;
      saveData();

      const embed = new EmbedBuilder()
        .setColor(0x06B6D4)
        .setTitle('🎫 Invitation Code Generated!')
        .setDescription(`A new invitation code has been created.`)
        .addFields(
          { name: '🔑 Code', value: `\`${code}\``, inline: true },
          { name: '⏰ Expires', value: `<t:${Math.floor(new Date(newCode.expiresAt).getTime() / 1000)}:R>`, inline: true },
          { name: '🔗 Use on', value: '[GitUp Website](https://gitup.dev)', inline: false }
        )
        .setFooter({ text: `Generated by ${user.username}`, iconURL: user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });

      // Send DM to admin
      try {
        await user.send({ embeds: [embed] });
      } catch (err) {
        console.log('Could not send DM to user');
      }
    }

    // Command: /genfor - Generate code for specific user
    else if (commandName === 'genfor') {
      const targetUser = interaction.options.getUser('user');
      const code = generateCode();
      
      const newCode = {
        code: code,
        generatedBy: user.id,
        generatedFor: targetUser.id,
        generatedAt: new Date().toISOString(),
        used: false,
        usedBy: null,
        usedAt: null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      botData.inviteCodes.push(newCode);
      botData.stats.totalCodes++;
      saveData();

      const embed = new EmbedBuilder()
        .setColor(0x06B6D4)
        .setTitle('🎫 Personal Invitation Code Generated!')
        .setDescription(`An invitation code has been created for **${targetUser.username}**.`)
        .addFields(
          { name: '🔑 Code', value: `\`${code}\``, inline: true },
          { name: '👤 For', value: `<@${targetUser.id}>`, inline: true },
          { name: '⏰ Expires', value: `<t:${Math.floor(new Date(newCode.expiresAt).getTime() / 1000)}:R>`, inline: true }
        )
        .setFooter({ text: `Generated by ${user.username}`, iconURL: user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });

      // Send code to target user via DM
      try {
        const userEmbed = new EmbedBuilder()
          .setColor(0x06B6D4)
          .setTitle('🎉 You received a GitUp invitation!')
          .setDescription(`**${user.username}** has sent you an invitation code to join GitUp!`)
          .addFields(
            { name: '🔑 Your Code', value: `\`${code}\``, inline: false },
            { name: '📝 How to use', value: '1. Go to [GitUp](https://gitup.dev)\n2. Click "Get Started"\n3. Enter your code\n4. Create your account!', inline: false },
            { name: '⏰ Valid until', value: `<t:${Math.floor(new Date(newCode.expiresAt).getTime() / 1000)}:F>`, inline: false }
          )
          .setFooter({ text: 'GitUp - Share. Build. Create.' })
          .setTimestamp();

        await targetUser.send({ embeds: [userEmbed] });
        
        await interaction.followUp({ content: `✅ Code sent to ${targetUser.username} via DM!`, ephemeral: true });
      } catch (err) {
        await interaction.followUp({ content: `⚠️ Could not send DM to ${targetUser.username}. Make sure they have DMs enabled!`, ephemeral: true });
      }
    }

    // Command: /link - Link Discord to GitUp account
    else if (commandName === 'link') {
      const code = interaction.options.getString('code').toUpperCase();
      
      // Check if code exists and is valid
      const inviteCode = botData.inviteCodes.find(c => c.code === code);
      
      if (!inviteCode) {
        const errorEmbed = new EmbedBuilder()
          .setColor(0xEF4444)
          .setTitle('❌ Invalid Code')
          .setDescription('This invitation code does not exist.')
          .setFooter({ text: 'Contact an admin for a valid code' });
        
        return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }

      if (inviteCode.used) {
        const errorEmbed = new EmbedBuilder()
          .setColor(0xEF4444)
          .setTitle('❌ Code Already Used')
          .setDescription('This invitation code has already been used.')
          .addFields(
            { name: 'Used by', value: inviteCode.usedBy ? `<@${inviteCode.usedBy}>` : 'Unknown', inline: true },
            { name: 'Used at', value: inviteCode.usedAt ? `<t:${Math.floor(new Date(inviteCode.usedAt).getTime() / 1000)}:R>` : 'Unknown', inline: true }
          );
        
        return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }

      if (new Date(inviteCode.expiresAt) < new Date()) {
        const errorEmbed = new EmbedBuilder()
          .setColor(0xEF4444)
          .setTitle('❌ Code Expired')
          .setDescription('This invitation code has expired.')
          .setFooter({ text: 'Request a new code from an admin' });
        
        return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }

      // Check if user already linked
      const existingLink = botData.linkedAccounts.find(l => l.discordId === user.id);
      
      if (existingLink) {
        const errorEmbed = new EmbedBuilder()
          .setColor(0xF59E0B)
          .setTitle('⚠️ Already Linked')
          .setDescription('Your Discord account is already linked to GitUp!')
          .addFields(
            { name: 'Linked since', value: `<t:${Math.floor(new Date(existingLink.linkedAt).getTime() / 1000)}:R>`, inline: true }
          );
        
        return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }

      // Mark code as used and create link
      const codeIndex = botData.inviteCodes.findIndex(c => c.code === code);
      botData.inviteCodes[codeIndex].used = true;
      botData.inviteCodes[codeIndex].usedBy = user.id;
      botData.inviteCodes[codeIndex].usedAt = new Date().toISOString();

      botData.linkedAccounts.push({
        discordId: user.id,
        discordUsername: user.username,
        linkedAt: new Date().toISOString(),
        inviteCode: code
      });

      botData.stats.totalLinks++;
      saveData();

      const successEmbed = new EmbedBuilder()
        .setColor(0x10B981)
        .setTitle('✅ Account Linked Successfully!')
        .setDescription('Your Discord account has been linked to GitUp!')
        .addFields(
          { name: '🎉 What\'s next?', value: 'You can now login to GitUp using "Continue with Discord"!', inline: false },
          { name: '🔗 Website', value: '[Go to GitUp](https://gitup.dev)', inline: false }
        )
        .setFooter({ text: `Welcome to the community, ${user.username}!`, iconURL: user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [successEmbed], ephemeral: true });

      // Welcome DM
      try {
        const welcomeEmbed = new EmbedBuilder()
          .setColor(0x06B6D4)
          .setTitle('🎊 Welcome to GitUp!')
          .setDescription('Your account is now ready. Here\'s what you can do:')
          .addFields(
            { name: '📤 Upload Projects', value: 'Share your amazing work with the community', inline: false },
            { name: '🌟 Discover', value: 'Explore projects from other creators', inline: false },
            { name: '💬 Connect', value: 'Join our community of builders', inline: false },
            { name: '🤖 Bot Commands', value: '`/me` - View your stats\n`/projects` - See your projects', inline: false }
          )
          .setFooter({ text: 'Happy building! 🚀' });

        await user.send({ embeds: [welcomeEmbed] });
      } catch (err) {
        console.log('Could not send welcome DM');
      }
    }

    // Command: /me - View profile
    else if (commandName === 'me') {
      const linkedAccount = botData.linkedAccounts.find(l => l.discordId === user.id);
      
      if (!linkedAccount) {
        const errorEmbed = new EmbedBuilder()
          .setColor(0xF59E0B)
          .setTitle('⚠️ Not Linked')
          .setDescription('Your Discord account is not linked to GitUp yet.')
          .addFields(
            { name: '🔗 How to link', value: 'Use `/link <code>` with your invitation code', inline: false }
          );
        
        return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }

      const profileEmbed = new EmbedBuilder()
        .setColor(0x8B5CF6)
        .setTitle(`${user.username}'s GitUp Profile`)
        .setThumbnail(user.displayAvatarURL())
        .addFields(
          { name: '🔗 Status', value: '✅ Linked', inline: true },
          { name: '📅 Member since', value: `<t:${Math.floor(new Date(linkedAccount.linkedAt).getTime() / 1000)}:R>`, inline: true },
          { name: '🎫 Invite Code', value: `\`${linkedAccount.inviteCode}\``, inline: true },
          { name: '🌐 Website', value: '[View on GitUp](https://gitup.dev)', inline: false }
        )
        .setFooter({ text: 'GitUp - Share. Build. Create.' })
        .setTimestamp();

      await interaction.reply({ embeds: [profileEmbed], ephemeral: true });
    }

    // Command: /codes - List all codes (admin only)
    else if (commandName === 'codes') {
      const activeCodes = botData.inviteCodes.filter(c => !c.used && new Date(c.expiresAt) > new Date());
      const usedCodes = botData.inviteCodes.filter(c => c.used);
      const expiredCodes = botData.inviteCodes.filter(c => !c.used && new Date(c.expiresAt) <= new Date());

      const embed = new EmbedBuilder()
        .setColor(0x06B6D4)
        .setTitle('📋 Invitation Codes Overview')
        .addFields(
          { name: '✅ Active Codes', value: activeCodes.length > 0 ? activeCodes.map(c => `\`${c.code}\` - Expires <t:${Math.floor(new Date(c.expiresAt).getTime() / 1000)}:R>`).join('\n') : 'None', inline: false },
          { name: '✔️ Used Codes', value: `${usedCodes.length} codes used`, inline: true },
          { name: '❌ Expired Codes', value: `${expiredCodes.length} codes expired`, inline: true },
          { name: '📊 Total Generated', value: `${botData.stats.totalCodes} codes`, inline: true }
        )
        .setFooter({ text: `Requested by ${user.username}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Command: /revoke - Revoke a code
    else if (commandName === 'revoke') {
      const code = interaction.options.getString('code').toUpperCase();
      const codeIndex = botData.inviteCodes.findIndex(c => c.code === code);

      if (codeIndex === -1) {
        const errorEmbed = new EmbedBuilder()
          .setColor(0xEF4444)
          .setTitle('❌ Code Not Found')
          .setDescription('This code does not exist in the database.');
        
        return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }

      const inviteCode = botData.inviteCodes[codeIndex];

      if (inviteCode.used) {
        const errorEmbed = new EmbedBuilder()
          .setColor(0xEF4444)
          .setTitle('❌ Cannot Revoke')
          .setDescription('This code has already been used and cannot be revoked.');
        
        return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }

      // Remove the code
      botData.inviteCodes.splice(codeIndex, 1);
      saveData();

      const successEmbed = new EmbedBuilder()
        .setColor(0x10B981)
        .setTitle('✅ Code Revoked')
        .setDescription(`Invitation code \`${code}\` has been revoked successfully.`);

      await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    }

    // Command: /stats - Bot statistics
    else if (commandName === 'stats') {
      const activeCodes = botData.inviteCodes.filter(c => !c.used && new Date(c.expiresAt) > new Date()).length;
      
      const embed = new EmbedBuilder()
        .setColor(0x8B5CF6)
        .setTitle('📊 GitUp Bot Statistics')
        .addFields(
          { name: '🎫 Total Codes Generated', value: `${botData.stats.totalCodes}`, inline: true },
          { name: '✅ Active Codes', value: `${activeCodes}`, inline: true },
          { name: '🔗 Linked Accounts', value: `${botData.stats.totalLinks}`, inline: true },
          { name: '👥 Total Users', value: `${botData.linkedAccounts.length}`, inline: true },
          { name: '🌐 Servers', value: `${client.guilds.cache.size}`, inline: true },
          { name: '⏰ Uptime', value: `${Math.floor(client.uptime / 1000 / 60)} minutes`, inline: true }
        )
        .setFooter({ text: 'GitUp Bot v1.0' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

  } catch (error) {
    console.error('Error handling command:', error);
    
    const errorEmbed = new EmbedBuilder()
      .setColor(0xEF4444)
      .setTitle('❌ Error')
      .setDescription('An error occurred while processing your command. Please try again later.');

    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
    } else {
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
});

// Error handling
process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

client.on('error', error => {
  console.error('Discord client error:', error);
});

// Login
client.login(process.env.DISCORD_TOKEN);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down bot...');
  saveData();
  client.destroy();
  process.exit(0);
});
