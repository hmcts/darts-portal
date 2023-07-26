// change heading
$('.heading h1').text('Create a new password');
// remove asterisks
$('#newPassword_label').text($('#newPassword_label').text().replace('*', ''));
$('#reenterPassword_label').text($('#reenterPassword_label').text().replace('*', ''));
// remove placeholders
document.getElementById('newPassword').placeholder = '';
document.getElementById('reenterPassword').placeholder = '';
