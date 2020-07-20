$(document).ready(function() {
    //configuring the socket connections
    const socket = io("192.168.43.157:2012");
    const ActiveSocketsContainer = $('.ActiveSocketsPage');
    const ChatLogs = $('.chatlogs');
    const LoggedInUsersContainer = $(".LoggedInUsers");
    let username = $('.username').attr('data-name');
    let userid = $('.username').attr('data-id');
    let userphone = $('.username').attr('data-phone');
    let user = {
        name: username,
        id: userid,
        phone: userphone
    };
    let friendDetails;

    //formating the chat mesage time;
    function formatTime() {
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
        return messageTime;
    }
    let socketPort;
    $.notify(`Welcome ${username}`, { className: "success", autoHide: "true", autoHideDelay: 3000, style: 'bootstrap' });
    //on user connect
    socket.emit('connected', { username, userid });
    socket.on('userConnect', (data) => {
        $.notify(`${data.name} Online`, { className: "success", autoHide: "true", autoHideDelay: 3000, style: 'bootstrap' });
    })

    //on user log out
    $('.logoutbtn').click(function() {
        socket.emit('loggedout', { username, });
    })

    //loading all the active users
    socket.on('connectedUsers', (data) => {
        data = JSON.parse(JSON.stringify(data));
        ActiveSocketsContainer.html('');
        data.forEach(user => {
            if (user.name !== username) {
                let singleUser = `<div class="singleOnlineUser" data-socket="${user.socketID}" data-name="${user.name}" data-id="${user.id}">
              <div class="online-username" data-socket="${user.socketID}" data-name="${user.name}" data-id="${user.id}">
                <p data-socket="${user.socketID}" data-name="${user.name}" data-id="${user.id}">${user.name}</p>
              </div>
              <div class="online-useraccount">
                <button class="btn btn-sm text-light text-sm-center" data-socket="${user.socketID}" data-name="${user.name}" data-id="${user.id}"><span class="font-icon"><i class="far fa-info"></i></span></button>
                <button class="btn btn-sm text-light text-sm-center" data-socket="${user.socketID}" data-name="${user.name}" data-id="${user.id}"><span class="font-icon"> <i class="fa fa-ellipsis-h" aria-hidden="true"></i></span></button>
              </div>
            </div>`;
                ActiveSocketsContainer.append(singleUser);

            }
        })
    })

    //on notification button click
    $('.OnlineSocketBtn').click(function() {
        socket.on('connectedfriends', (data) => {
            data = JSON.parse(JSON.stringify(data));
            ActiveSocketsContainer.html('');
            data.forEach(user => {
                if (user.name !== username) {
                    let singleUser = `<div class="singleOnlineUser" data-socket="${user.socketID}" data-name="${user.name}" data-id="${user.id}">
                <div class="online-username" data-socket="${user.socketID}" data-name="${user.name}" data-id="${user.id}">
                  <p data-socket="${user.socketID}" data-name="${user.name}" data-id="${user.id}">${user.name}</p>
                </div>
                <div class="online-useraccount">
                  <button class="btn btn-sm text-light text-sm-center" data-socket="${user.socketID}" data-name="${user.name}" data-id="${user.id}"><span class="font-icon"><i class="far fa-info"></i></span></button>
                  <button class="btn btn-sm text-light text-sm-center" data-socket="${user.socketID}" data-name="${user.name}" data-id="${user.id}"><span class="font-icon"> <i class="fa fa-ellipsis-h" aria-hidden="true"></i></span></button>
                </div>
              </div>`;
                    ActiveSocketsContainer.append(singleUser);
                }
            })
        })
    });

    //sending chat messages
    $(document).on('submit', '#msg-form', function(e) {
        e.preventDefault();
        let name = $('.chatpage-username').attr('data-name');
        let id = $('.chatpage-username').attr('data-id');
        let socketID = $('.chatpage-username').attr('data-socket');
        friendDetails = {
            name: name,
            id: id,
            socketID: socketID
        };
        let messagetxt = $('#msgtxt').val();
        if (messagetxt.length <= 0) {
            messagetxt = $('#msgtxt').focus();
        } else {
            let messageID = `${user.id}${friendDetails.id}`;
            let messageDetails = {
                senderID: user.id,
                receiverID: friendDetails.id,
                socketID: friendDetails.socketID,
                sendertime: formatTime(),
                message: messagetxt,
                messageID: messageID,
                senderName: username,
            }
            let chatMessage = `<div class="chat me">
                <p class="chat-message">
                    ${messageDetails.message}<span class="message-time">${messageDetails.sendertime}</span></p>
                </div>`;
            ChatLogs.append(chatMessage);
            SendMessage(messageDetails);
            $('#msg-form')[0].reset();
            let info = {
                senderName: username,
                senderID: userid,
                receiverName: friendDetails.name,
                receiverID: friendDetails.id,
                socketID: friendDetails.socketID,
            };
            socket.emit('online', info)
            ChatLogs.scrollTop($("#chatlogs")[0].scrollHeight);
        }
    })

    function SendMessage(messageDetails) {
        socket.emit('chatmessage', { messageDetails });
    }
    socket.on('chatmessage', (messageContent) => {
        let messages = messageContent;

        if ($(".chatpage-username").attr("data-id") === messages.senderID) {
            let chatMessage = `<div class="chat others">
                <p class="chat-message">
                    ${messages.message}<span class="message-time">${messages.sendertime}</span></p>
                </div>`;
            console.log($(".chatpage-username").attr("data-socket"));
            console.log(messages.socketID);
            ChatLogs.append(chatMessage);
            ChatLogs.scrollTop($("#chatlogs")[0].scrollHeight);
        } else {
            let chatMessage = ` <div class="alert notifications alert-dismissible alert-light bg-light">
           <button type="button" class="close" data-dismiss="alert">&times;</button>
            <div class="content">
            <p class="sender-name-note">${messages.senderName}</p>
            <p class="Message-note">${messages.message}</p></div>
       </div>`;
            LoggedInUsersContainer.append(chatMessage);
            let noteNumber = $(".LoggedInUsers div").children().length
            if (noteNumber > 0) {
                $(".note-counter").html(noteNumber / 4);
            } else {
                $(".note-counter").html('');
            }
        }

    })

    $(document).on('click', ".close", function() {
        let noteNumber = $(".LoggedInUsers div").children().length
        if (noteNumber > 0) {
            $(".note-counter").html(noteNumber / 4);
        } else {
            $(".note-counter").html('');
        }
    })

    $(document).on("keydown", ("#msgtxt"), () => {
        let name = $('.chatpage-username').attr('data-name');
        let id = $('.chatpage-username').attr('data-id');
        let socketID = $('.chatpage-username').attr('data-socket');
        friendDetails = {
            name: name,
            id: id,
            socketID: socketID
        };
        let info = {
            senderName: username,
            senderID: userid,
            receiverName: friendDetails.name,
            receiverID: friendDetails.id,
            socketID: friendDetails.socketID,
        };
        socket.emit('typing', info);
        if ($('#msgtxt').val().length <= 0) {
            socket.emit('online', info)
        }
    })

    socket.on('typing', (data) => {
        let info = data;
        if ($(".chatpage-username").attr("data-id") === info.senderID) {
            $('.online-state').html('Typing');
        }
    })

    socket.on('online', (data) => {
        let info = data;
        if ($(".chatpage-username").attr("data-id") === info.senderID) {
            $('.online-state').html('Online');
        }
    })








































    /* toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "300",
        "timeOut": "2000",
        "extendedTimeOut": "500",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
    }
    toastr["success"](`${username}`, "Welcome")*/

})