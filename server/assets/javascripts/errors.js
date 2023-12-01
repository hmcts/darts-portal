
function addGovukErrorSummary(headingErrors) {

  //If heading already exists, append to existing list of errors
  if ($('.govuk-error-summary').length){
    const list = document.getElementById("error-summary-list");
    const errorCount = headingErrors.length;

    for (let i = 0; i < errorCount; i++) {
      const errorListItem = document.createElement('li');
      const errorListItemA = document.createElement('a');
      errorListItemA.href = '#';
      errorListItemA.innerText = headingErrors[i];
      errorListItem.appendChild(errorListItemA);
      list.appendChild(errorListItem);
    }

  } else {
    const errorTitle = document.createElement('h2');
    errorTitle.className = 'govuk-error-summary__title';
    const titleText = document.createTextNode('There is a problem');
    errorTitle.appendChild(titleText);
  
    const errorBodyDiv = document.createElement('div');
    errorBodyDiv.className = 'govuk-error-summary__body';
    const errorCount = headingErrors.length;
  
    // The appendChild() method move the element after appending, hence we always use element index zero when accessing the next element.
    const errorList = document.createElement('ul')
    errorList.className = 'govuk-list govuk-error-summary__list';
    errorList.id = 'error-summary-list'
    for (let i = 0; i < errorCount; i++) {
      const errorListItem = document.createElement('li');
      const errorListItemA = document.createElement('a');
      errorListItemA.href = '#';
      errorListItemA.innerText = headingErrors[i];
      errorListItem.appendChild(errorListItemA);
      errorList.appendChild(errorListItem);
    }
    errorBodyDiv.appendChild(errorList);
  
    const roleAlertDiv = document.createElement('div');
    roleAlertDiv.setAttribute("role", "alert");
    roleAlertDiv.appendChild(errorTitle);
    roleAlertDiv.appendChild(errorBodyDiv);
  
    const errorSummaryDiv = document.createElement('div');
    errorSummaryDiv.className = 'govuk-error-summary';
    errorSummaryDiv.appendChild(roleAlertDiv);
  
    const mainForm = document.getElementById('darts-container');
    const backLink = document.getElementById('backLink');

    //If back link exists, insert after
    if (backLink) {
      backLink.insertAdjacentElement('afterend', errorSummaryDiv);
    } else {
      mainForm.prepend(errorSummaryDiv);
    }
  }
}

function createErrorSummaryBox(screen) {
  let errorElems;
  if (screen === 'reset') {
    //Verification input errors
    const verifErrorElems = document.getElementsByClassName('verificationErrorText error');
    errorElems = [...verifErrorElems];
  }
  if (screen === 'login' || screen === 'change_password' || screen === 'mfa') {
    // login and change password page errors
    let itemLevelSelector = 'error itemLevel';
    if (screen === 'change_password') {
      itemLevelSelector += ' show';
    }
    const pageLevelErrorElems = document.getElementsByClassName('error pageLevel');
    const itemLevelErrorElems = document.getElementsByClassName(itemLevelSelector);
    errorElems = [...pageLevelErrorElems, ...itemLevelErrorElems];
  }
  const errors = [];

  if (errorElems && errorElems.length > 0) {
    for (let i = 0; i < errorElems.length; i++) {
      if (window.getComputedStyle(errorElems[i]).display !== 'none') {
        errors.push(errorElems[i].innerText);
      }
    }
  }

  if (errors.length > 0) {
    addGovukErrorSummary(errors);
  }
}

function addVerificationControlErrors(screen){
  if (screen === 'reset') {
    $('#emailVerificationCode_label').parent().addClass('darts-error');
    //Loop round error message if to be displayed, clone in correct place
    $('#emailVerificationControl_error_message').each(function() {
      if ($(this).css('display') !== 'none') {
        const err = $(this).clone().addClass('errorText').css('display', 'block')
        //Replace if error already exists otherwise insert after
        const verifErrMsg = $('#emailVerificationCode_label').parent().children('#emailVerificationControl_error_message')
        if (verifErrMsg.length){
          verifErrMsg.replaceWith(err);
        } else {
          err.insertAfter('#emailVerificationCode_label');
        }
      }
    });
    //Set old error message to hidden 
    $('#emailVerificationControl_error_message').hide();
  }

  if (screen === 'mfa'){
    $('#otpCode_label').parent().addClass('darts-error');
    $('#claimVerificationServerError').each(function() {
      if ($(this).css('display') !== 'none') {
        const err = $(this).clone().addClass('errorText').css('display', 'block')
        //Replace if error already exists otherwise insert after
        const verifErrMsg = $('#otpCode_label').parent().children('#claimVerificationServerError')
        if (verifErrMsg.length){
          verifErrMsg.replaceWith(err);
        } else {
          err.insertAfter('#otpCode_label');
        }
      }
    });
    //Set old error message to hidden 
    $('#claimVerificationServerError').hide();
  }
}

function addItemLevelErrorClasses(screen) {
  if (screen === 'reset' || screen === 'mfa') {
    const errs = [];
    const infoElem = $('.error.itemLevel.show').each(function(){
        errs.push($(this).text());        
    });
    if (infoElem.length > 0){
        infoElem.parent().addClass('darts-error');
        infoElem.addClass('errorText').css('display', 'block').css('margin-bottom', '15px');
        addGovukErrorSummary(errs);
    }
  }
  if (screen === 'login' || screen === 'change_password') {
    let selector = '.error.itemLevel';
    if (screen === 'change_password') {
      selector += '.show';
    }
    $(selector).each(function() {
      if ($(this).css('display') !== 'none') {
        $(this).parent().addClass('darts-error');
      }
    });
  }
}

function removeErrors() {
  $('.error.itemLevel').parent().removeClass('darts-error');
  $('.govuk-error-summary').remove();
}

function hidePageLevelErrors() {
  $('.error.pageLevel').css('display', 'none');
}
