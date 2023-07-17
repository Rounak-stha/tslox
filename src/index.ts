import Parser from './parser'
import Tokenizer from './tokenizer/tokenizer'
import AstToString from './AstToString'

/* const tokenizer = new Tokenizer('1+2 - (7 * 8 - 9)')
tokenizer.scanTokens()
const parser = new Parser(tokenizer.Tokens)
const result = parser.parse()
console.log(JSON.stringify(result, null, 4))

if (result) {
	const astPrinter = new AstToString()
	console.log(astPrinter.print(result))
} */

export function createAst(source: string) {
	const tokenizer = new Tokenizer(source)
	tokenizer.scanTokens()
	const parser = new Parser(tokenizer.Tokens)
	const result = parser.parse()
	if (result) {
		return JSON.stringify(result, null, 4)
	} else console.log('An Error Occoured')
}
