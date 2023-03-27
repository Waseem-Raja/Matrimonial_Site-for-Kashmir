let key = "helloitsnodejsproject";
let key2 = 12;


function isLetter(str) {
    return str.length === 1 && str.match(/[a-zA-Z]/i)
}


function isUpperCase(character) {
    if (character === character.toUpperCase()) {
        return true
    }
    if (character === character.toLowerCase()) {
        return false
    }
}

function isNumberr(message) {
    return message.isNumber;
}

async function encrypt(message) {
    // let bool = await isNumberr(message);
    // if (bool == false) {
    let result = ''

    for (let i = 0, j = 0; i < message.length; i++) {
        const c = message.charAt(i)
        if (isLetter(c)) {
            if (isUpperCase(c)) {
                result += String.fromCharCode((c.charCodeAt(0) + key.toUpperCase().charCodeAt(j) - 2 * 65) % 26 + 65) // A: 65
            } else {
                result += String.fromCharCode((c.charCodeAt(0) + key.toLowerCase().charCodeAt(j) - 2 * 97) % 26 + 97) // a: 97
            }
        } else {
            result += c
        }
        j = ++j % key.length
    }
    return result;
    // } else {

    //     return parseInt(message) + key2;

    // }
}


async function decrypt(message) {

    // let bool = await isNumberr(message);
    // if (bool == false) {
    let result = ''

    for (let i = 0, j = 0; i < message.length; i++) {
        const c = message.charAt(i)
        if (isLetter(c)) {
            if (isUpperCase(c)) {
                result += String.fromCharCode(90 - (25 - (c.charCodeAt(0) - key.toUpperCase().charCodeAt(j))) % 26)
            } else {
                result += String.fromCharCode(122 - (25 - (c.charCodeAt(0) - key.toLowerCase().charCodeAt(j))) % 26)
            }
        } else {
            result += c
        }
        j = ++j % key.length
    }
    return result;
    // } else {
    //     return parseInt(message) - key2;
    // }
}



// function encrypt(text , shift) {
//     let result = "";
//     for (let i = 0; i < text.length; i++) {
//         let c = text.charCodeAt(i);
//         if (c >= 48 && c <= 57) result += String.fromCharCode((c - 48 + shift) % 10 + 48); // Digits
//         else if (c >= 65 && c <= 90) result += String.fromCharCode((c - 65 + shift) % 26 + 65); // Uppercase
//         else if (c >= 97 && c <= 122) result += String.fromCharCode((c - 97 + shift) % 26 + 97); // Lowercase
//         else result += text.charAt(i); // Copy
//     }
//     return result;
// }

// function decrypt(text ,shift) {
//     return encrypt(text , 10-shift);
// }
module.exports = {
    encrypt,
    decrypt


};