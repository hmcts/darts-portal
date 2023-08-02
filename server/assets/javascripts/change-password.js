document.getElementsByClassName('govuk-skip-link')[0].addEventListener("focusin", (event) => {
    document.getElementById('cancel').style.top = "100px";
})

document.getElementsByClassName('govuk-skip-link')[0].addEventListener("focusout", (event) => {
    document.getElementById('cancel').style.top = "60px";
})

function tabOrder() {
    document.getElementsByClassName('govuk-skip-link')[0].tabIndex = 1;
    document.getElementsByClassName('govuk-header__link govuk-header__link--homepage')[0].tabIndex = 2;
    document.getElementById('cancel').tabIndex = 3;
    document.getElementById('newPassword').tabIndex = 4;
    document.getElementById('reenterPassword').tabIndex = 5;
    document.getElementById('continue').tabIndex = 6;
}

tabOrder();

// change heading
$('.heading h1').text('Create a new password');
// remove asterisks
$('#newPassword_label').text($('#newPassword_label').text().replace('*', ''));
$('#reenterPassword_label').text($('#reenterPassword_label').text().replace('*', ''));
// remove placeholders
document.getElementById('newPassword').placeholder = '';
document.getElementById('reenterPassword').placeholder = '';
