$('#email_label').text($('#email_label').text().replace('*', ''));
document.getElementById('email').placeholder = '';
(function () {
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        const requestURL = arguments[1];
        this.addEventListener('load', function (event) {
            const isForSendCode = requestURL.indexOf('SendCode') > 0
            const isSuccessful = this.readyState === 4 && this.responseText === `{"status":"200"}`

            if (isForSendCode && isSuccessful) {
                setTimeout(() => {
                    // hide intro
                    document.getElementsByClassName('intro').item(0).style.display = 'none'
                    // hide email label
                    document.getElementById('email_label').style.display = 'none'
                    // disable email input
                    document.getElementById('email').style.display = 'none';
                    // remove asterisk from Verification code
                    document.getElementById('emailVerificationCode_label').innerHTML.replace('*', '');
                    // remove placeholder from Input box
                    document.getElementById('emailVerificationCode').placeholder = '';
                }, 0)
            }
        });
        origOpen.apply(this, arguments);
    };
})();
