var show = document.getElementById("show");
var i = 0;
Qoutes = [
  "A successful marriage requires falling in love many times, always with the same person.",
  "A great marriage is not when the ‘perfect couple’ comes together. It is when an imperfect couple learns to enjoy their differences.",
  "Never marry the one you can live with, marry the one you cannot live without.",
  "A good marriage is one which allows for change and growth in the individuals and in the way they express their love.",
  "Marriage is not about age; it’s about finding the right person."
]
window.onscroll = function () {

  if (i == 5)
    i = 0;
  else
    show.innerHTML = Qoutes[i++];

}

// getdata();
// function getdata() {

//   fetch('https://www.stands4.com/services/v2/quotes.php')  //Qoutes api
//       .then(response => response.json())
//       .then(data => {     //this promise returns the object(data)
//           console.log(data) // Prints result from `response.json()` in getRequest


//           show.value=data;

//       })
//       .catch(error => console.error(error))

// }

// var category = 'dating'
// const getdata = ({
//   method: 'GET',
//   url: 'https://love-quote.p.rapidapi.com/lovequote',
//   headers: {
//     'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
//     'X-RapidAPI-Host': 'love-quote.p.rapidapi.com'
//   },
//   contentType: 'application/json',
//   success: function (result) {
//     console.log(result);
//     show.value = result.qoute;
//   },
//   error: function ajaxError(jqXHR) {
//     console.error('Error: ', jqXHR.responseText);
//   }
// });


const btn = document.getElementById('btn');

btn.addEventListener('click', () => {
  const form = document.getElementById('form2');

  if (form.style.display === 'none') {
    // 👇️ this SHOWS the form
    form.style.display = 'block';
  } else {
    // 👇️ this HIDES the form
    form.style.display = 'none';
  }
});

