# vue3 
>`master`为初始化项目，暂无任何功能
>
>`vue3-ts-template`分支为基础模块
>
>`vue3-ts-admin`分支为功能模块

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Run your unit tests
```
yarn run test:unit
```

### Generate all svg components
```bash
yarn svg
# Note: need to run "yarn global add vue-svgicon" first
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 一些安装包介绍
**vue-class-component**
用基于类的API声明组件
https://github.com/vuejs/vue-class-component

**vue-property-decorator**
使用装饰器来简化书写 依赖于vue-class-component
https://github.com/kaorun343/vue-property-decorator

**vuex-class**
使用类编写vuex模块
https://www.npmjs.com/package/vuex-class

**vuex-module-decorators**
https://championswimmer.in/vuex-module-decorators/

**notes**
使用***path***的时候，需要在tsconfig.json里面的types项添加node