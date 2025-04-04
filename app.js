const token = "7818062489:AAGk_iW5eECDmT6mxQaA7HBBLb8J6Vwztg4";

const TelegramBot = require("node-telegram-bot-api");
const { Network } = require("./network/net");

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
                                            text: "𝙘𝙡𝙤𝙨𝙚",
                                            callback_data: `close_${message.from.id}`
                                        }
                                    ]
                                ]
                            }
                        }
                    )
                } else {
                    switch (_['data']['bank']){
                        case "ایران":
                            await bot.sendPhoto(
                                message.chat.id,
                                "iran.png",
                                {
                                    caption: `
[ 🕷 ] - <strong>اسم</strong>⊀ <code>${_['data']['name']}</code>
[ 🦋 ] - <strong>کارت</strong>⊀ <code>${_['data']['card']}</code>
[ 🕸 ] - <strong>شبا </strong>⊀ <code>${_['data']['shaba']}</code>
[ 🌊 ] - <strong>بانک</strong>⊀ <code>${_['data']['bank']}</code>
                        `,
                                    reply_to_message_id: message.message_id,
                                    parse_mode: "HTML",
                                    reply_markup: {
                                        inline_keyboard:
                                        [
                                            [
                                                {
                                                    text: "𝙖𝙙𝙙 𝙩𝙤 𝙜𝙧𝙤𝙪𝙥",
                                                    url: "http://t.me/ePrexTmbot?startgroup=new"
                                                }
                                            ],
                                            [
                                                {
                                                    text: "𝙘𝙡𝙤𝙨𝙚",
                                                    callback_data: `close_${message.from.id}`
                                                }
                                            ]
                                        ]
                                    }
                                }
                            );
                            break;
                        case "سامان":
                            case "ایران":
                            await bot.sendPhoto(
                                message.chat.id,
                                "saman.png",
                                {
                                    caption: `
[ 🕷 ] - <strong>اسم</strong>⊀ <code>${_['data']['name']}</code>
[ 🦋 ] - <strong>کارت</strong>⊀ <code>${_['data']['card']}</code>
[ 🕸 ] - <strong>شبا </strong>⊀ <code>${_['data']['shaba']}</code>
[ 🌊 ] - <strong>بانک</strong>⊀ <code>${_['data']['bank']}</code>
                        `,
                                    reply_to_message_id: message.message_id,
                                    parse_mode: "HTML",
                                    reply_markup: {
                                        inline_keyboard:
                                        [
                                            [
                                                {
                                                    text: "𝙖𝙙𝙙 𝙩𝙤 𝙜𝙧𝙤𝙪𝙥",
                                                    url: "http://t.me/ePrexTmbot?startgroup=new"
                                                }
                                            ],
                                            [
                                                {
                                                    text: "𝙘𝙡𝙤𝙨𝙚",
                                                    callback_data: `close_${message.from.id}`
                                                }
                                            ]
                                        ]
                                    }
                                }
                            );
                            break;
                        case "ملت":
                            await bot.sendPhoto(
                                message.chat.id,
                                "melat.jpg",
                                {
                                    caption: `
[ 🕷 ] - <strong>اسم</strong>⊀ <code>${_['data']['name']}</code>
[ 🦋 ] - <strong>کارت</strong>⊀ <code>${_['data']['card']}</code>
[ 🕸 ] - <strong>شبا </strong>⊀ <code>${_['data']['shaba']}</code>
[ 🌊 ] - <strong>بانک</strong>⊀ <code>${_['data']['bank']}</code>
                        `,
                                    reply_to_message_id: message.message_id,
                                    parse_mode: "HTML",
                                    reply_markup: {
                                        inline_keyboard:
                                        [
                                            [
                                                {
                                                    text: "𝙖𝙙𝙙 𝙩𝙤 𝙜𝙧𝙤𝙪𝙥",
                                                    url: "http://t.me/ePrexTmbot?startgroup=new"
                                                }
                                            ],
                                            [
                                                {
                                                    text: "𝙘𝙡𝙤𝙨𝙚",
                                                    callback_data: `close_${message.from.id}`
                                                }
                                            ]
                                        ]
                                    }
                                }
                            );
                            break;
                        case "صادرات":
                            await bot.sendPhoto(
                                message.chat.id,
                                "iran.png",
                                {
                                    caption: `
[ 🕷 ] - <strong>اسم</strong>⊀ <code>${_['data']['name']}</code>
[ 🦋 ] - <strong>کارت</strong>⊀ <code>${_['data']['card']}</code>
[ 🕸 ] - <strong>شبا </strong>⊀ <code>${_['data']['shaba']}</code>
[ 🌊 ] - <strong>بانک</strong>⊀ <code>${_['data']['bank']}</code>
                        `,
                                    reply_to_message_id: message.message_id,
                                    parse_mode: "HTML",
                                    reply_markup: {
                                        inline_keyboard:
                                        [
                                            [
                                                {
                                                    text: "𝙖𝙙𝙙 𝙩𝙤 𝙜𝙧𝙤𝙪𝙥",
                                                    url: "http://t.me/ePrexTmbot?startgroup=new"
                                                }
                                            ],
                                            [
                                                {
                                                    text: "𝙘𝙡𝙤𝙨𝙚",
                                                    callback_data: `close_${message.from.id}`
                                                }
                                            ]
                                        ]
                                    }
                                }
                            );
                            break;
                        case "پاسارگاد":
                            await bot.sendPhoto(
                                message.chat.id,
                                "pasargod.jpg",
                                {
                                    caption: `
[ 🕷 ] - <strong>اسم</strong>⊀ <code>${_['data']['name']}</code>
[ 🦋 ] - <strong>کارت</strong>⊀ <code>${_['data']['card']}</code>
[ 🕸 ] - <strong>شبا </strong>⊀ <code>${_['data']['shaba']}</code>
[ 🌊 ] - <strong>بانک</strong>⊀ <code>${_['data']['bank']}</code>
                        `,
                                    reply_to_message_id: message.message_id,
                                    parse_mode: "HTML",
                                    reply_markup: {
                                        inline_keyboard:
                                        [
                                            [
                                                {
                                                    text: "𝙖𝙙𝙙 𝙩𝙤 𝙜𝙧𝙤𝙪𝙥",
                                                    url: "http://t.me/ePrexTmbot?startgroup=new"
                                                }
                                            ],
                                            [
                                                {
                                                    text: "𝙘𝙡𝙤𝙨𝙚",
                                                    callback_data: `close_${message.from.id}`
                                                }
                                            ]
                                        ]
                                    }
                                }
                            );
                            break;
                        case "سپه":
                            await bot.sendPhoto(
                                message.chat.id,
                                "sepah.png",
                                {
                                    caption: `
[ 🕷 ] - <strong>اسم</strong>⊀ <code>${_['data']['name']}</code>
[ 🦋 ] - <strong>کارت</strong>⊀ <code>${_['data']['card']}</code>
[ 🕸 ] - <strong>شبا </strong>⊀ <code>${_['data']['shaba']}</code>
[ 🌊 ] - <strong>بانک</strong>⊀ <code>${_['data']['bank']}</code>
                        `,
                                    reply_to_message_id: message.message_id,
                                    parse_mode: "HTML",
                                    reply_markup: {
                                        inline_keyboard:
                                        [
                                            [
                                                {
                                                    text: "𝙖𝙙𝙙 𝙩𝙤 𝙜𝙧𝙤𝙪𝙥",
                                                    url: "http://t.me/ePrexTmbot?startgroup=new"
                                                }
                                            ],
                                            [
                                                {
                                                    text: "𝙘𝙡𝙤𝙨𝙚",
                                                    callback_data: `close_${message.from.id}`
                                                }
                                            ]
                                        ]
                                    }
                                }
                            );
                            break;
                        case "سرمایه":
                            await bot.sendPhoto(
                                message.chat.id,
                                "sarmaye.jfif",
                                {
                                    caption: `
[ 🕷 ] - <strong>اسم</strong>⊀ <code>${_['data']['name']}</code>
[ 🦋 ] - <strong>کارت</strong>⊀ <code>${_['data']['card']}</code>
[ 🕸 ] - <strong>شبا </strong>⊀ <code>${_['data']['shaba']}</code>
[ 🌊 ] - <strong>بانک</strong>⊀ <code>${_['data']['bank']}</code>
                        `,
                                    reply_to_message_id: message.message_id,
                                    parse_mode: "HTML",
                                    reply_markup: {
                                        inline_keyboard:
                                        [
                                            [
                                                {
                                                    text: "𝙖𝙙𝙙 𝙩𝙤 𝙜𝙧𝙤𝙪𝙥",
                                                    url: "http://t.me/ePrexTmbot?startgroup=new"
                                                }
                                            ],
                                            [
                                                {
                                                    text: "𝙘𝙡𝙤𝙨𝙚",
                                                    callback_data: `close_${message.from.id}`
                                                }
                                            ]
                                        ]
                                    }
                                }
                            );
                            break;
                        case "اینده":
                            await bot.sendPhoto(
                                message.chat.id,
                                "ayande.jpg",
                                {
                                    caption: `
[ 🕷 ] - <strong>اسم</strong>⊀ <code>${_['data']['name']}</code>
[ 🦋 ] - <strong>کارت</strong>⊀ <code>${_['data']['card']}</code>
[ 🕸 ] - <strong>شبا </strong>⊀ <code>${_['data']['shaba']}</code>
[ 🌊 ] - <strong>بانک</strong>⊀ <code>${_['data']['bank']}</code>
                        `,
                                    reply_to_message_id: message.message_id,
                                    parse_mode: "HTML",
                                    reply_markup: {
                                        inline_keyboard:
                                        [
                                            [
                                                {
                                                    text: "𝙖𝙙𝙙 𝙩𝙤 𝙜𝙧𝙤𝙪𝙥",
                                                    url: "http://t.me/ePrexTmbot?startgroup=new"
                                                }
                                            ],
                                            [
                                                {
                                                    text: "𝙘𝙡𝙤𝙨𝙚",
                                                    callback_data: `close_${message.from.id}`
                                                }
                                            ]
                                        ]
                                    }
                                }
                            );
                            break;
                        case "آینده":
                            await bot.sendPhoto(
                                message.chat.id,
                                "ayande.jpg",
                                {
                                    caption: `
[ 🕷 ] - <strong>اسم</strong>⊀ <code>${_['data']['name']}</code>
[ 🦋 ] - <strong>کارت</strong>⊀ <code>${_['data']['card']}</code>
[ 🕸 ] - <strong>شبا </strong>⊀ <code>${_['data']['shaba']}</code>
[ 🌊 ] - <strong>بانک</strong>⊀ <code>${_['data']['bank']}</code>
                        `,
                                    reply_to_message_id: message.message_id,
                                    parse_mode: "HTML",
                                    reply_markup: {
                                        inline_keyboard:
                                        [
                                            [
                                                {
                                                    text: "𝙖𝙙𝙙 𝙩𝙤 𝙜𝙧𝙤𝙪𝙥",
                                                    url: "http://t.me/ePrexTmbot?startgroup=new"
                                                }
                                            ],
                                            [
                                                {
                                                    text: "𝙘𝙡𝙤𝙨𝙚",
                                                    callback_data: `close_${message.from.id}`
                                                }
                                            ]
                                        ]
                                    }
                                }
                            );
                            break;
                        
                        default:
                            await bot.sendMessage(
                                message.chat.id,
                                `
[ 🕷 ] - <strong>اسم</strong>⊀ <code>${_['data']['name']}</code>
[ 🦋 ] - <strong>کارت</strong>⊀ <code>${_['data']['card']}</code>
[ 🕸 ] - <strong>شبا </strong>⊀ <code>${_['data']['shaba']}</code>
[ 🌊 ] - <strong>بانک</strong>⊀ <code>${_['data']['bank']}</code>
                                `,
                                {
                                    parse_mode: "HTML",
                                    reply_to_message_id: message.message_id,
                                    reply_markup: {
                                        inline_keyboard:
                                        [
                                            [
                                                {
                                                    text: "𝙖𝙙𝙙 𝙩𝙤 𝙜𝙧𝙤𝙪𝙥",
                                                    url: "http://t.me/ePrexTmbot?startgroup=new"
                                                }
                                            ],
                                            [
                                                {
                                                    text: "𝙘𝙡𝙤𝙨𝙚",
                                                    callback_data: `close_${message.from.id}`
                                                }
                                            ]
                                        ]
                                    }
                                }
                            )
                    }
                }
            }).catch(async (err) => {
                await bot.sendMessage(
                    message.chat.id,
                    "[ ❌ ] - شماره کارت خود را چک کنید و دوباره تلاش کنید\n\n[ 👁 ] - چک کردن 16 رقمی بودن\n[ 🌐 ] - اطمینان از صحت آن",
                    {
                        reply_to_message_id: message.message_id,
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: "𝙘𝙡𝙤𝙨𝙚",
                                        callback_data: `close_${message.from.id}`
                                    }
                                ]
                            ]
                        }
                    }
                )
            })

        } else {
            await bot.sendMessage(
                message.chat.id,
                "[ ❌ ] - روی شماره کارت ریپلای کنید",
                {
                    reply_to_message_id: message.message_id,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "𝙘𝙡𝙤𝙨𝙚",
                                    callback_data: `close_${message.from.id}`
                                }
                            ]
                        ]
                    }
                }
            )
        }
    } else if (message.text.startsWith("چک")){
        if (message.reply_to_message){
            await network.getAccountInfo(message.reply_to_message.text, async (account) => {
                if (account.date_created == undefined && account.address == undefined){
                    await bot.sendMessage(
                        message.chat.id,
                        "[ ❌ ] - هش ارسال شده نا معتبر میباشد",
                        {
                            reply_to_message_id: message.message_id,
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        {
                                            text: "𝙘𝙡𝙤𝙨𝙚",
                                            callback_data: `close_${message.from.id}`
                                        }
                                    ]
                                ]
                            }
                        }
                    )
                } else {
                    let date = new Date(account.date_created);
                    await bot.sendMessage(
                        message.chat.id,
                        `[ 📪 ] - آدرس: <code>${message.reply_to_message.text}</code>\n[ ⌛ ] - ساخته شده در ${date.getFullYear()}/${date.getMonth()}/${date.getDay()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}\n\n[ ♻ ] - فعال ${account.activated == true ? "شده ✅" : "نشده ❌"}\n[ 🍷 ] - بالانس: ${account.balance}\n\n[ 👤 ] - <a href="https://tronscan.org/#/address/${message.reply_to_message.text}">لینک اکانت</a>`,
                        {
                            reply_to_message_id: message.message_id,
                            parse_mode: "HTML"
                        }
                    )
                }
            })
        } else {
            await bot.sendMessage(
                message.chat.id,
                "[ ❌ ] - روی هش ریپلای کنید",
                {
                    reply_to_message_id: message.message_id,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "𝙘𝙡𝙤𝙨𝙚",
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
    if (call.data.startsWith("𝙘𝙡𝙤𝙨𝙚")){
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