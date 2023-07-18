function tabOrder() {
  if (document.getElementById('email')) {
    document.getElementById('email').tabIndex = 1;
  }
  if (document.getElementById('password')) {
    document.getElementById('password').tabIndex = 2;
  }
  if (document.getElementById('forgotPassword')) {
    document.getElementById('forgotPassword').tabIndex = 3;
  }
  if (document.getElementById('rememberMe')) {
    document.getElementById('rememberMe').tabIndex = 4;
  }
  if (document.getElementById('next')) {
    document.getElementById('next').tabIndex = 5;
  }
  if (document.getElementById('dedicatedPage')) {
    document.getElementById('dedicatedPage').tabIndex = 6;
  }
}

tabOrder();
