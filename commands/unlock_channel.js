
module.exports = {
  name: 'unlock',
  aliases: ['unlock-channel', 'channel-unlock', 'chunlock', 'cul'],
  permission: '701516879155429507', // OwnerID
  execute (msg, args) {
    const channel = msg.channel
    const roleID = '701519365383651338'
    const username = msg.author.username

    // Do nothing if the channel is already unlocked.
    if (channel.permissionOverwrites.find(memberRole => memberRole.id === roleID && memberRole.allow.has('SEND_MESSAGES'))) return

    // Search for the role before attempting to alter its permissions
    const role = msg.guild.roles.cache.get(roleID)
    if (!role) return channel.send(`Role could not be found ${username}.`)

    // Lock the channel.
    channel.updateOverwrite(role, { SEND_MESSAGES: true })
    return msg.channel.send(`This channel has now been unlocked ${username}.`)
  }
}
