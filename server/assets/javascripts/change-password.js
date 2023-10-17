// change heading
$('.heading h1').text('Create a new password');
// remove asterisks
$('#newPassword_label').text($('#newPassword_label').text().replace('*', ''));
$('#reenterPassword_label').text($('#reenterPassword_label').text().replace('*', ''));
// remove placeholders
document.getElementById('newPassword').placeholder = '';
document.getElementById('reenterPassword').placeholder = '';

function displayErrors() {
  removeErrors();
  createErrorSummaryBox('change_password');
  addItemLevelErrorClasses('change_password');
  hidePageLevelErrors();
}

$('button#continue').click(displayErrors);