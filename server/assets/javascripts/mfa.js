function insertBackLink(){
    $('button#cancel').insertBefore('#darts-container :first-child');
    $('button#cancel').attr('id', 'backLink');
    $('#backLink').attr('class', 'govuk-back-link');
    $('#backLink').text('Back');
}

function insertInfoBox(){
    var infoBox = `<div class="govuk-notification-banner" role="region"
            aria-labelledby="govuk-notification-banner-title"
            data-module="govuk-notification-banner">
            <div class="govuk-notification-banner__header">
                <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">
                Important
                </h2>
            </div>
            <div class="govuk-notification-banner__content">
                <p class="govuk-notification-banner__heading">
                You are now leaving HMCTS
                </p>
                <p>
                Performing the action below, means you will leave HMCTS
                </p>
            </div>
            </div>`

    $(infoBox).insertBefore("#attributeVerification");
}

function insertTitle(){
    isTotp() ? insertTotpTitle() : insertMfaTitle();
}

function insertMfaTitle(){
    $("<h1>Authenticator app</h1>").insertBefore("#attributeList");
}

function insertTotpTitle(){
    const title = $("#QrCodeVerifyInstruction_label");
    title.hide();

    $(`<h1>${title.text()}</h1>`).insertBefore("#attributeList");
}

function hideTryThisLink(){
    $('#accountDetailsLink').hide();
}

function showAccountDetails(){
    hideTryThisLink();
    const details = getAccountDetails();
    const accountDetailsHtml = 
    `<div class="account-details">
        <p id="detailText">You can enter these account details into the authenticator app manually.</p>
        
        <label>Account Name</label>
        <p id="accountId">${details.externalId}</p>

        <label id="secretLabel">Secret</label>
        <p id="secret">${details.secret}</p>
    </div>`

    $(accountDetailsHtml).insertAfter('#attributeList');
}

function getAccountDetails(){
    const authDetails = $('#totpQrCodeControl-text').text();

    const details = {};
    const externalIdMatch = authDetails.match(/(?:[^:]+:){2}([^?]+)/);
    const secretMatch = authDetails.match(/secret=([^&]+)/);

    if (externalIdMatch && secretMatch) {
        details.externalId = externalIdMatch[1];
        details.secret = secretMatch[1];

        return details;
    } else {
        details.externalId = 'Error finding account details';
        details.secret = 'Cannot find secret';
        
        return details;
    }
}

// when clicking "Can't scan? Try this", show Account Details
$('#main-content').on('click', '#accountDetailsLink', function() {
    showAccountDetails();
});

function removeAppStores(){
    $('a#authenticatorAppIconControl-google').text('Google Play');
    $('a#authenticatorAppIconControl-apple').text('Apple App Store');
}

function removeText(){
    $('div.intro').remove();  
}

function amendCantScanLink(){
    $('a[href^="otpauth://"]').attr('id', 'accountDetailsLink');
    $('#accountDetailsLink').attr('class', 'govuk-link govuk-link--no-visited-state');
    $('#accountDetailsLink').removeAttr('href');
}

function removeLinks(){
    $('a.helpLink').remove();
    $('li.authenticatorInfoControl_li').remove();
}

function removElements(){
    removeLinks();
    removeText();
    removeAppStores();  
    amendCantScanLink();
}

function insertElements(){
    insertBackLink();
    insertTitle();
    !isTotp() && insertInfoBox();
}

function isTotp(){
    return $('input#otpCode').length ? true : false;
}

function display(){
    removElements();
    insertElements();
}

display();

$('#main-content').on('input', '#otpCode', function() {
    setTimeout(() => {
        removeErrors();    
        addItemLevelErrorClasses('mfa');
    }, 50);
});

$('#main-content').on('click', '#continue', function() {
    if (isTotp()){
        removeErrors();
        addItemLevelErrorClasses('mfa');
    }
});

function displayErrors(){
    $('.verifying-modal').hide();
    removeErrors();
    createErrorSummaryBox('mfa');
    addVerificationControlErrors('mfa');
}

// wait a second before trying to do this, in case the JS in head isn't loaded yet
setTimeout(function() {
    wrapXhrOpen('SelfAsserted', '"status":"400"', displayErrors);
}, 1000);