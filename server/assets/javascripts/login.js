function moveForgotPasswordLink() {
	$('.entry-item:nth-child(2)').after($('#forgotPassword'))
}

function displayErrors() {
  removeErrors();
  addItemLevelErrorClasses();
  createErrorSummaryBox();
  hidePageLevelErrors();
}

moveForgotPasswordLink();
$('button#next').click(displayErrors);

// wait a second before trying to do this, in case the JS in head isn't loaded yet
setTimeout(function() {
  wrapXhrOpen('SelfAsserted', '"status":"400"', displayErrors);
}, 1000);
