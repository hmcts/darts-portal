
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
                You are now leaving HMCTS.
                </p>
                <p>
                Performing the action below, means you will leave HMCTS.
                </p>
            </div>
            </div>`

    $(infoBox).insertBefore("#attributeVerification");
}

function insertTitle(){
    $("<h1>Authenticator app</h1>").insertBefore("#attributeList");
}

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