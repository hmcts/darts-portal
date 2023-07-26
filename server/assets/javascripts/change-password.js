setTimeout(() => {
    // change heading
    $('.heading h1').text('Create a new password');
    // hide div intro text
    $('.intro p').css('display', 'none');
    // show continue button
    $('button#continue').css('display', 'inline-block');
    // change button text to Create New Password
    $('button#continue').text('Create new password');
    // remove asterisks
    $('#newPassword_label').text($('#newPassword_label').text().replace('*', ''));
    $('#reenterPassword_label').text($('#reenterPassword_label').text().replace('*', ''));
    // remove placeholders
    document.getElementById('newPassword').placeholder = '';
    document.getElementById('reenterPassword').placeholder = '';
}, 0);
