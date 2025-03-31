const token = "7818062489:AAEh3vbk2z212B2Yls-aP6znsu-zcRa6Vc8";

const TelegramBot = require("node-telegram-bot-api");
const { Network } = require("./network/net");

const bot = new TelegramBot(token, { polling: true });
const network = new Network();

bot.on("message", async (message) => {
    if (message.text.startsWith("/start") || message.text.startsWith("/help")){
        await bot.sendMessage(message.chat.id,
            "[ ♻ ] - ربات پاسخگو و آنلاینه\n[ 📃 ] - نحوه کار با بات رو از طریق دکمه زبر مطالعه کنید",
            {
                reply_to_message_id: message.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "نحوه کار 🔐",
                                callback_data: `help_${message.from.id}`
                            }
                        ],
                        [
                            {
                                text: "بستن ♦",
                                callback_data: `close_${message.from.id}`
                            }
                        ]
                    ]
                }
            }
        )
    } else if (message.text.startsWith("/check")){
        if (message.reply_to_message){
            await bot.sendMessage(
                message.chat.id,
                "[ 🎛 ] - آیا از انتخاب خود اطمینان دارید ؟",
                {
                    reply_to_message_id: message.message_id,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "خیر ❌",
                                    callback_data: `close_${message.from.id}`
                                },
                                {
                                    text: "تایید ✅",
                                    callback_data: `accept_${message.from.id}_${message.reply_to_message.text}`
                                }
                            ]
                        ]
                    }
                }
            )
        } else {
            await bot.sendMessage(
                message.chat.id,
                "[ ❌ ] - پیام ریپلای شده پیدا نشد",
                {
                    reply_to_message_id: message.message_id,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "بستن ❌",
                                    callback_data: `close_${message.from.id}`
                                }
                            ]
                        ]
                    }
                }
            )
        }
    } else if (message.text.startsWith("/trans")){
        if (message.reply_to_message){
            await bot.sendMessage(
                message.chat.id,
                "[ 🎛 ] - آیا از انتخاب خود اطمینان دارید ؟",
                {
                    reply_to_message_id: message.message_id,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "خیر ❌",
                                    callback_data: `close_${message.from.id}`
                                },
                                {
                                    text: "تایید ✅",
                                    callback_data: `trns_${message.from.id}`
                                }
                            ]
                        ]
                    }
                }
            )
        } else {
            await bot.sendMessage(
                message.chat.id,
                "[ ❌ ] - پیام ریپلای شده پیدا نشد",
                {
                    reply_to_message_id: message.message_id,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "بستن ❌",
                                    callback_data: `close_${message.from.id}`
                                }
                            ]
                        ]
                    }
                }
            )
        }
    }
})

bot.on("callback_query", async (call) => {
    if (call.data.startsWith("close")){
        const spl = call.data.split("_");
        const uid = parseInt(spl[1]);
        if (uid === call.from.id){
            await bot.deleteMessage(call.message.chat.id, call.message.message_id);
        }
    } else if (call.data.startsWith("help")){
        const spl = call.data.split("_");
        const uid = parseInt(spl[1]);
        if (uid === call.from.id){
            await bot.editMessageText(
                "[ 🎾 ] - برای گرفتن اطلاعات اکانت از طریق هش, هش رو ارسال کرده و دستور /check رو ریپلای کنید\n\n[ 👁 ] - برای دیدن اطلاعات هش تراکنش, هش رو ارسال کرده و کلمه /trans رو ریپلای کنید",
                {
                    chat_id: call.message.chat.id,
                    message_id: call.message.message_id,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "بستن ♦",
                                    callback_data: `close_${call.from.id}`
                                }
                            ]
                        ]
                    }
                }
            )
        }
    } else if (call.data.startsWith("accept")){
        const spl = call.data.split("_");
        const uid = parseInt(spl[1]);
        if (!call.message.reply_to_message){
            await bot.sendMessage(
                message.chat.id,
                "[ ❌ ] - از پاک کردن پیام خود خودداری کنید",
                {
                    reply_to_message_id: message.message_id,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "بستن ❌",
                                    callback_data: `close_${message.from.id}`
                                }
                            ]
                        ]
                    }
                }
            )
        } else {
            const hash = call.message.reply_to_message.text;
            if (uid === call.from.id){
                await network.getAccountInfo(hash, async (account) => {
                    if (account.balance === undefined && account.transactions_in === undefined && account.transactions_out === undefined){
                        await bot.editMessageText(
                            "[ ❌ ] - هش اشتباه وارد شده, دوباره تلاش کنید",
                            {
                                message_id: call.message.message_id,
                                chat_id: call.message.chat.id,
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            {
                                                text: "بستن ♦",
                                                callback_data: `close_${call.from.id}`
                                            }
                                        ]
                                    ]
                                }
                            }
                        )
                    } else {
                        let date = new Date(account.date_created);
                        await bot.editMessageText(
                            `[ 🔓 ] - هش: <code>${hash}</code>\n\n[ 🍧 ] - اسم: <code>${account.name}</code>\n[ 📪 ] - بالانس: ${account.balance}\n\n[ ⌛ ] - ساخته شده در ${date.getFullYear()}/${date.getMonth()}/${date.getDay()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}\n[ 🛰 ] - <a href="https://tronscan.org/#/address/${hash}">لینک آدرس</a>`,
                            {
                                message_id: call.message.message_id,
                                chat_id: call.message.chat.id,
                                parse_mode: "HTML",
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            {
                                                text: "بستن ♦",
                                                callback_data: `close_${call.from.id}`
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
    } else if (call.data.startsWith("trns")){
        const spl = call.data.split("_");
        const uid = parseInt(spl[1]);
        if (!call.message.reply_to_message){
            await bot.sendMessage(
                message.chat.id,
                "[ ❌ ] - از پاک کردن پیام خود خودداری کنید",
                {
                    reply_to_message_id: message.message_id,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "بستن ❌",
                                    callback_data: `close_${message.from.id}`
                                }
                            ]
                        ]
                    }
                }
            )
        } else {
            const hash = call.message.reply_to_message.text;
            if (uid === call.from.id){
                await network.getTransactionInfo(hash, async (trans) => {
                    if (trans.balance === undefined && trans.toAddress === undefined && trans.ownerAddress === undefined){
                        await bot.editMessageText(
                            "[ ❌ ] - هش اشتباه وارد شده, دوباره تلاش کنید",
                            {
                                message_id: call.message.message_id,
                                chat_id: call.message.chat.id,
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            {
                                                text: "بستن ♦",
                                                callback_data: `close_${call.from.id}`
                                            }
                                        ]
                                    ]
                                }
                            }
                        )
                    } else {
                        let conts = [];
                        let date = new Date(trans.timestamp);
                        for (let cont of trans.contracts){
                            conts.push(`<code>${cont}</code>`)
                        }
                        await bot.editMessageText(
                            `[ 🕹 ] - هش: <code>${hash}</code>\n\n[ 🎛 ] - <code>${trans.confirmed === true ? "تایید شده ✅" : "تایید نشده ❌"}</code>\n[ 📪 ] - بالانس: ${trans.balance}\n\n[ 👥 ] - شرکت کنندگان ${JSON.stringify(conts, null, 2)}\n[ ⌛ ] - ساخته شده در ${date.getFullYear()}/${date.getMonth()}/${date.getDay()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}\n\n[ 🎫 ] - از سمت <code>${trans.ownerAddress}</code>\n[ 🎟 ] - ارسال به <code>${trans.toAddress}</code>\n[ 🛰 ] - <a href="${trans.urlHash}">لینک تراکنش</a>`,
                            {
                                message_id: call.message.message_id,
                                chat_id: call.message.chat.id,
                                parse_mode: "HTML",
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            {
                                                text: "بستن ♦",
                                                callback_data: `close_${call.from.id}`
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
    }

})