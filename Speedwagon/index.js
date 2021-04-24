// To Run: npm run dev

require("dotenv").config()
const {prefix, folder} = require('./config.json')
const {Client, MessageAttachment, MessageEmbed} = require("discord.js")
const client = new Client()
const fs = require('fs');

// return a random number from 1 to n
function roll_die(n) {
  return Math.floor(Math.random() * n) + 1;
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("reconnecting", () => {
  console.log(`Reconnecting user ${client.user.tag} `)
})

client.on('disconnect', () => {
  console.log(`Disconnecting user ${client.user.tag} `);
});

client.on('message', message => {
  // Ping Pong
  if (message.content === "ping") {
    message.reply("Pong!")
  }

  // React with Elbuluk if he comes up
  if(message.content.includes('Elbuluk')) { // Elbuluk unicode emoji
    //message.react(':Elbuluk:415225854747082762'); // for Hunter server
    message.react(':Elbuluk:835337853201416212');
  }

  // Say something if JoJo's comes up
  if(message.content.includes('JoJo')) {
    if (message.author.bot) return;
    message.reply("He and Dio spent their youth together. Dio was like a brother to him. But as for me, I'll be singing in praise. Baron Zepelli, do you see? JoJo did it! Dio's dead! It may be an exaggeration, but JoJo saved the world this night!");
    console.log("They're talking about JoJo's again...")
  }

  // Say something if Dio comes up
  if(message.content.includes('Dio')) {
    if (message.author.bot) return;
    message.reply("He is PURE EVIL, right down to his very bones! Is he a victim of circumstance, you're wondering? Not on your life! He's been evil since he drew his first breath!");
    console.log("They're talking about Dio again...")
  }

  // Say something if "the world" comes up
  if(message.content.includes('the world')) {
    if (message.author.bot) return;
    folderIndex = folder.indexOf('Dio'); // go to the folder with the same name as the command

    fs.readdir('./' + folder[folderIndex], (err, files) => { // get all files in the directory
      message.channel.send( {files: ["./" + folder[folderIndex] + "\\" + "za_warudo.gif"]} )
    });
  }

  // Say something if "congratulations" comes up
  if(message.content.includes('congratulations')) {
    if (message.author.bot) return;
    folderIndex = folder.indexOf('Reactions'); // go to the folder with the same name as the command

    fs.readdir('./' + folder[folderIndex], (err, files) => { // get all files in the directory
      message.channel.send( {files: ["./" + folder[folderIndex] + "\\" + "congratulations.gif"]} )
    });
  }


  // COMMAND INTERPRETATION
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  } else {
    // Create an args variable that slices off the prefix entirely,
    // removes the leftover whitespaces and then splits it into an array by spaces
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    // for image sending (access filesystem)
    var number = -1; 
    var dir = -1; 

    // ROLL COMMAND
    if (command === 'roll') {
      if (!args.length) { // nest cascading arguments
        var roll_result = roll_die(6)
        message.reply(`Rolled: ${roll_result}\n`);
        // return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
      } else if(Number.isInteger(parseInt(args[0]))) {
        var parsedInt = parseInt(args[0])
        if(100 < parsedInt) {
          message.reply(`I'm not wasting my time with anything above 100.`);
          return;
        } else if(parsedInt < 0) {
          message.reply(`Once you enlighten me on negative probability, I'll get right on that.`);
          return;
        } else {
          var roll_result = roll_die(parsedInt)
          message.reply(`Rolled: ${roll_result}\n`);
        }
      }
    } // end roll
    // FLIP COMMAND
    else if (command === 'flip') {
        var roll_result = roll_die(2)
        if(roll_result === 1) message.reply(`Heads`);
        else message.reply(`Tails`);
    } // end flip
    //ONLYPAIN COMMAND
    else if (command === 'onlypain') {
      // Create the attachment using MessageAttachment
      const attachment = new MessageAttachment('https://ih1.redbubble.net/image.1550218828.4942/st,small,845x845-pad,1000x1000,f8f8f8.jpg');
      // Send the attachment in the message channel
      message.channel.send(attachment);
    }
    // JOJO COMMAND
    else if (command === 'jojo') {
      folderIndex = folder.indexOf(command); // go to the folder with the same name as the command

      fs.readdir('./' + folder[folderIndex], (err, files) => { // get all files in the directory
        number = files.length;

        if (!args.length) { // if not specified, choose a random image from the folder
            chosenImage = files[ Math.floor(Math.random() * number)]; // choose a random image from the file list
        } else { // TODO: make sure entered arg is a number!
          imageNumber = args[0];
          if ((imageNumber < 0) || (number <= imageNumber)) { 
            return message.channel.send("Possible arguments: " + prefix + command + " [0-" + (number-1) + "].");
          } else {
            chosenImage = files[imageNumber];
          }
        }
        message.channel.send( {files: ["./" + folder[folderIndex] + "\\" + chosenImage]} )
      });
    } // end jojo
    
    // if (message.content.startsWith(`${prefix}play`)) {
    //   execute(message, serverQueue);
    //   return;
    // } else if (message.content.startsWith(`${prefix}skip`)) {
    //     skip(message, serverQueue);
    //     return;
    // } else if (message.content.startsWith(`${prefix}stop`)) {
    //     stop(message, serverQueue);
    //     return;
    // } else {
    //     message.channel.send("You need to enter a valid command!");
    // }

    // message.channel.send(`Command name: ${command}\nArguments: ${args}`);
  } // end prefix requirement
})

client.on("guildMemberAdd", (member) => {
  member.send(
    `Welcome to the world of pain.`
  )
})

client.login(process.env.BOT_TOKEN)