class Promise{
    
    // 构造方法
    constructor(executor) {
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

    // then方法
    then(onResolved, onRejcted) {
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

    catch(onRejcted) {
        return this.then(undefined, onRejcted);
    }

    static resolve(value) {
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

    static reject(reason) {
        // 永远返回失败的reject
        return new Promise((resolve, reject) => {
            reject(reason);
        })
    }

    static all(promises) {
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


    static race(promises) {
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
}