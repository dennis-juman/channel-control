// Requires
require('dotenv').config()
const Discord = require('discord.js')
const { prefix } = require('./config.json')
const fs = require('fs')

// Create bot
const client = new Discord.Client()
client.login(process.env.TOKEN)

// Check if bot is online
client.once('ready', () => console.log('Ready!'))

// Read and store command modules
const commandFilenames = fs.readdirSync('./commands').filter(commandFile => commandFile.endsWith('.js'))

// Create command Collection to store/retrieve commands quickly
client.commands = new Discord.Collection()
commandFilenames.map(commandFilename => {
  // Try loading the commands files and inserting them into the Collection
  const command = require(`./commands/${commandFilename}`)
  client.commands.set(command.name, command)
})

// Message event listener
client.on('message', msg => {
  client.commands.get('auto').execute(msg)

  // Parse message
  const args = msg.content.split(/ +/)
  const commandName = args.shift().slice(prefix.length)

  // MVC controller for command handling
  const command = client.commands.get(commandName) || client.commands.find(command => command.aliases && command.aliases.includes(commandName))
  if (!command) return // Stop early if command has falsey-value

  // Check if user has authorization to use the command
  if (command.permission && !msg.member.roles.cache.some(role => role.id === command.permission)) {
    return msg.channel.send(`You do not have authorization to execute this command ${msg.author.username}.`)
  }

  // Try to execute the command
  try {
    command.execute(msg, args)
  } catch (err) {
    console.error(err)
    msg.channel.send(`Error! Command could not be executed ${msg.author.username}.`)
  }
})
