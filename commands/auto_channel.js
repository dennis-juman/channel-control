let timeout

module.exports = {
  name: 'auto',
  execute (msg, args) {
    const channelLockCommand = msg.client.commands.get('lock')
    const channelUnlockCommand = msg.client.commands.get('unlock')
    const channel = msg.channel
    const channelID = '701506246125289572' // Raids
    const roleID = '708620404641497138'

    // Stop early if user doesn't meet these conditions
    if (channel.id !== channelID) return // Must be a specific channel
    if (!msg.member.roles.cache.some(role => role.id === roleID)) return // Must have a specific role

    // Unlock the channel
    channelUnlockCommand.execute(msg)

    // Lock the channel after the lockTime has been reached.
    if (timeout) {
      timeout.refresh()
    } else {
      timeout = setTimeout(() => {
        channelLockCommand.execute(msg)
        timeout = null
      }, 600000)
    }
  }
}
