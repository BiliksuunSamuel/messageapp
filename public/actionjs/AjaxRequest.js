$(document).ready(function() {
    let username = $('.username').attr('data-name');
    let userid = $('.username').attr('data-id');
    let userphone = $('.username').attr('data-phone');
    const RegisterUsersContainer = $('.AllUsersPage');
    const ChatLogs = $('.chatlogs');
    let user = {
        name: username,
        id: userid,
        phone: userphone
    };
    let friendDetails;
    getRegisteredUsers();
    $('.RegisteredUsersPageBtn').click(function() {
        getRegisteredUsers();
    });

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
            <span class="online-state">Online</span>
          </div>`;
        $('.chatpage-accountName').html(DetailsDiv);
    }


})