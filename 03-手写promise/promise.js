// 声明构造函数
function Promise(executor) {
    /* 
    Promise
        [[Prototype]]: Promise
        [[PromiseState]]: "pending"
        [[PromiseResult]]: null
    */

    // console.log(this); // Promsie{}

    // 添加属性
    this.PromiseState = "pending";
    this.PromiseResult = null;
    // 声明属性
    this.callbacks = [];
    // 保存实例对象的 this 值
    const self = this;

    // resolve 函数
    function resolve(data) {
        // console.log(this); // window

        // 判断状态,让状态只能修改一次
        if (self.PromiseState  !== "pending") return ;

        // 修改对象的状态(PromiseState)
        self.PromiseState = "fulfilled";

        // 设置对象结果值(PromiseResult)
        self.PromiseResult = data;

        // 调用成功的回调函数
        // if (this.callback.onResolved) {
        //     self.callback.onResolved(data);
        // }

        setTimeout(() => {
            self.callbacks.forEach(item => {
                item.onResolved(data);
            })
        })
    }

    // reject 函数
    function reject(data) {
        // 判断状态,让状态只能修改一次
        if (self.PromiseState  !== "pending") return ;

        // 修改对象的状态(PromiseState)
        self.PromiseState = "rejected";

        // 设置对象结果值(PromiseResult)
        self.PromiseResult = data;

        // 调用成功的回调函数
        // if (this.callback.onRejcted) {
        //     self.callback.onRejcted(data);
        // }
        setTimeout(()=>{
            self.callbacks.forEach(item => {
                item.onRejcted(data);
            })
        })
    }
    
    try{
        // 执行器函数在内部是同步调用的。
        executor(resolve, reject);
    }catch(e) {
        reject(e);
    }
}

// 添加 then 方法
Promise.prototype.then = function(onResolved, onRejcted) {
    //调用回调函数  PromiseState
    // if (this.PromiseState === 'fulfilled') {
    //     onResolved(this.PromiseResult);
    // }
    // if (this.PromiseState === 'rejected') {
    //     onRejected(this.PromiseResult);
    // }

    const self = this;
    return new Promise((resolve, reject) => {

        function callback(type) {
            try {
                let res = type(self.PromiseResult);
                if (res instanceof Promise) {
                    res.then( v => {
                        resolve(v);
                    }, r => {
                        reject(r);
                    })
                } else {
                    // 状态为成功
                    resolve(res)
                }
            }catch(e) {
                reject(e);
            }
        }

        // 调用回调函数
        if (this.PromiseState === "fulfilled") {
            setTimeout(()=>{
                callback(onResolved);
            })
        }

        if (this.PromiseState === "rejected") {
            setTimeout(()=>{
                callback(onRejcted);
            })
        }

        // 判断pending状态
        if (this.PromiseState === "pending") {
            // 保存回调函数
            this.callbacks.push({
                onResolved: callback(onResolved),
                onRejcted: callback(onRejcted)
            })
        }
    })
}

// 添加catch方法
Promise.prototype.catch = function(onRejcted) {
    return this.then(undefined, onRejcted);
}

/**
 * 添加 Promise.resolve 方法
 * @param {*} value 
 * @returns 
 */
Promise.resolve = function(value) {
    return new Promise((resolve, reject) => {
        if (value instanceof Promise) {
            value.then( v => {
                resolve(v);
            }, r => {
                reject(r);
            })
        } else {
            // 如果不是promise,则成功
            resolve(value)
        }
    })
}

/**
 * 添加 Promise.reject 方法
 * @param {*} reason 
 * @returns
 */
Promise.reject = function(reason) {
    // 永远返回失败的reject
    return new Promise((resolve, reject) => {
        reject(reason);
    })
}

/**
 * 添加 Promise.all 方法
 * @param {Array} promises 
 */
Promise.all = function(promises) {
    return new Promise((resolve, reject) => {
        let count = 0;
        let arr = [];
        for (let i = 0; i < promises.length; i ++) {
            promises[i].then(v => {
                // 得知对象的状态是成功的
                // 每个都是成功,再返回成功
                count ++;
                // 保证顺序是不变的.
                arr[i] = v;
                if (count === Promise.length) {
                    resolve(arr);
                }
            }, r => {
                reject();
            })
        }
    })
}

/**
 * 封装Promise.race方法
 * 谁先改变状态谁决定返回结果.
 * @param {Array} promises
 */
Promise.race = function(promises) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i ++) {
            promises[i].then(v => {
                resolve(v);
            }, r => {
                reject(r);
            })
        }
    })
}

/* 
    1. 生命构造函数，添加then方法
    2. 写执行器，resolve(),reject()
    3. 抛出异常处理
    4. 让状态只能修改一次
    5. then 方法完善
    6. 异步回调执行 callback
    7. 指定多个回调实现 callbacks
    8. 同步任务 then 返回结果
    9. 异步任务 then 返回结果
    10. 封装catch, 异常穿透
    11. resolve 封装
    12. reject 封装
    13. all 方法封装
    14. race 方法
    15. then 方法回调的异步执行
    16. class版本promise
*/