const Generator = require('yeoman-generator');
// Tell Yeoman what to say
const yosay = require('yosay');
// Terminal string styling done right
const chalk = require('chalk');
const generator = require('./generator')

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts)
	}
	initializing() {
		const msg = chalk.yellow.bold('\n开始添加路由\n')
		this.log(yosay(msg))
	}
	prompting() {
		return this.prompt([
			{
				type: 'input',
				name: 'url',
				message: '请输入router的url：',
				default: this.name
			},{
				type: 'input',
				name: 'isMenuEn',
				message: '请输入英文菜单名称(如果隐藏则输入hide)：',
				default: this.name
			},{
				type: 'input',
				name: 'isMenuZh',
				message: '请输入中文菜单名称(如果隐藏则输入hide)：',
				default: this.name
			}
		]).then(result => {
			this.log('router:', JSON.stringify(result))
			generator.add([result.url, result.isMenuEn, result.isMenuZh])
		})
	}
};

/**
 * 自动化创建路由文件
 * 使用方法：
 * npm run generator
 * 回答问题方式输入路由信息
 * 例如：
 * url: a/b a表示文件夹名，b表示文件名(不加后缀)，只能输入纯英文
 * 菜单名称：中英文均可，输入hide则隐藏
 */
