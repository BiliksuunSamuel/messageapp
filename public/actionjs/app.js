$(document).ready(function() {
    const socket = io({ transports: ['websocket'], upgradde: false });
    let username = $('.username').attr('data-name');;
    let userid = $('.username').attr('data-id');
    let userphone = $('.username').attr('data-phone');
    const RegisterUsersContainer = $('.AllUsersPage');
    const ActiveSocketsContainer = $('.ActiveSocketsPage');
    const ChatLogs = $('.chatlogs');
    let user = {
        name: username,
        id: userid,
        phone: userphone
    };
    let friendDetails;
    $(document).on('click', '.online-username', () => {
        friendDetails = {
            name: name,
            id: id,
            socketID: socketID
        };
    })
    socket.emit('addActiveUser', { user });
    getActivePortals();
    getRegisteredUsers();
    $('.RegisteredUsersPageBtn').click(function() {
        getRegisteredUsers();
    });
    $('.OnlineSocketBtn').click(function() {
        getActivePortals();
    });

    function getActivePortals() {
        ActiveSocketsContainer.html('');
        $.ajax({
            method: 'post',
            url: '/getFriendsSocket',
            data: { user: user },
            success: function(data) {
                let users = JSON.parse(JSON.stringify(data));
                users.forEach(user => {
                    let Person = user;
                    let singleUser = `<div class="singleOnlineUser" data-id="${Person.code}" data-phone="${Person.phone}" data-socket="${Person.socket}" data-name="${Person.name}">
                      <div class="online-username" data-id="${Person.code}" data-phone="${Person.phone}" data-socket="${Person.socket}" data-name="${Person.name}">
                        <p data-id="${Person.code}" data-phone="${Person.phone}" data-socket="${Person.socket}" data-name="${Person.name}">${Person.name}</p>
                      </div>
                      <div class="online-useraccount">
                        <button class="btn btn-sm text-light text-sm-center" data-id="${Person.code}" data-phone="${Person.phone}"><span class="font-icon"><i class="far fa-info"></i></span></button>
                        <button class="btn btn-sm text-light text-sm-center" data-id="${Person.code}" data-phone="${Person.phone}"><span class="font-icon"> <i class="fa fa-ellipsis-h" aria-hidden="true"></i></span></button>
                      </div>
                    </div>`;
                    ActiveSocketsContainer.append(singleUser);
                })
            },
            error: function(error) {
                console.log(error);
            }
        })
    }

    function getRegisteredUsers() {
        RegisterUsersContainer.html('');
        $.ajax({
            method: 'post',
            url: '/getRegisteredUsers',
            data: {
                id: userid
            },
            success: function(data) {
                let Users = JSON.parse(JSON.stringify(data));
                Users.forEach(user => {
                    let Person = user;
                    let singleUser = `<div class="singleOnlineUser" data-socket="nmoanfuni" data-id="${Person.id}" data-phone="${Person.PhoneNumber}" data-name="${Person.Name}">
                      <div class="online-username" data-id="${Person.id}" data-phone="${Person.PhoneNumber}" data-name="${Person.Name}">
                        <p data-id="${Person.id}" data-phone="${Person.PhoneNumber}" data-name="${Person.Name}">${Person.Name}</p>
                      </div>
                      <div class="online-useraccount">
                        <button class="btn btn-sm text-light text-sm-center" data-id="${Person.id}" data-phone="${Person.PhoneNumber}"><span class="font-icon"><i class="far fa-info"></i></span></button>
                        <button class="btn btn-sm text-light text-sm-center" data-id="${Person.id}" data-phone="${Person.PhoneNumber}"><span class="font-icon"> <i class="fa fa-ellipsis-h" aria-hidden="true"></i></span></button>
                      </div>
                    </div>`;
                    RegisterUsersContainer.append(singleUser);
                })
            },
            error: function(error) {
                console.log(error);
            }
        })
    }
    socket.on('activePorts', (data) => {
        getActivePortals();
    })

    $('.logoutbtn').click(function() {
        socket.emit('emitOnClose', { user: user });
        getActivePortals();
    })

    $(document).on('click', '.online-username', function() {
        ChatLogs.html('');
        let name = $(this).attr('data-name');
        let id = $(this).attr('data-id');
        let socketID = $(this).attr('data-socket');
        friendDetails = {
            name: name,
            id: id,
            socketID: socketID
        };
        LoadDetailsOnPage(friendDetails);
        let getMessageIdentity = {
            senderID: user.id,
            receiverID: friendDetails.id
        };
        $.ajax({
            method: 'post',
            url: '/getChatMessages',
            data: {
                getMessageIdentity
            },
            success: function(data) {
                if (data === 'Messages sent to this chat are encrypted with end to end encryption') {
                    ChatLogs.html('');
                } else {

                    let msgID1 = `${user.id}${friendDetails.id}`;
                    let msgID2 = `${friendDetails.id}${user.id}`;
                    let Messages = JSON.parse(JSON.stringify(data));
                    Messages.forEach(message => {
                        if (message.MessageID === msgID1) {
                            let Chat = `<div class="chat me">
                                 <p class="chat-message">
                                  ${message.Message}<span class="message-time">${message.Time}</span></p>
                                </div>`;
                            ChatLogs.append(Chat);
                        } else if (message.MessageID === msgID2) {
                            let Chat = `<div class="chat others">
                                 <p class="chat-message">
                                  ${message.Message}<span class="message-time">${message.Time}</span></p>
                                </div>`;
                            ChatLogs.append(Chat);
                        }
                    })








                }
            },
            error: function(error) {
                console.log(error);
            }
        })
    });

    function LoadDetailsOnPage(user) {
        let DetailsDiv = ` <div class="chatpage-div">
               <p class="username chatpage-username" data-socket="${user.socketID}" data-id="${user.id}" data-name="${user.name}">${user.name}</p>
               <span class="online-state"></span>
             </div>`;
        $('.chatpage-accountName').html(DetailsDiv);
    }
    //chat message sending
    $(document).on('submit', '#msg-form', function(e) {
        e.preventDefault();
        let msgDate = new Date();
        let msgHour = msgDate.getHours();
        let msgMinute = msgDate.getMinutes();
        let messageHour;
        let amPm;
        let messageTime;
        if (msgHour < 10) {
            msgHour = `0${msgHour}`;
        } else {
            msgHour = msgHour;
        }
        if (msgMinute < 10) {
            msgMinute = `0${msgMinute}`
        } else {
            msgMinute = msgMinute;
        }
        if (msgHour < 12) {
            amPm = "am";
            messageHour = msgHour;
            messageTime = `${messageHour}:${msgMinute} ${amPm}`;
        } else {
            amPm = "pm";
            messageHour = msgHour - 12;
            messageTime = `${messageHour}:${msgMinute} ${amPm}`;
        }

        let messagetxt = $('#msgtxt').val();
        if (messagetxt.length <= 0) {
            messagetxt = $('#msgtxt').focus();
        } else {
            let messageID = `${user.id}${friendDetails.id}`;
            let messageDetails = {
                senderID: user.id,
                receiverID: friendDetails.id,
                socketID: friendDetails.socketID,
                sendertime: messageTime,
                message: messagetxt,
                messageID: messageID
            }
            let chatMessage = `<div class="chat me">
                  <p class="chat-message">
                    ${messageDetails.message}<span class="message-time">${messageDetails.sendertime}</span></p>
                </div>`;
            ChatLogs.append(chatMessage);
            SendMessage(messageDetails);
            $('#msg-form')[0].reset();
        }
    })

    function SendMessage(messageDetails) {
        socket.emit('chatMe', { messageDetails });
    }
    socket.on('chatMe', (messageContent) => {
            let messages = JSON.parse(JSON.stringify(messageContent.messagebody));
            let chatMessage = `<div class="chat others">
                  <p class="chat-message">
                    ${messages.message}<span class="message-time">${messages.sendertime}</span></p>
                </div>`;
            ChatLogs.append(chatMessage);

        })
        //loading the user details on the chat page


    //chat message state alert
    $(document).on('focus', '#msgtxt', () => {
        let receiverPort = $('.chatpage-username').attr('data-socket');
        let senderName = user.name;
        let stateValues = {
            receiverPort,
            senderName
        };
        socket.emit('stateTyping', stateValues);
    })
    $(document).on('focusout', '#msgtxt', () => {
        let receiverPort = $('.chatpage-username').attr('data-socket');
        let senderName = user.name;
        let stateValues = {
            receiverPort,
            senderName
        };
        socket.emit('stateOnline', stateValues);
    })
    socket.on('stateTyping', (data) => {
        console.log(data)
        $('.online-state').html('typing')
    });
    socket.on('stateOnline', (data) => {
        console.log(data)
        $('.online-state').html('online')
    });



































})