// new KvUE({data: {}})

class KVue {
    constructor(options) {
        this.$options = options;

        // 数据响应
        this.$data = options.data;
        this.observe(this.$data);
        // 模拟watcher的创建
        // new Watcher();
        // this.$data.test;
        // new Watcher();
        // this.$data.test;

        new Compile(options.el, this);

        // created执行
        if (options.created) {
            options.created.call(this);
        }
    }

    observe(value) {
            if (!value || typeof value !== 'object') {
                return;
            }

            // 遍历对象
            Object.keys(value).forEach(key => {
                this.defineReactive(value, key, value[key]);
                // 代理data中的属性到vue实例上
                this.ProxyData(key);
            })
        }
        // 数据响应
    defineReactive(obj, key, val) {

        this.observe(val); // 递归解决数据嵌套的问题

        const dep = new Dep();

        Object.defineProperty(obj, key, {
            get() {
                Dep.target && dep.addDep(Dep.target);
                return val;
            },
            set(newval) {
                if (newval === val) {
                    return;
                }
                val = newval;
                // console.log(`${key}属性更新了：${val}`);
                dep.notify();
            }
        })
    }

    ProxyData(key) {
        Object.defineProperty(this, key, {
            get() {
                return this.$data[key];
            },
            set(newVal) {
                this.$data[key] = newVal;
            }
        })
    }

}

// Dep: 用来管理Watcher

class Dep {
    constructor() {
        // 这里存放若干依赖（watcher）
        this.deps = [];
    }

    addDep(dep) {
        this.deps.push(dep);
    }

    notify() {
        this.deps.forEach(dep => dep.update());
    }

}

// watcher
class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm;
        this.key = key;
        this.cb = cb;
        // 将当前watcher实例制定到Dep镜头属性targrt
        Dep.target = this;
        this.vm[this.key]; // 触发getter,添加依赖
        Dep.target = null; // 避免重复添加
    }

    update() {
        console.log("属性更新了~！")
        this.cb.call(this.vm, this.vm[this.key]);


    }
}