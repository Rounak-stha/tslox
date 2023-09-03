import { LoxBulkError } from '../error/LoxBulkError'
import LoxError from '../error/LoxError'
import Parser, { SyntaxTree } from '../parser'
import Tokenizer from '../tokenizer'

export default function createAst(source: string): SyntaxTree {
    const tokenizer = new Tokenizer(source)
    try {
        tokenizer.scanTokens()
    } catch (e) {
        if (e instanceof LoxError) throw new LoxBulkError('Syntax', [e])
    }
    const parser = new Parser(tokenizer.Tokens)
    return parser.parse()
}
