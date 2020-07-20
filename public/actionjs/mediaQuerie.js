$(document).ready(function() {

    const Height = $(window).height();

    $(window).resize(function() {
        var newHeight = $(window).height();
        if (newHeight == Height) {
            var Val = 89;
            $('.message-form').css({ 'top': `${Val}%` });
        } else if (newHeight < Height) {
            var value = 0.5 * ((Height - newHeight) / Height) * 100 + 5;
            var Val = 100 - value;
            $('.message-form').css({ 'top': `${Val}%` });
        }
    })

    $(document).on('click', '.CloseChatPagebtn', function() {
        $('.wrapper-right').toggleClass('toggleChatPage');
    });
    $(document).on('click', '.online-username', function() {
        $('.wrapper-right').toggleClass('toggleChatPage');
        $('.chatPageCover').addClass('toggleChatPageCover');
    });
    $(document).on('click', '.Navigationbtn', function() {
        $('.Navigationbtn').removeClass('toggleNavigationbtn');
        $(this).addClass('toggleNavigationbtn');
    });
    $(document).on('click', '.Navigationbtn', function() {
        $('.childPage').removeClass('toggleChatPage');
    });

    $(document).on('click', '.LoggedInUsersPagebtn', function() {
        $('.LoggedInUsers').addClass('toggleChatPage');
    });
    $(document).on('click', '.AllUsersPagebtn', function() {
        $('.AllUsersPage').addClass('toggleChatPage');
    })

    $(document).on('click', '.UpdateInfoPagebtn', () => {
        $('.AccountSettingsPage').toggleClass('toggleUpdatePage');
    })

    $(document).on('click', '.Navigationbtn', () => {
        $('.AccountSettingsPage').removeClass('toggleUpdatePage');
    })

    $(document).on('dblclick', '.account-name', () => {
        $('.AccountSettingsPage').toggleClass('toggleUpdatePage');
    })


})