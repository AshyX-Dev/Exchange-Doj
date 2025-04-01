const { Database } = require("sqlite3");

class Manager {
    constructor(){
        this.db = new Database("trans.db", (err) => {
            if (err){
                console.log(`[manager] error for trans dbs: ${err}`);
            } else {
                this.setup();
            }
        })
    }

    setup(){
        this.db.run("CREATE TABLE IF NOT EXISTS trans ( uid INTEGER PRIMARY KEY, in_cont INTEGER, in_capt INTEGER, hash TEXT, trns TEXT )");
    }

    async getAll(callback = () => {}){
        this.db.all("SELECT * FROM trans", [], (err, rows) => {
            if (err){
                callback({
                    status: "ERROR",
                    message: err
                });
                return;
            } else {
                callback({
                    status: "OK",
                    rows: rows
                });
                return;
            }
        })
    }

    async getUserByUid(uid, callback = () => {}){
        await this.getAll(async (all) => {
            if (all.status !== "OK"){
                callback(all);
                return;
            } else {
                for (let row of all.rows){
                    if (row.uid == uid){
                        row.trns = JSON.parse(row.trns);
                        row.in_cont = row.in_cont === 1 ? true : false;
                        row.in_capt = row.in_capt === 1 ? true : false;
                        callback({
                            status: "OK",
                            user: row
                        });
                        return;
                    }
                }
                callback({
                    status: "INVALID_USER_ID",
                    user: {}
                });
                return;
            }
        })
    }

    async addAccount(
        uid,
        callback = () => {}
    ){
        await this.getUserByUid(uid, async (stat) => {
            if (stat.status === "OK"){
                callback({
                    status: "EXISTS_USER"
                });
                return;
            } else {
                const stmt = this.db.prepare("INSERT INTO trans (uid, in_cont, in_capt, hash, trns) VALUES (?, ?, ?, ?, ?)");
                stmt.run(uid, 0, 0, "", "{}");
                stmt.finalize((err) => {
                    if (err){
                        callback({
                            status: "FINALIZE_FAILD"
                        });
                        return;
                    } else {
                        callback({
                            status: "OK"
                        });
                        return;
                    }
                })
            }
        })
    }

    async addTrans(
        uid,
        from,
        to,
        at,
        callback = () => {}
    ){
        await this.getUserByUid(uid, async (stat) => {
            if (stat.status !== "OK"){
                callback({
                    status: "USER_NOT_EXISTS"
                });
                return;
            } else {
                stat.user.trns.push({
                    from: from,
                    to: to,
                    at: at
                });
                const stmt = this.db.prepare("UPDATE trans SET trns = ? WHERE uid = ?");
                stmt.run(JSON.stringify(stat.user.trns), uid);
                stmt.finalize((err) => {
                    if (err){
                        callback({
                            status: "FINALIZE_FAILD"
                        });
                        return;
                    } else {
                        callback({
                            status: "OK"
                        });
                        return;
                    }
                })
            }
        })
    }

    async isOn(uid, callback = () => {}){
        await this.getUserByUid(uid, async (stat) => {
            if (stat.status !== "OK"){
                callback({
                    status: "USER_NOT_EXISTS"
                });
                return;
            } else {
                if (stat.user.in_cont === 1) { callback({ status: "OK", is: true }); }
                else { callback({ status: "OK", is: false }); }
            }
        })
    }

    async isCapt(uid, callback = () => {}){
        await this.getUserByUid(uid, async (stat) => {
            if (stat.status !== "OK"){
                callback({
                    status: "USER_NOT_EXISTS"
                });
                return;
            } else {
                if (stat.user.in_capt === 1) { callback({ status: "OK", is: true }); }
                else { callback({ status: "OK", is: false }); }
            }
        })
    }

    async makeCapt(
        uid,
        status,
        callback = () => {}
    ){
        await this.getUserByUid(uid, async (stat) => {
            if (stat.status !== "OK"){
                callback({
                    status: "USER_NOT_EXISTS"
                });
                return;
            } else {
                const stmt = this.db.prepare("UPDATE trans SET in_capt = ? WHERE uid = ?");
                stmt.run(status === 1 ? true : false, uid);
                stmt.finalize((err) => {
                    if (err){
                        callback({
                            status: "FINALIZE_FAILD"
                        });
                        return;
                    } else {
                        callback({
                            status: "OK"
                        });
                        return;
                    }
                })
            }
        })
    }

    async makeOn(
        uid,
        status,
        callback = () => {}
    ){
        await this.getUserByUid(uid, async (stat) => {
            if (stat.status !== "OK"){
                callback({
                    status: "USER_NOT_EXISTS"
                });
                return;
            } else {
                const stmt = this.db.prepare("UPDATE trans SET in_cont = ? WHERE uid = ?");
                stmt.run(status === 1 ? true : false, uid);
                stmt.finalize((err) => {
                    if (err){
                        callback({
                            status: "FINALIZE_FAILD"
                        });
                        return;
                    } else {
                        callback({
                            status: "OK"
                        });
                        return;
                    }
                })
            }
        })
    }

    async setHash(
        uid,
        hash,
        callback = () => {}
    ){
        await this.getUserByUid(uid, async (stat) => {
            if (stat.status !== "OK"){
                callback({
                    status: "USER_NOT_EXISTS"
                });
                return;
            } else {
                const stmt = this.db.prepare("UPDATE trans SET hash = ? WHERE uid = ?");
                stmt.run(hash, uid);
                stmt.finalize((err) => {
                    if (err){
                        callback({
                            status: "FINALIZE_FAILD"
                        });
                        return;
                    } else {
                        callback({
                            status: "OK"
                        });
                        return;
                    }
                })
            }
        })
    }

}

module.exports = { Manager };