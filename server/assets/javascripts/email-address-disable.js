document.addEventListener("DOMContentLoaded", (event) => {
    var input = document.getElementsByClassName('textInput')[0];

    button = document.getElementById('emailVerificationControl_but_verify_code');

    button.addEventListener("click", () => {
        if (input.value !== '') {
            input.disabled = true;
        }
    })

});





