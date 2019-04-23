var program;
const fs = require('fs-extra');

function add(arg) {
	console.log(arg);
 	program = arg
	if (!arg[0]) {
		console.log('请输入正确参数如: yarn cli 路径/文件名 路由名称')
		return
	}
	return new Promise((resolve, reject) => {
		// 只能输入纯英文路径
		if (/^[a-z/A-Z]+$/.test(arg[0])) {
			ensureDir()
		} else {
			reject('请输入正确格式的url，例：a/b')
		}
	})
};
// 创建文件
function ensureDir() {
	return fs.ensureDir('src/views/' + program[0].split('/')[0]).then(() => {
		console.log('目录正确，开始插入模板')
		insert(program[0].split('/')[0], program[0].split('/')[1])
	})
};
// 插入文件
function insert(directory, name) {
	try {
		console.log(`目录是：${directory}/${name}`)
		fs.copy('config/template.vue', `src/views/${directory}/${name}.vue`)
		.then(() => {
				const createVuePromise = createVueSass(directory, name)
				const addRouterPromise = modifyRouter(directory, name)
				const modifyZhPromise = modifyZh()
				const modifyEnPromise = modifyEn()
				Promise.all([createVuePromise, addRouterPromise, modifyZhPromise, modifyEnPromise])
			})
			.catch(err => {
				console.log(err)
			})
	} catch (err) {
		console.error(err)
	}
};
// 生成vue/sass文件
function createVueSass(directory, name) {
	return fs.readFile(`src/views/${directory}/${name}.vue`, 'utf8', (err, data) => {
		if (err) return console.error(err)
		// const fileData = data.replace(/name:(.*)/, `name: '${name.replace('.vue', '')}',`)
		const files = data.replace(/sassURL/, `src/styles/${directory}/${name}.sass`)
		const outPutVuePromise = outPutVue(directory, name, files)
		const outPutSassPromise = outPutSass(directory, name)
		Promise.all([outPutVuePromise, outPutSassPromise])
	})
};
function outPutVue(directory, name, files) {
  	return fs.outputFile(`src/views/${directory}/${name}.vue`, files, err => {
	    if (err) {
	      	throw new Error(err)
	    }
	    console.log('vue模板生成成功')
  	})
};
function outPutSass(directory, name) {
	return fs.outputFile(`src/styles/${directory}/${name}.sass`, `// src/views/${directory}/${name}.vue`, err => {
	    if (err) {
	      	throw new Error(err)
	    }
	    console.log('sass模板生成成功')
  	})
};
// 添加路由
function modifyRouter(directory, name) {
  	return fs.readFile('src/router.ts', 'utf-8', (error, data) => {
	    if (error) {
				throw new Error(error)
	    }
	    const datas = data.replace('// router-auto不能删除', addRouter(directory, name))
	    updateRouter(datas)
  	})
};
function addRouter(path, name) {
	return `{
		path: '/${path}',
		component: Layout,
		redirect: '${name}',
		meta: { hidden: ${ program[1] === 'hide' } },
		children: [{
			path: '${name}',
			component: () => import(/* webpackChunkName: "${path}" */ '@/views/${path}/${name}.vue'),
			name: '${program[1]}',
			meta: { title: '${program[1]}', icon: 'form' }
		}]
	},
	// router-auto不能删除`
};
function updateRouter(datas) {
  	return fs.outputFile('src/router.ts', datas, error => {
	    if (error) {
	      	throw new Error(error)
	    }
	    console.log('路由生成成功')
	    if (program[1] === 'hide') {
	      	console.log('这个路由不会出现在菜单里面')
	    }
  	})
};
// 语言添加
function modifyZh() {
	return fs.readFile('src/lang/zh.ts', 'utf-8', (error, data) => {
		if (error) {
			throw new Error(error)
		}
		// const datafiles = data.replace('// routerName不能删除', `${program[0].replace('/', '')}: '${program[1] === 'hide' ? '' : program[2]}',\r\n    // routerName不能删除`)
		console.log(program)
		if (program[1] !== 'hide') {
			const datafiles = data.replace('// routerName不能删除', `${program[1]}: '${program[2]}',\r\n    // routerName不能删除`)
			updateZh(datafiles)
		}
	})
};
function updateZh(datafiles) {
  	return fs.outputFile('src/lang/zh.ts', datafiles, error => {
    	if (error) {
				throw new Error(error)
    	}
	    console.log('路由名称生成成功')
	    if (program[1] === 'hide') {
				console.log('这个路由不会出现在菜单里面')
	    }
  })
}
function modifyEn() {
	return fs.readFile('src/lang/en.ts', 'utf-8', (error, data) => {
		if (error) {
			throw new Error(error)
		}
		if (program[1] !== 'hide') {
			const datafiles = data.replace('// routerName不能删除', `${program[1]}: '${program[1]}',\r\n    // routerName不能删除`)
			updateEn(datafiles)
		}
	})
};
function updateEn(datafiles) {
  	return fs.outputFile('src/lang/en.ts', datafiles, error => {
    	if (error) {
      		throw new Error(error)
    	}
	    console.log('路由名称生成成功')
	    if (program[1] === 'hide') {
	      	console.log('这个路由不会出现在菜单里面')
	    }
  })
}

exports = module.exports = { add }
