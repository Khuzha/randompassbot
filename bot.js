const telegraf = require('telegraf')
const mongo = require('mongodb').MongoClient
const data = require('./data')
const bot = new telegraf(data.token)
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const randomstring = require('randomstring')
const session = require('telegraf/session')
let db

mongo.connect(data.mongoLink, {useNewUrlParser: true}, (err, client) => {
  if (err) {
    sendError(err)
  }

  db = client.db('randompassbot')
  bot.startPolling()
})


bot.use(session())


bot.action(/setLength=[0-9]/, (ctx) => {
  ctx.answerCbQuery()
  let length = +ctx.update.callback_query.data.substr(10)

  if (ctx.session.options != undefined) {
    ctx.session.options.length = length
  } else {
    ctx.session.options = data.defaultOptions
  }

  let options = ctx.session.options

  ctx.editMessageText(
    `Select options and tap "Generate". \n\nPresent options: \nLength: ${options.length}, \nSybmols: ${options.charset}, \nCase: ${options.capitalization}`, 
    data.markup
  )
    .catch((err) => sendError(err, ctx))

  updateUser(ctx)
})

bot.action(/setType=*/, (ctx) => {
  ctx.answerCbQuery()

  if (ctx.session.options != undefined) {
    ctx.session.options.charset = ctx.update.callback_query.data.substr(8)
  } else {
    ctx.session.options = data.defaultOptions
  }

  let options = ctx.session.options
  
  ctx.editMessageText(
    `Select options and tap "Generate". \n\nPresent options: \nLength: ${options.length}, \nSybmols: ${options.charset}, \nCase: ${options.capitalization}`, 
    data.markup
  )
    .catch((err) => sendError(err, ctx))

  updateUser(ctx)
})

bot.action(/setCase=*/, (ctx) => {
  ctx.answerCbQuery()

  if (ctx.session.options != undefined) {
    ctx.session.options.capitalization = ctx.update.callback_query.data.substr(8)
  } else {
    ctx.session.options = data.defaultOptions
  }

  let options = ctx.session.options

  ctx.editMessageText(
    `Select options and tap "Generate". \n\nPresent options: \nLength: ${options.length}, \nSybmols: ${options.charset}, \nCase: ${options.capitalization}`, 
    data.markup
  )
    .catch((err) => sendError(err, ctx))

  updateUser(ctx)
})

bot.action(/generate=*/, (ctx) => {
  ctx.answerCbQuery()

  let options = ctx.session.options
  options == undefined ? options = data.defaultOptions : false
  options.charset == 'any' ? options.charset = data.anyCharsString : false
  options.capitalization == 'any' ? options.capitalization = null : false

  let text = ctx.update.callback_query.message.text

  if (!text.includes('Your password:')) {
    ctx.editMessageText(text + `\n\nYour password: <code>${randomstring.generate(options)}</code>`, data.markup)
  } else {
    text = text.replace(text.substr(text.indexOf('\n\nYour password:')), `\n\nYour password: <code>${randomstring.generate(options)}</code>`)
    ctx.editMessageText(text, data.markup)
  }

  options.charset == data.anyCharsString ? options.charset = 'any' : false
  options.capitalization == null ? options.capitalization = 'any' : false

  updateUser(ctx)
})

bot.command('users', async (ctx) => {
  let allUsers = await db.collection('allUsers').find({}).toArray()
  let activeUsers = 0
  let blockedUsers = 0

  for (let key of allUsers) {
    await bot.telegram.sendChatAction(key.userId, 'typing')
      .then((res) => {
        activeUsers++
        console.log(key)
      })
      .catch((err) => {
        blockedUsers++
        db.collection('allUsers').updateOne({userId: key.userId}, {$set: {status: 'blocked'}}, {upsert: true})
      })
  }

  ctx.reply(
    `⭕️ Total users: ${allUsers.length} ` +
    `\n✅ Active users: ${activeUsers} - ${Math.round((activeUsers / allUsers.length) * 100)}%` +
    `\n❌ Blocked users: ${blockedUsers} - ${Math.round((blockedUsers / allUsers.length) * 100)}%`
  )
})

bot.on('message', (ctx) => {
  ctx.session.options = data.defaultOptions

  let options = ctx.session.options
  ctx.reply(
    `Select options and tap "Generate". \n\nPresent options: \nLength: ${options.length}, \nSybmols: ${options.charset}, \nCase: ${options.casecapitalization}`, 
    data.markup
  )

  for (let i = ctx.message.message_id; i > ctx.message.message_id - 15; i--) {
    bot.telegram.deleteMessage(ctx.chat.id, i)
      .catch((err) => {
        if (err.code == 400) {
          return
        }
        sendError(err, ctx)
      })
  }

  updateUser(ctx)
})


function sendError (err, ctx) {
  // console.log(err.toString())
  if (err.toString().includes('message is not modified')) {
    return
  }
  bot.telegram.sendMessage(data.dev, `Ошибка у [${ctx.from.first_name}](tg://user?id=${ctx.from.id}) \n\nОшибка: ${err}`)
}

function updateUser (ctx) {
  db.collection('allUsers').updateOne({userId: ctx.from.id}, {$set: {status: 'active'}}, {upsert: true, new: true})
}