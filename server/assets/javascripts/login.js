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

setTimeout(function() {
  wrapXhrOpen('SelfAsserted', '"status":"400"', displayErrors);
}, 0);
