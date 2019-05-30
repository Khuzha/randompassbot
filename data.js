module.exports = {
  token: 'string', // token from @BotFather
  dev: 123456789, // developer`s id for sending him/her errors
  mongoLink: 'key', // mongo-link from cloud.mongodb.com

  anyCharsString: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+=-"/\\`~><?^,.',

  markup: { parse_mode: 'html', reply_markup: { inline_keyboard: [
    [{text: '🔢 8', callback_data: 'setLength=8'}, {text: '🔢 16', callback_data: 'setLength=16'}, {text: '🔢 32', callback_data: 'setLength=32'}, {text: '🔢 64', callback_data: 'setLength=64'}],
    [{text: '🆎 A-Z', callback_data: 'setType=alphabetic'}, {text: '🆎 0-9', callback_data: 'setType=numeric'}],
    [{text: '🆎 A-Z, 0-9', callback_data: 'setType=alphanumeric'}, {text: '🆎 Any', callback_data: 'setType=any'}],
    [{text: '↕️ low', callback_data: 'setCase=lowercase'}, {text: '↕️ UP', callback_data: 'setCase=uppercase'}, {text: '↕️ AnY', callback_data: 'setCase=any'}],
    [{text: '✅ Generate', callback_data: `generate`}]
  ] } },

  defaultOptions: {
    length: 32,
    charset: 'any',
    casecapitalization: 'any'
  }
}