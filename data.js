module.exports = {
  token: 'string', // token from @BotFather
  
  anyCharsString: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+=-',

  markup: { parse_mode: 'html', reply_markup: { inline_keyboard: [
    [{text: '🔢 8', callback_data: 'setLength=8'}, {text: '🔢 16', callback_data: 'setLength=16'}, {text: '🔢 32', callback_data: 'setLength=32'}, {text: '🔢 64', callback_data: 'setLength=64'}],
    [{text: '🆎 Alphabetic', callback_data: 'setType=alphabetic'}, {text: '🆎 Numeric', callback_data: 'setType=numeric'}],
    [{text: '🆎 Alphanumeric', callback_data: 'setType=alphanumeric'}, {text: '🆎 Any characters', callback_data: 'setType=any'}],
    [{text: '↕️ lowercase', callback_data: 'setCase=lowercase'}, {text: '↕️ UPPERCASE', callback_data: 'setCase=uppercase'}, {text: '↕️ AnY', callback_data: 'setCase=any'}],
    [{text: '✅ Generate', callback_data: `generate`}]
  ] } },

  defaultOptions: {
    length: 32,
    charset: 'any',
    casecapitalization: 'any'
  }
}