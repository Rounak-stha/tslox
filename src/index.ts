import Parser from './parser'
import Tokenizer from './tokenizer/tokenizer'

const tokenizer = new Tokenizer('1 + 2 / 3 -* 6')
tokenizer.scanTokens()
const parser = new Parser(tokenizer.Tokens)
console.log(parser.parse())
