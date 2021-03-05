'use strict';

const db = require('../adapters/db'),
    Discord = require('discord.js'),
    client = new Discord.Client();

//////////////////
//// ACTIONS /////
//////////////////
const { Server } = require("socket.io");

const io = new Server(process.env.DISCORD_PORT);
console.log(`[${new Date()}] Launching socket on ${process.env.DISCORD_PORT}`);

client.on('ready', () => {
    console.log('Bot initialised!');

    client.user.setActivity("Sitting here and taking it...", {
        type: "PLAYING"
    });

});

client.on('message', message => {

    if(message.author.bot) return;

    if (message.content === 'ping') {
        message.channel.send('pong');
    }

});

client.on('presenceUpdate', data => {

    io.emit('DISCORD_UPDATE_USERS');

});

client.on('voiceStateUpdate', data => {

    const user = client.users.cache.get(data.id);

    switch(data.guild.voiceStates.cache.get(data.id).channelID){
        case null:

            io.emit('DISCORD_UPDATE_USERS');

        break;
        default:
            if(data.guild.voiceStates.cache.get(data.id).selfMute && data.guild.channels.cache.get(data.guild.voiceStates.cache.get(data.id).channelID).name !== 'On Reddit, Shitting (Not really AFK)'){
                if (client.users.cache.get(data.id).username === "Sentinel") {

                    data.guild.members.cache.get(
                        data.id
                    )
                    .voice.setChannel(
                        data.guild.channels.cache.find(
                            channel => channel.name === 'On Reddit, Shitting (Not really AFK)'
                        )
                    );

                    const messageChannel = data.guild.channels.cache.find(
                        channel => channel.name === 'sloots'
                    );

                    messageChannel
                    .send(`${client.users.cache.get(data.id).username} Muted themselves... again.`)
                    .then(msg => msg.delete({timeout: 10000}))
                    .catch(e => console.log(e));

                    data.guild.members.cache.get(
                        data.id
                    ).send('**Steps to reconnect to the Voice Channel:**\n\r    *1. Disconnect from the Voice Channels completely.*\n\r    *2. Unmute yourself.*\n\r    *3. Click the Voice Channel to connect.*')
                    .catch(e => console.log(e));

                }

                io.emit('DISCORD_UPDATE_USERS');

                return io.emit('DISCORD_MUTE', {
                    user: client.users.cache.get(data.id).username,
                    channel: data.guild.channels.cache.get(data.guild.voiceStates.cache.get(data.id).channelID).name
                });

            } else {

                io.emit('DISCORD_UPDATE_USERS');

                return io.emit('DISCORD_CONNECTED', {
                    user: client.users.cache.get(data.id).username,
                    channel: data.guild.channels.cache.get(data.guild.voiceStates.cache.get(data.id).channelID).name
                });

            }

    }


});

client.login(process.env.DISCORD_KEY);

const listDiscord = async (req, res) => {

    let ser = client.guilds.cache.filter(guild =>
        guild.name === `#${req.swagger.params.channel.value.toUpperCase()}`
        ||
        guild.name === `#${req.swagger.params.channel.value}`
    );

    ser.id = ser.keys().next().value

    let ONLINE_USERS = client.guilds.cache.get(
        ser.id
    ).members.cache.filter(
        u => (u.presence.status === 'online') || (u.presence.status === 'idle')
    );

    let users_array = [];

    ONLINE_USERS.forEach(async user => {
        let username = user.nickname ? user.nickname : user.username;

        let userObject = {
            username: username,
            user: await client.users.fetch(user.id)
        }

        users_array.push(userObject);
    });

    let channels_array = [];

    let OPEN_CHANNELS = client.guilds.cache.get(
        ser.id
    ).channels.cache.filter(c =>
        (c.type !== "text")
        &&
        (c.name !== "Voice Channels" && c.name !== "Text Channels")
    );

    OPEN_CHANNELS.forEach(async channel => {
        let name = channel.name;
        let users_in_channel = [];

        await client.channels.cache.get(channel.id).members.forEach(async data => {

            let user = await client.users.fetch(data.id);
            user.nickname = data.nickname;
            return users_in_channel.push(user);

        });

        let channelObject = {
            name: name,
            channel: client.channels.cache.get(channel.id),
            users: users_in_channel
        }

        channels_array.push(channelObject);
    });

    res.json({
        server: ser,
        users: await users_array,
        channels: await channels_array
    });

};

//////////////////
//// HANDLER /////
//////////////////

const getDiscord = (req, res) => {
    return listDiscord(req, res);
};

module.exports = {
    getDiscord: getDiscord
};
