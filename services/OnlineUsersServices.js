const con = require('../connectDB/dbConfig');
let getByPhone = (phone) => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = "select * from activesocket where phone=?";
            con.query(cmd, phone, (error, rows) => {
                if (error) reject(error);
                if (rows.length > 0) {
                    let user = rows[0];
                    resolve(user);
                } else {
                    let output = 'null';
                    resolve(output);
                }
            })
        } catch (error) {
            reject(error);
        }
    })
}
let updateSocket = (phone, NewSocket) => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = "update activesocket set socket=? where phone=?";
            con.query(cmd, [NewSocket, phone], (error, success) => {
                if (error) reject(error);
                if (success) {
                    resolve(success);
                }
            })
        } catch (error) {
            reject(error);
        }
    })
}

let getOthers = (phone) => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = "select * from activesocket where phone=?";
            con.query(cmd, [phone], (error, rows) => {
                if (error) reject(error);
                if (rows) {
                    let users = JSON.parse(JSON.stringify(rows[0]));
                    resolve(users);
                }
            })
        } catch (error) {
            reject(error);
        }
    })
}
let addNew = (user) => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = "insert into activesocket(name,code,phone,socket) values(?,?,?,?)";
            con.query(cmd, [user.name, user.id, user.phone, user.PortID], (error, success) => {
                if (error) reject(error);
                if (success) {
                    resolve(success);
                }
            })
        } catch (error) {
            reject(error);
        }
    })
}
let getFriends = (phone) => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = "select * from activesocket where not phone=?";
            con.query(cmd, [phone], (error, rows) => {
                if (error) reject(error);
                if (rows) {
                    resolve(JSON.parse(JSON.stringify(rows)));
                } else {
                    resolve('null');
                }
            })
        } catch (error) {
            reject(error);
        }
    })
};
let DeleteSocket = (phone) => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = "delete from activesocket where phone=?";
            con.query(cmd, phone, (error, success) => {
                if (error) reject(error);
                if (success) {
                    resolve(success);
                }
            })
        } catch (error) {
            reject(error);
        }
    })
}
let saveMessage = (messagedetails) => {
    return new Promise((resolve, reject) => {
        try {
            let messageBody = {
                senderID: messagedetails.senderID,
                receiverID: messagedetails.receiverID,
                message: messagedetails.message,
                messageID: messagedetails.messageID,
                sendertime: messagedetails.sendertime
            }
            let cmd = "insert into messages(SenderID,ReceiverID,Message,MessageID,Time) values(?,?,?,?,?)";
            con.query(cmd, [messageBody.senderID, messageBody.receiverID, messageBody.message, messageBody.messageID, messageBody.sendertime], (error, success) => {
                if (error) reject(error)
                if (success) {
                    resolve(success);
                }
            })
        } catch (error) {
            reject(error);
        }
    })
}
let getMessages = (messageID1, messageID2) => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = "select * from messages where messageID=? or messageID=?";
            con.query(cmd, [messageID1, messageID2], (error, rows) => {
                if (error) reject(error);
                if (rows.length > 0) {
                    resolve(rows)
                } else {
                    resolve('Messages sent to this chat are encrypted with end to end encryption');
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    getByPhone: getByPhone,
    updateSocket: updateSocket,
    getOthers: getOthers,
    addNew: addNew,
    getFriends: getFriends,
    DeleteSocket: DeleteSocket,
    saveMessage: saveMessage,
    getMessages: getMessages,
}