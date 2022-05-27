const fs = require("fs");

/* 
    参数：path 文件路径
    返回：prmise 对象
*/
function mineReadFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) reject(err);
            resolve(data.toString())
        })
    })
}

mineReadFile('./resource/test.txt')
.then((data) => {
    console.log(data);
}, (reason) => {
    console.log(reason);
})

