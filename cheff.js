const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const config = require('./config.json');


const { fetch, Headers, Request, Response } = require('undici');
global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once('ready', () => {
    console.log(`Cheff Was Here! ${client.user.tag}`);
    client.user.setActivity('Cheff tarafından yapılmıştır ❤️', { type: 'PLAYING' });

    
    const guild = client.guilds.cache.get(config.guildId);
    const voiceChannel = guild.channels.cache.get(config.voiceChannelId);

    if (voiceChannel && voiceChannel.type === ChannelType.GuildVoice) {
        joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator
        });
        console.log('Ses kanalına katıldı!');
    } else {
        console.error('Ses kanalı bulunamadı veya geçerli değil.');
    }
});

client.on('guildMemberAdd', async member => {
    const role = member.guild.roles.cache.get(config.autoRoleId);
    const logChannel = member.guild.channels.cache.get(config.logChannelId);
    if (role) {
        try {
            await member.roles.add(role);
            console.log(`Yeni üye ${member.user.tag} rolü eklendi.`);

            if (logChannel) {
                logChannel.send(`Yeni üye ${member.user.tag} sunucuya katıldı ve ${role.name} rolü verildi.`);
            } else {
                console.error('Log kanalı bulunamadı.');
            }
        } catch (err) {
            console.error(`Yeni üye ${member.user.tag} rolü eklenirken hata oluştu:`, err);
        }
    } else {
        console.error('Otomatik rol bulunamadı.');
    }
});

client.login(config.token);
