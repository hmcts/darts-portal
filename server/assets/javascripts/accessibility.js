//File used strictly for updating HTML for accessibility purposes
function loginAccessibility(){
    //Set aria-required attribute to email input in azure b2c login form
    if (document.getElementsById('email')) {
        document.getElementsById('email').setAttribute("aria-required", "true");
    }
}

