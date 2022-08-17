const { default: axios } = require("axios");
const { Client, Intents, Channel } = require("discord.js");
const queue = new Map();
const { joinVoiceChannel } = require("@discordjs/voice") ;
const ytdl = require("ytdl-core");

const { prefix, token } = require("./config.json");
const tokenApi =
 process.env.TOKENWEATHER;

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


/*client.on('message', function() {
  if (message.content === "$loop") { 
    var interval = setInterval (function () {
      message.channel.send("123")
    }, 1 * 1000); 
  }
});*/

client.on("messageCreate", async (message) => {
  

  if (message.content == "lol") {
    message.channel.send("LUL");
  } 
  /*CLEAR CHANNEL MESSAGE */
  else if (message.content.startsWith("-clear")) {
    let args = message.content.split(" ").slice(1);
    await message.channel.bulkDelete(args[0]).then(() => {
      message.channel.send(
        `À ton service! Je t'ai supprimer ${args[0]} messages :D `
      );
      
    });
     
  }/*API REST FOR CITATION OF KAAMELOTT*/ 
  else if (message.content.startsWith("-citation")) {
    message.delete();
    await axios.get("https://kaamelott.chaudie.re/api/random").then((res) => {
      
      const citationAleatoire = JSON.stringify(res.data.citation.citation);
      const laCitation = citationAleatoire.split('"').slice(1);
      const info = JSON.stringify(res.data.citation.infos)
      const personnage = info.split(',').slice(2)
      console.log(personnage[0]);
      console.log(personnage);
      message.channel.send('La citation : ' +laCitation[0]+personnage[0]);
    });
  }
  /*API REST FOR WHEATHER  */
  else if (message.content.startsWith("-meteo")) {
    const ville = message.content.split(" ").slice(1);
    message.delete();
    await axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
          ville[0] +
          "&lang=fr&appid=4641b68bc0d3a841da8172c399ba6f27&units=metric"
          
      )
      .then((res) => {
        const meteo = res.data.weather;
        console.log(res.data)
        const prevition = JSON.stringify(meteo);
        const laMeteo = prevition.split('"');
        const temp = res.data.main.temp
        const tempMax = res.data.main.temp_max;
        message.channel.send(laMeteo[9] + " a " + ville + " La temperature est de : " + temp + " degres la temperature maximale sera de : " + tempMax);
        console.log(temp)
        
      });
  }});
  /*API NITRADO */
 /* client.on("ready" , async () => {
    setTimeout(() =>
    axios
    .get('https://api.nitrado.net/services/10985257/gameservers/games/players', {
      headers: {
        Authorization: 'Bearer TxMUyYFDClOMTKADpEe537fKQ7xD7aZfSFyeNB6kHWZS84HUrOR7Z47rLBeh_zaRoLxvPn-Rji6y4hvBto-7ASN_R69IX5nEy1UO',
      },
    }) 
     .then((res) => {
    
      
      const playerConnect = JSON.stringify(res.data.data.players)
      console.log(playerConnect)
       client.user.setActivity("Fumer une grosse batte");
     }), 100
     );  
    
  })*/
  /* COMMANDE PHILO */
  client.on('messageCreate', async (message) =>
  {
    if(message.content == '-philo') {
      const options = {
        method: 'GET',
        url: 'https://quotes15.p.rapidapi.com/quotes/random/',
        params: {language_code: 'fr'},
        headers: {
          'X-RapidAPI-Key': '04cafc3dc7mshf1ce316d6067b56p1b5296jsna9d21b0df8f9',
          'X-RapidAPI-Host': 'quotes15.p.rapidapi.com'
        }
      };
      
      axios.request(options).then(function (response) {

        const rep = JSON.stringify(response.data)
        const content = rep.split('"').slice(1)
        message.channel.send(content[8])
        console.log(rep);
      }).catch(function (error) {
        console.error(error);
      });
    }
  })

  /* COMMANDE MUSIQUE */
 /* client.on("messageCreate", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    const serverQueue = queue.get(message.guild.id);
  
    if (message.content.startsWith(`${prefix} play`)) {
      execute(message, serverQueue);
      return;
    } else if (message.content.startsWith(`${prefix} skip`)) {
      skip(message, serverQueue);
      return;
    } else if (message.content.startsWith(`${prefix} stop`)) {
      stop(message, serverQueue);
      return;
    } else {
      message.channel.send("You need to enter a valid command!");
    }
  });
  
  async function execute(message, serverQueue) {
    const args = message.content.split(" ");
  
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "Tu doit etre dans un channel vocale pour jouer la musique !"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "I need the permissions to join and speak in your voice channel!"
      );
    }
  
    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
     };
  
    if (!serverQueue) {
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      };
  
      queue.set(message.guild.id, queueContruct);
  
      queueContruct.songs.push(song);
  
      try {
        var connection = await joinVoiceChannel(
          {
              channelId: message.member.voice.channel,
              guildId: message.guild.id,
              adapterCreator: message.guild.voiceAdapterCreator
          });
        queueContruct.connection = connection;
        play(message.guild, queueContruct.songs[0]);
      } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
      }
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`${song.title} has been added to the queue!`);
    }
  }
  
  function skip(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    if (!serverQueue)
      return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
  }
  
  function stop(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
      
    if (!serverQueue)
      return message.channel.send("There is no song that I could stop!");
      
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }
  
  function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
  
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
  }*/

 




client.once("ready", () => {
  console.log("Ready!");
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } else {
    message.channel.send("You need to enter a valid command!");
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}


client.login(token);
