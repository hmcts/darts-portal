function tabOrder() {
    if (document.getElementsByClassName('govuk-skip-link')[0]) {
        document.getElementsByClassName('govuk-skip-link')[0].tabIndex = 1;
    }
    if (document.getElementsByClassName('govuk-header__link govuk-header__link--homepage')[0]) {
        document.getElementsByClassName('govuk-header__link govuk-header__link--homepage')[0].tabIndex = 2;
    }
    if (document.getElementById('cancel')) {
        document.getElementById('cancel').tabIndex = 3;
    }
    if (document.getElementById('continue')) {
        document.getElementById('continue').tabIndex = 4;
    }
    if (document.getElementById('emailVerificationControl_but_change_claims')) {
        document.getElementById('emailVerificationControl_but_change_claims').tabIndex = 5;
    }
}

document.getElementsByClassName('govuk-skip-link')[0].addEventListener("focusin", (event) => {
    document.getElementById('cancel').style.top = "100px";
})

document.getElementsByClassName('govuk-skip-link')[0].addEventListener("focusout", (event) => {
    document.getElementById('cancel').style.top = "60px";
})

// removing placeholder text and "*" from email label
$('#email_label').text($('#email_label').text().replace('*', ''));
document.getElementById('email').placeholder = '';

// hook into XHR functions and apply changes on success
(function () {
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        const requestURL = arguments[1];
        this.addEventListener('load', function () {
            const isForSendCode = requestURL.indexOf('SendCode') > 0;
            const isForVerifyCode = requestURL.indexOf('VerifyCode') > 0;
            const isSuccessful = this.readyState === 4 && this.responseText === `{"status":"200"}`;

            if (isForSendCode && isSuccessful) {
                setTimeout(() => {
                    //Remove errors if they exist
                    removeErrors();
                    // hide intro
                    document.getElementsByClassName('intro').item(0).style.display = 'none';
                    // hide email label
                    document.getElementById('email_label').style.display = 'none';
                    // disable email input
                    document.getElementById('email').style.display = 'none';
                    // remove asterisk from Verification code
                    $('#emailVerificationCode_label').text($('#emailVerificationCode_label').text().replace('*', ''));
                    // remove placeholder from Input box
                    document.getElementById('emailVerificationCode').placeholder = '';
                }, 0)
            }

            if (isForVerifyCode && isSuccessful) {
                setTimeout(() => {
                    //Remove errors if they exist
                    removeErrors();
                    // show email
                    $('#email').css('display', 'unset');
                    // change heading
                    $('.heading h1').text('Code accepted');
                    // show continue button
                    $('button#continue').css('display', 'unset');
                    // move back button to correct position, due to continue button now being shown
                    $('button#cancel').css('margin-left', '-98px');
                    // change tab order
                    tabOrder();
                }, 0)
            }
        });
        origOpen.apply(this, arguments);
    };
})();

// when clicking "Use a different account", reset some changes made after VerifyCode is completed
$('#emailVerificationControl_but_change_claims.changeClaims').click(function () {
    // change heading
    $('.heading h1').text('Reset your password');
    // hide continue button
    $('button#continue').css('display', 'none');
    // undo moving back button, not required if the continue button is hidden
    $('button#cancel').css('margin-left', '0');
    // show intro message
    document.getElementsByClassName('intro').item(0).style.display = 'block';
    // show email address label
    document.getElementById('email_label').style.display = 'inline-block';
});

function displayErrors() {
    removeErrors();
    createErrorSummaryBox('reset');
    addItemLevelErrorClasses('reset');
    hidePageLevelErrors();
}

// wait a second before trying to do this, in case the JS in head isn't loaded yet
setTimeout(function() {
    wrapXhrOpen('VerifyCode', '"status":"400"', displayErrors);
}, 1000);
