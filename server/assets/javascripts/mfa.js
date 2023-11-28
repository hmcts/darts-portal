
function insertBackLink(){
    $(`<a href="${document.referrer}" class="govuk-back-link">Back</a>`).insertBefore("#attributeVerification");
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
    $("<h1>Authenticator app</h1>").insertBefore("#attributeList");
}

function hideTryThisLink(){
    $('a[href^="otpauth://"]').hide();
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
    const externalIdMatch = authDetails.match(/hmcts-stg-external-id:([^?]+)/);
    const secretMatch = authDetails.match(/secret=([^&]+)/);
    
    if (externalIdMatch && secretMatch) {
        details.externalId = externalIdMatch[1];
        details.secret = secretMatch[1];
        console.log(details);
        return details;
    } else {
        details.externalId = 'Error finding account details';
        details.secret = 'Cannot find secret';
        return details;
    }
}

// when clicking "Can't scan? Try this", show Account Details
$('#totpQrCodeControl-text').click(function () {
    showAccountDetails();
});

function removeAppStores(){
    $('a#authenticatorAppIconControl-google').text('Google Play');
    $('a#authenticatorAppIconControl-apple').text('Apple App Store');
}

function removeText(){
    $('div.intro').remove();  
}

function removeButtons(){
    $('button#cancel').remove();
}

function removeLinks(){
    $('a.helpLink').remove();
    $('li.authenticatorInfoControl_li').remove();
    $('a[href^="otpauth://"]').attr('href', '#');
}

function removElements(){
    removeLinks();
    removeButtons();
    removeText();
    removeAppStores();  
}

function insertElements(){
    insertTitle();
    insertBackLink();
    insertInfoBox();
}

function display(){
    removElements();
    insertElements();
}

display();