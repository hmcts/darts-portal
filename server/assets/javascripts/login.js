function moveForgotPasswordLink() {
	$('.entry-item:nth-child(2)').after($('#forgotPassword'))
}

function displayErrors() {
  removeErrors();
  addItemLevelErrorClasses();
  createErrorSummaryBox();
  hidePageLevelErrors();
}

function onLoad(){
  displayErrors();
  loginAccessibility();
}

moveForgotPasswordLink();
$('button#next').click(displayErrors);

// wait a second before trying to do this, in case the JS in head isn't loaded yet
setTimeout(function() {
  wrapXhrOpen('SelfAsserted', '"status":"400"', onLoad);
}, 1000);
