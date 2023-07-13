document.addEventListener("DOMContentLoaded", (event) => {
    var input = document.getElementsByClassName('textInput')[0];

    button = document.getElementById('emailVerificationControl_but_verify_code');

    if (button !== false) {
        if (input.value !== '') {
            input.disabled = true;
        }
    }


});





