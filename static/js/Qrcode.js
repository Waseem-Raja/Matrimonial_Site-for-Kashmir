var store = document.getElementById("adhar");
var store2 = document.getElementById("nname");
var store3 = document.getElementById("Agender");
var store4 = document.getElementById("Adistrict");
var store5 = document.getElementById("Adob");
var textt = document.getElementById("textt");
var btt = document.getElementById("btnn");
// var fileee = document.getElementById("filee");
const wrapper = document.querySelector(".wrapper"),
    form = document.querySelector("form"),
    fileInp = form.querySelector("input"),
    infoText = form.querySelector("p"),
    closeBtn = document.querySelector(".close"),
    copyBtn = document.querySelector(".copy");

function fetchRequest(file, formData) {
    infoText.innerText = "Scanning QR Code...";
    fetch("http://api.qrserver.com/v1/read-qr-code/", {
        method: 'POST',
        body: formData
    }).then(res => res.json()).then(result => {
        result = result[0].symbol[0].data;
        infoText.innerText = result ? "Upload QR Code to Scan" : "Couldn't scan QR Code";
        if (!result) return;
        debugger
        console.log(result);
        var str = result;
         let a=str.indexOf("uid");
        var str2 = str.substring(a+5, 80); //storing the adhar number

        let nameee= str.indexOf("name");
        let genderr= str.indexOf("gender");
        var str3=str.substring(nameee+6,genderr-2);   //storing the Name on the adhar card
        let str4=str.substring(genderr+8, 109);
        let dist=str.indexOf("dist");
        let subdist=str.indexOf("subdist");
        let str5=str.substring(dist+6, subdist-2);
        let dob= str.indexOf("dob");
        let str6= str.substring(dob+5 , dob+15);
        debugger
        if (str.includes("Baramula") || str.includes("Anantnag") ||
            str.includes("Budgam") || str.includes("Bandipore") ||
            str.includes("Ganderbal") || str.includes("Kupwara") ||
            str.includes("Kulgam") ||
            str.includes("Pulwama") || str.includes("Shopian") ||
            str.includes("Srinagar")) {
            // window.location.href = "/Registration";
            store.value = str2; //assigning the adhar number 
            store2.value= str3; //assigning the name on the adhar card
            store3.value= str4;
            store4.value=str5;
            store5.value=str6;

            // textt.innerText = "You are welcom click on the below button to register";
            // btt.style.display='block';
            btt.click(); //click the submit button automatically 
        } else {

            result = "sorry you are not the resident of jammu and kashmir";
            document.querySelector("textarea").innerText = result;
            form.querySelector("img").src = URL.createObjectURL(file);
            wrapper.classList.add("active");
        }
    }).catch(() => {
        infoText.innerText = "Couldn't scan QR Code";
    });
}

fileInp.addEventListener("change", async e => {
    debugger
    console.log(e);
    let file = e.target.files[0];
    console.log(" testing this stuff" +file);
    if (!file) return;
    let formData = new FormData();
    formData.append('file', file);
    console.log(FormData);
    fetchRequest(file, formData);
});

// copyBtn.addEventListener("click", () => {
//     let text = document.querySelector("textarea").textContent;
//     navigator.clipboard.writeText(text);
// });

form.addEventListener("click", () => fileInp.click());
// closeBtn.addEventListener("click", () => wrapper.classList.remove("active"));