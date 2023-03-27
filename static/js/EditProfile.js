//show password
const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#ppassword');

togglePassword.addEventListener('click', function (e) {
  // toggle the type attribute
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);
  // toggle the eye slash icon
  this.classList.toggle('fa-eye-slash');
});

// let input = document.getElementById("pname");
// function isValidInput() {
//   if (/^[a-z0-9_]+$/.test(input))
//     return true;
//   else
//     alert("your username should contain underscore numbers and lowercase alphabets");
// }









