debugger
let store = document.getElementById("remail");


// store2.value=store.value;

console.log(document.getElementById("remail").value);
let form1 = document.getElementById("R1form");
let form2 = document.getElementById("Rform");



const btn = document.getElementById('Rrebtn');

const show = () => {

  document.getElementById("rremail").value = store.value;

  // 👇️ this SHOWS the form
  form2.style.display = 'block';

  // 👇️ this HIDES the form
  form1.style.display = 'none';

};


//show password
const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#password');

togglePassword.addEventListener('click', function (e) {
  // toggle the type attribute
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);
  // toggle the eye slash icon
  this.classList.toggle('fa-eye-slash');
});


// function CheckPassword() {

//   let inputtxt = password;
//   var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
//   if (inputtxt.value.match(passw)) {
//     // alert('Correct, try another...')
//     return true;
//   } else {
//     alert('your password must contain at least one numeric digit, one uppercase, and one lowercase letter,');
//     return false;
//   }
// }