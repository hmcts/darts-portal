(function () {
    console.log("Before XHR Prototype Open Override");
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        console.log("Inside XHR Prototype Open Override");
        const requestURL = arguments[1];
        console.log("Before Load event listener");
        this.addEventListener('load', function (event) {
            console.log("After Load event listener");
            const isForSendCode = requestURL.indexOf('SendCode') > 0
            const isSuccessful = this.readyState === 4 && this.responseText === `{"status":"200"}`

            console.log("Before If statement");
            if (isForSendCode && isSuccessful) {
                console.log("Inside If Statement");
                setTimeout(() => {
                    // hide intro
                    document.getElementsByClassName('intro').item(0).style.display = 'none'
                    // hide email label
                    document.getElementById('email_label').style.display = 'none'
                    // disable email input
                    document.getElementById('email').disabled = true;
                }, 0)
            }
        });
        console.log("Before applying origOpen.apply");
        origOpen.apply(this, arguments);
        console.log("After applying origOpen.apply");
    };
})();
