const fs = require('fs');

// 回调函数形式
/* fs.readFile('./resource/test.txt', (err, data) => {
    if (err) throw err;
    console.log(data.toString());
}) */

// Promise形式
let p = new Promise((resolve, reject) => {
    fs.readFile('./resource/test.txt', (err, data) => {
        if (err) reject(err);
        resolve(data.toString());
    })
})
p.then((value)=>{
    console.log(value);
}, reason=>{
    console.log(reason);
})