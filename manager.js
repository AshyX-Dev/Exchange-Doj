// const { Database } = require("sqlite3");

// class Manager {
//     constructor(){
//         this.db = new Database("trans.db", (err) => {
//             if (err){
//                 console.log(`[manager] error for trans dbs: ${err}`);
//             } else {
//                 this.setup();
//             }
//         })
//     }

//     setup(){
//         this.db.run("CREATE TABLE IF NOT EXISTS trans ( uid INTEGER PRIMARY KEY, trns TEXT )");
//     }

//     async getAll(callback = () => {}){
//         this.db.all("SELECT * FROM trans", [], (err, rows) => {
//             if (err){
//                 callback({
//                     status: "ERROR",
//                     message: err
//                 });
//                 return;
//             } else {
//                 callback({
//                     status: "OK",
//                     rows: rows
//                 });
//                 return;
//             }
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
//                 const stmt = this.db.prepare("INSERT INTO trans (uid, trns) VALUES (?, ?)");
//                 stmt.run(uid, "{}");
//                 stmt.finalize((err) => {
//                     if (err){
//                         callback({
//                             status: "FINALIZE_FAILD"
//                         });
//                         return;
//                     } else {
//                         callback({
//                             status: "OK"
//                         });
//                         return;
//                     }
//                 })
//             }
//         })
//     }

//     async addTrans(
//         uid,
//         callback = () => {}
//     ){
//         await this.getUserByUid(uid, async (stat) => {
//             if (stat.status !== "OK"){
//                 callback({
//                     status: "USER_NOT_EXISTS"
//                 });
//                 return;
//             } else {
//                 // CONTINUE
//             }
//         })
//     }

// }