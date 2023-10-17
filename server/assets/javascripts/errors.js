
function addGovukErrorSummary(headingErrors) {
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
  mainForm.prepend(errorSummaryDiv);
}

function createErrorSummaryBox(screen) {
  let errorElems;
  if (screen === 'reset') {
    //Verification input errors
    const verifErrorElems = document.getElementsByClassName("verificationErrorText error");
    errorElems = [...verifErrorElems];
  } else {
    //Login page errors
    const pageLevelErrorElems = document.getElementsByClassName("error pageLevel");
    const itemLevelErrorElems = document.getElementsByClassName("error itemLevel");
    errorElems = [...pageLevelErrorElems, ...itemLevelErrorElems];

  }
  const errors = [];

  for (let i = 0; i < errorElems.length; i++) {
    if (window.getComputedStyle(errorElems[i]).display !== 'none') {
      errors.push(errorElems[i].innerText);
    }
  }

  if (errors.length > 0) {
    addGovukErrorSummary(errors);
  }
}

function addItemLevelErrorClasses(screen) {
  if (screen === 'reset'){
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
  } else {
    $('.error.itemLevel').each(function() {
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
