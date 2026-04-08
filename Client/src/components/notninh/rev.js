// function rev(str){
//     if(typeof str !== 'string') {
//         throw new Error('Input must be a string');
//     }
//     return str.split('').reverse().join('');

// }
// console.log(rev("hello")); // Output: "olleh"
// Method 1: With user input
function palindrome(str) {
    if (typeof str !== 'string') {
        throw new Error('Input must be a string');
    }
    const cleanedStr = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const reversedStr = cleanedStr.split('').reverse().join('');
    return cleanedStr === reversedStr;
}

// Test the function
const testString = "A man, a plan, a canal, Panama";
console.log("Enter a string to check palindrome:", testString);
console.log("Is palindrome?", palindrome(testString));