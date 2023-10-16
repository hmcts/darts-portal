function moveForgotPasswordLink() {
	$('.entry-item:nth-child(2)').after($('#forgotPassword'))
}

//File used strictly for updating HTML for accessibility purposes
function loginAccessibility(){
  //Set aria-required attribute to email input in azure b2c login form
  if (document.getElementById('email')) {
      document.getElementById('email').setAttribute("aria-required", "true");
  }
}

function displayErrors() {
  removeErrors();
  addItemLevelErrorClasses();
  createErrorSummaryBox('login');
  hidePageLevelErrors();
}

moveForgotPasswordLink();
loginAccessibility();
$('button#next').click(displayErrors);

// wait a second before trying to do this, in case the JS in head isn't loaded yet
setTimeout(function() {
  wrapXhrOpen('SelfAsserted', '"status":"400"', displayErrors);
}, 1000);
