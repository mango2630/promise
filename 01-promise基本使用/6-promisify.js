/* 
    util.promisify
    传入一个遵循常见的错误优先的回调风格函数
*/
const util = require('util');
const fs = require('fs')
// 返回一个新的函数
let mineReadFile = util.promisify(fs.readFile);

mineReadFile('./resource/test.txt')
.then(value => {
    console.log(value.toString());
}, reason => {
    console.log(reason);
})