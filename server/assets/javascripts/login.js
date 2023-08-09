function moveForgotPasswordLink() {
	$('.entry-item:nth-child(2)').after($('#forgotPassword'))
}

wrapXhrOpen('SelfAsserted', '"status":"400"', displayErrors);
moveForgotPasswordLink();

function displayErrors() {
  removeErrors();
  addItemLevelErrorClasses();
  createErrorSummaryBox();
  hidePageLevelErrors();
}

$('button#next').click(displayErrors);
