const { default: axios } = require("axios");
const { Client, Intents, Channel } = require("discord.js");
const dotenv = require('dotenv');
const { token } = require("./config.json");
const tokenApi =
 process.env.TOKENWEATHER;

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

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
          "&lang=fr&appid="+tokenApi+"&units=metric"
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
  }
});

client.login(token);
