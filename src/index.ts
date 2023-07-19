import { Expr } from './expression'
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
})

import Parser from './parser'
import Tokenizer from './tokenizer/tokenizer'
import AstToString from './AstToString'
import { Interpreter } from './interpreter'

/* const tokenizer = new Tokenizer('1+2 - (7 * 8 - 9)')
tokenizer.scanTokens()
const parser = new Parser(tokenizer.Tokens)
const result = parser.parse()
console.log(JSON.stringify(result, null, 4))

if (result) {
	const astPrinter = new AstToString()
	console.log(astPrinter.print(result))
} */

async function prompt(): Promise<string> {
	return new Promise((resolve) => {
		readline.question('>', (source: string) => resolve(source))
	})
}

export function createAst(source: string) {
	const tokenizer = new Tokenizer(source)
	tokenizer.scanTokens()
	const parser = new Parser(tokenizer.Tokens)
	const result = parser.parse()
	if (result) {
		return JSON.stringify(result, null, 4)
	} else console.log('An Error Occoured')
}

;(async function () {
	const interpreter = new Interpreter()
	for (;;) {
		const source = await prompt()
		const tokenizer = new Tokenizer(source)
		tokenizer.scanTokens()
		const parser = new Parser(tokenizer.Tokens)
		const expr = parser.parse()

		interpreter.interpret(expr as Expr)
	}
})()
