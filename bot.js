const telegraf = require('telegraf')
const data = require('./data')
const bot = new telegraf(data.token)
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const randomstring = require('randomstring')
const session = require('telegraf/session')

bot.use(session())

bot.on('message', (ctx) => {
  ctx.session.options = data.defaultOptions

  let options = ctx.session.options
  ctx.reply(
    `Select options and tap "Generate". \n\nPresent options: \nLength: ${options.length}, \nSybmols: ${options.charset}, \nCase: ${options.casecapitalization}`, 
    data.markup
  )
})

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
    .catch((err) => console.log(err))
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
    .catch((err) => console.log(err))
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
    .catch((err) => console.log(err))
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
})

bot.startPolling()