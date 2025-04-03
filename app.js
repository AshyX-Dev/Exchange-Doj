const token = "7818062489:AAEh3vbk2z212B2Yls-aP6znsu-zcRa6Vc8";

const TelegramBot = require("node-telegram-bot-api");
const { Network } = require("./network/net");
const { Manager } = require("./manager");

const bot = new TelegramBot(token, { polling: true });
const network = new Network();
const axios = require("axios");

function makeShort(string){
    return string.replace(string.slice(5, 10), "[...]")
}

let transes = {};

bot.on("polling_error", (a) => {
    console.log(a.message);
})

bot.on("message", async (message) => {
    message.text === undefined ? message.text = "" : true;

    if (message.text.startsWith("استعلام")){
        if (message.reply_to_message){
            await axios.get(`https://api-steam.sbs/api/cardinfo/card.php?card=${message.reply_to_message.text}`).then(async (items) => {
                const _ = await items.data;
                if (_['status'] != 200){
                    await bot.sendMessage(
                        message.chat.id,
                        "[ ❌ ] - شماره کارت خود را چک کنید و دوباره تلاش کنید\n\n[ 👁 ] - چک کردن 16 رقمی بودن\n[ 🌐 ] - اطمینان از صحت آن",
                        {
                            reply_to_message_id: message.message_id,
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        {
                                            text: "close",
                                            callback_data: `close_${message.from.id}`
                                        }
                                    ]
                                ]
                            }
                        }
                    )
                } else {
                    await bot.sendMessage(
                        message.chat.id,
                        `
[ 🛰 ] - اسم <code>${_['data']['name']}</code>
[ 📐 ] - کارت <code>${_['data']['card']}</code>
[ 🎾 ] - شبا <code>${_['data']['shaba']}</code>
[ 🔐 ] - بانک <code>${_['data']['bank']}</code>
                        `,
                        {
                            reply_to_message_id: message.message_id,
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        {
                                            text: "close",
                                            callback_data: `close_${message.from.id}`
                                        }
                                    ]
                                ]
                            }
                        }
                    )
                }
            })
        }
    }
})

bot.on("callback_query", async (call) => {
    if (call.data.startsWith("close")){
        const spl = call.data.split("_");
        const uid = parseInt(spl[1]);
        if (call.from.id == uid){
            await bot.deleteMessage(
                call.message.chat.id,
                call.message.message_id
            )
        }
    }
})