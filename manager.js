// const knex = require('knex')({
//     client: 'sqlite3',
//     connection: {
//         filename: './mydb.sqlite'
//     }
// });

// class Manager {
//     constructor(){
//         knex.schema.createTableIfNotExists("trans", (table) => {
//             table.integer("uid").primary();
//             table.integer("in_cont");
//             table.integer("in_capt");
//             table.string("hash");
//             table.string("trns");
//         }).then(() => {
//             console.log("Database created")
//         })
//     }

//     // setup(){
//     //     this.db.run("CREATE TABLE IF NOT EXISTS trans ( uid INTEGER PRIMARY KEY, in_cont INTEGER, in_capt INTEGER, hash TEXT, trns TEXT )");
//     // }

//     async getAll(callback = () => {}){
//         // this.db.all("SELECT * FROM trans", [], (err, rows) => {
//         //     if (err){
//                 // callback({
//                 //     status: "ERROR",
//                 //     message: err
//                 // });
//         //         return;
//         //     } else {
//                 // callback({
//                 //     status: "OK",
//                 //     rows: rows
//                 // });
//         //         return;
//         //     }
//         // })

//         knex("trans").select("*").then((rows) => {
//             callback({
//                 status: "OK",
//                 rows: rows
//             });
//         }).catch((err) => {
//             callback({
//                 status: "ERROR",
//                 message: err
//             });
//         })
//     }

//     async getUserByUid(uid, callback = () => {}){
//         await this.getAll(async (all) => {
//             if (all.status !== "OK"){
//                 callback(all);
//                 return;
//             } else {
//                 for (let row of all.rows){
//                     if (row.uid == uid){
//                         row.trns = JSON.parse(row.trns);
//                         row.in_cont = row.in_cont === 1 ? true : false;
//                         row.in_capt = row.in_capt === 1 ? true : false;
//                         callback({
//                             status: "OK",
//                             user: row
//                         });
//                         return;
//                     }
//                 }
//                 callback({
//                     status: "INVALID_USER_ID",
//                     user: {}
//                 });
//                 return;
//             }
//         })
//     }

//     async addAccount(
//         uid,
//         callback = () => {}
//     ){
//         await this.getUserByUid(uid, async (stat) => {
//             if (stat.status === "OK"){
//                 callback({
//                     status: "EXISTS_USER"
//                 });
//                 return;
//             } else {
//                 knex("trans").insert([
//                     uid,
//                     0,
//                     0,
//                     "",
//                     "{}"
//                 ]).then(() => {
//                     callback({
//                         status: "OK"
//                     });
//                 }).catch((err) => {
//                     callback({
//                         status: "ERROR",
//                         message: err
//                     });
//                 })
//                 // const stmt = this.db.prepare("INSERT INTO trans (uid, in_cont, in_capt, hash, trns) VALUES (?, ?, ?, ?, ?)");
//                 // stmt.run(uid, 0, 0, "", "{}");
//                 // stmt.finalize((err) => {
//                 //     if (err){
//                 //         callback({
//                 //             status: "FINALIZE_FAILD"
//                 //         });
//                 //         return;
//                 //     } else {
//                 //         callback({
//                 //             status: "OK"
//                 //         });
//                 //         return;
//                 //     }
//                 // })
//             }
//         })
//     }

//     async addTrans(
//         uid,
//         from,
//         to,
//         at,
//         callback = () => {}
//     ){
//         await this.getUserByUid(uid, async (stat) => {
//             if (stat.status !== "OK"){
//                 callback({
//                     status: "USER_NOT_EXISTS"
//                 });
//                 return;
//             } else {
//                 stat.user.trns.push({
//                     from: from,
//                     to: to,
//                     at: at
//                 });
//                 // const stmt = this.db.prepare("UPDATE trans SET trns = ? WHERE uid = ?");
//                 // stmt.run(JSON.stringify(stat.user.trns), uid);
//                 // stmt.finalize((err) => {
//                 //     if (err){
//                 //         callback({
//                 //             status: "FINALIZE_FAILD"
//                 //         });
//                 //         return;
//                 //     } else {
//                 //         callback({
//                 //             status: "OK"
//                 //         });
//                 //         return;
//                 //     }
//                 // })
//                 knex("trans").where("uid", uid).update({
//                     trns: JSON.stringify(stat.user.trns)
//                 }).then(() => {
//                     callback({
//                         status: "OK"
//                     });
//                 }).catch((err) => {
//                     callback({
//                         status: "ERROR",
//                         message: err
//                     });
//                 })
//             }
//         })
//     }

//     async isOn(uid, callback = () => {}){
//         await this.getUserByUid(uid, async (stat) => {
//             if (stat.status !== "OK"){
//                 callback({
//                     status: "USER_NOT_EXISTS"
//                 });
//                 return;
//             } else {
//                 if (stat.user.in_cont === 1) { callback({ status: "OK", is: true }); }
//                 else { callback({ status: "OK", is: false }); }
//             }
//         })
//     }

//     async isCapt(uid, callback = () => {}){
//         await this.getUserByUid(uid, async (stat) => {
//             if (stat.status !== "OK"){
//                 callback({
//                     status: "USER_NOT_EXISTS"
//                 });
//                 return;
//             } else {
//                 if (stat.user.in_capt == 1) { callback({ status: "OK", is: true }); }
//                 else { callback({ status: "OK", is: false }); }
//             }
//         })
//     }

//     async makeCapt(
//         uid,
//         status,
//         callback = () => {}
//     ){
//         await this.getUserByUid(uid, async (stat) => {
//             if (stat.status !== "OK"){
//                 callback({
//                     status: "USER_NOT_EXISTS"
//                 });
//                 return;
//             } else {
//                 // const stmt = this.db.prepare("UPDATE trans SET in_capt = ? WHERE uid = ?");
//                 // stmt.run(status === 1 ? true : false, uid);
//                 // stmt.finalize((err) => {
//                 //     if (err){
//                 //         callback({
//                 //             status: "FINALIZE_FAILD"
//                 //         });
//                 //         return;
//                 //     } else {
//                 //         callback({
//                 //             status: "OK"
//                 //         });
//                 //         return;
//                 //     }
//                 // })
//                 knex("trans").where("uid", uid).update({
//                     in_capt: status == 1 ? true : false
//                 }).then(() => {
//                     callback({
//                         status: "OK"
//                     });
//                 }).catch((err) => {
//                     callback({
//                         status: "ERROR",
//                         message: err
//                     });
//                 })
//             }
//         })
//     }

//     async makeOn(
//         uid,
//         status,
//         callback = () => {}
//     ){
//         await this.getUserByUid(uid, async (stat) => {
//             if (stat.status !== "OK"){
//                 callback({
//                     status: "USER_NOT_EXISTS"
//                 });
//                 return;
//             } else {
//                 knex("trans").where("uid", uid).update({
//                     in_cont: status == 1 ? true : false
//                 }).then(() => {
//                     callback({
//                         status: "OK"
//                     });
//                 }).catch((err) => {
//                     callback({
//                         status: "ERROR",
//                         message: err
//                     });
//                 })
//             }
//         })
//     }

//     async setHash(
//         uid,
//         hash,
//         callback = () => {}
//     ){
//         await this.getUserByUid(uid, async (stat) => {
//             if (stat.status !== "OK"){
//                 callback({
//                     status: "USER_NOT_EXISTS"
//                 });
//                 return;
//             } else {
//                 knex("trans").where("uid", uid).update({
//                     hash: hash
//                 }).then(() => {
//                     callback({
//                         status: "OK"
//                     });
//                 }).catch((err) => {
//                     callback({
//                         status: "ERROR",
//                         message: err
//                     });
//                 })
//             }
//         })
//     }

// }

// module.exports = { Manager };