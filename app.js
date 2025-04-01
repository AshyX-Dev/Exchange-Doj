const token = "7818062489:AAEh3vbk2z212B2Yls-aP6znsu-zcRa6Vc8";

const TelegramBot = require("node-telegram-bot-api");
const { Network } = require("./network/net");
const { Manager } = require("./manager");

const bot = new TelegramBot(token, { polling: true });
const network = new Network();
const manager = new Manager();

function makeShort(string){
    return string.replace(text.slice(5, 10), "[...]")
}

let transes = {};

bot.on("message", async (message) => {
    await manager.addAccount(message.from.id);
    await manager.isCapt(message.from.id, async (yo) => {
        if (yo.status === "OK"){
            if (yo.is === true){
                await bot.deleteMessage(message.chat.id, message.message_id);
                await bot.sendMessage(
                    message.chat.id,
                    "[ 🚧 ] - در حال پردازش ..."
                ).then(async (rmsg) => {
                    await network.getAccountInfo(message.text, async (trns) => {
                        if (trns.address === undefined && trns.activated === undefined && trns.date_created === undefined){
                            await bot.editMessageText("[ ❌ ] - هش ارسالی اشتباهه", {
                                chat_id: message.chat.id,
                                message_id: rmsg.message_id
                            })
                        } else {
                            await manager.setHash(message.from.id, message.text);
                            await manager.makeCapt(message.from.id, 0)
                            await bot.editMessageText(`[ 🔐 ] - هش { ${makeShort(message.text)} } با موفقیت برای شما ست شد`);
                            if (transes[message.from.id]['mask'] === "owner"){
                                await bot.editMessageText(transes[message.from.id]['text'].replace("[ 🎾 ] - از: ...", `[ 🎾 ] - از: <code>${message.text}</code>`), {
                                    chat_id: transes[message.from.id]['chat_id'],
                                    message_id: transes[message.from.id]['message_id'],
                                    parse_mode: "HTML",
                                    reply_markup: {
                                        inline_keyboard: [
                                            [
                                                {
                                                    text: "تایید ✅",
                                                    callback_data: `accept_${message.from.id}_${transes[message.from.id]['partner']}`
                                                }
                                            ]
                                        ]
                                    }
                                })
                            } else {
                                await bot.editMessageText(transes[message.from.id]['text'].replace("[ 🍬 ] - به: ...", `[ 🍬 ] - از: <code>${message.text}</code>`), {
                                    chat_id: transes[message.from.id]['chat_id'],
                                    message_id: transes[message.from.id]['message_id'],
                                    parse_mode: "HTML",
                                    reply_markup: {
                                        inline_keyboard: [
                                            [
                                                {
                                                    text: "تایید ✅",
                                                    callback_data: `accept_${message.from.id}_${transes[message.from.id]['partner']}`
                                                }
                                            ]
                                        ]
                                    }
                                })
                            }
                        }
                    })
                })
            }
        }
    })

    await manager.isOn(message.from.id, async (ayo) => {
        if (ayo.status === "OK"){
            if (ayo['is'] === true){
                await bot.deleteMessage(message.chat.id, message.message_id);
                const match = message.text.match(/transaction\/([a-f0-9]{64})/);

                if (match) {
                    const transactionId = match[1];
                    await network.getTransactionInfo(transactionId, async (resp) => {
                        if (resp.ownerAddress === undefined && resp.toAddress === undefined && resp.timestamp === undefined){
                            await bot.sendMessage(message.chat.id, `[ 🍃 ] - هش تراکنش اشتباهه و تو سرور یافت نشد\n[ 👁 ] - [لینک ارسالی](${transactionId})`, {
                                parse_mode: "Markdown"
                            })
                        } else {
                            await manager.getUserByUid(message.from.id, async (owner) => {
                                await manager.getUserByUid(message.from.id, async (member) => {
                                    if (owner.user.hash !== resp.ownerAddress){
                                        await bot.sendMessage(
                                            message.chat.id,
                                            "[ ❌ ] - پول از طرف شروع کننده واریز نشده"
                                        )
                                    } else if (member.user.hash !== resp.toAddress){
                                        await bot.sendMessage(
                                            message.chat.id,
                                            "[ ❌ ] - پول به مشتری مدنظر واریز نشده"
                                        )
                                    } else {
                                        let date = new Date();
                                        await manager.addTrans(message.from.id, owner.user.hash, member.user.hash, `${date.getFullYear()}/${date.getMonth()}/${date.getDay()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
                                        await manager.addTrans(transes[message.from.id]['partner'], owner.user.hash, member.user.hash, `${date.getFullYear()}/${date.getMonth()}/${date.getDay()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
                                        delete transes[message.from.id];
                                        delete transes[transes[message.from.id]['partner']];
                                        await bot.sendMessage(
                                            message.chat.id,
                                            `[ 🍧 ] - تراکنش موفق\n\n[ 🤺 ] - از <code>${owner.user.hash}</code>\n[ 🍗 ] - به <code>${member.user.hash}</code>\n[ 🍡 ] در ${date.getFullYear()}/${date.getMonth()}/${date.getDay()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}\n\n[ 🌊 ] - [لینک تراکنش](${message.text})`,
                                        )
                                    }
                                })
                            })
                        }
                    })

                } else {
                    await bot.sendMessage(
                        message.chat.id,
                        "[ ❌ ] - لینک اشتباه\n\n[ 🌐 ] - [نمونه](https://tronscan.org/#/transaction/83fce30de4cb6cf38a20a452e0f66c8581788d5d1ba67becd07c23e150b4c9da)",
                        {
                            parse_mode: "Markdown"
                        }
                    )
                }
            }
        }
    })

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
    } else if (message.text.startsWith("واسطه دوج")){
        await bot.sendMessage(
            message.chat.id,
            "[ 👀 ] - منتظر طرف دوم قرارداد ...",
            {
                reply_to_message_id: message.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "ثبت 👥",
                                callback_data: `signFor_${message.from.id}`
                            }
                        ]
                    ]
                }
            }
        ).then(async (some) => {
            await manager.makeOn(message.from.id, 1);
            transes[message.from.id] = {
                mask: "owner",
                partner: 0,
                chat_id: message.chat.id,
                message_id: some.message_id,
                text: ""
            }
        })
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
                "به زودی ...",
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
    } else if (call.data.startsWith("signFor")){
        const spl = call.data.split("_");
        const uid = parseInt(spl[1]);
        let date = new Date();
        let txt = `[ 🎛 ] - طرف دوم به قرارداد پیوست\n\n[ 🎾 ] - از: ...\n[ 🍬 ] - به: ...\n[ ⌛ ] - در ${date.getFullYear()}/${date.getMonth()}/${date.getDay()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}\n[ 🛰 ] - معامله در 5 دقیقه دیگه بسته خواهد شد\n\n[ 📌 ] - لطفا هش اکانت هارو در پیوی  یا اینجا ارسال کنید`;
        
        transes[uid]['partner'] = call.from.id;
        transes[uid]['text'] = txt;
        transes[call.from.id] = {
            mask: "member",
            partner: 0,
            chat_id: transes[uid]['chat_id'],
            message_id: transes[uid]['message_id'],
            text: txt
        }

        transes[uid]['timestamp'] = date.getTime() + 300000;
        transes[call.from.id]['timestamp'] = date.getTime() + 300000;

        await manager.makeCapt(uid, 1);
        await manager.makeCapt(call.from.id, 1);

        await bot.editMessageText(txt, {
            chat_id: call.message.chat.id,
            message_id: call.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "تایید ✅",
                            callback_data: `accept_${uid}_${call.from.id}`
                        }
                    ]
                ]
            }
        })
    } else if (call.data.startsWith("accept")){
        const spl = call.data.split("_");
        const owner = parseInt(spl[1]);
        const member = parseInt(spl[2]);

        await manager.isCapt(owner, async (data) => {
            if (data['status'] === "OK"){
                if (data['is'] !== true){
                    await manager.isCapt(member, async (data2) => {
                        if (data2['status'] === "OK"){
                            if (data2['is'] !== true){
                                await bot.editMessageText("[ 📐 ] - هش تراکنش از سمت شروع کننده ارسال بشه", {
                                    chat_id: transes[owner]['chat_id'],
                                    message_id: transes[owner]['message_id']
                                })
                            }
                        }
                    })
                }
            }
        })

    }
})

setInterval(async () => {
    const keys = Object.keys(transes);
    for (let key of keys){
        let now = new Date().getTime();
        if (transes[key]['timestamp'] <= now){
            delete transes[key];
            delete transes[transes[key]['partner']];
            await bot.deleteMessage(transes[key]['chat_id'], transes[key]['message_id']);
        }
    }
}, 1000)