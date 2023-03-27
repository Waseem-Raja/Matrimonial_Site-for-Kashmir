debugger
let store=document.getElementById("email");


// store2.value=store.value;

console.log(document.getElementById("email").value);
let form1=document.getElementById("fotp");
let form2=document.getElementById("register-form");


const btn = document.getElementById('btn');

btn.addEventListener('click', () => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(store.value))
  {
    


    document.getElementById("hemail").value=store.value;

    // 👇️ this SHOWS the form
    form2.style.display = 'none';

    // 👇️ this HIDES the form
    form1.style.display = 'block';
  }
  else
    alert("enter  valid email address");
  
});
/*
Name: 'Saira Bano',
name: 'Saira',
age: 24,
password: 'diwwqwfw',
Adharno: 967825701145,
dob: '1998-06-18',
gender: 'female',
emaill: 'corol12711@rubeshi.com',
filee: '/static/images/mudasir.jpeg',
qualification: 'Graduate',
txtEmpPhone: 7780803946,
chdistrict: 'Kulgam',
Profession: 'Teacher',
Bio: 'hello peopl , i am d can take care of my family ',
Verified: true,
__v: 0,
Deactivated: false,
Divorced: 'No'*/