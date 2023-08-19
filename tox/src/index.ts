import fs from 'fs'
import path from 'path'
import Parser, { SyntaxTree } from './parser'
import Tokenizer from './tokenizer/tokenizer'
import { Interpreter } from './interpreter'
import LoxError from './error/LoxError'
import { LoxBulkError } from './error/LoxBulkError'

// const astPrinter = new AstToString()
// console.log(astPrinter.print(result))

const interpreter = new Interpreter()

function run(source: string) {
    let tree: SyntaxTree
    try {
        const tokenizer = new Tokenizer(source)
        tokenizer.scanTokens()
        const parser = new Parser(tokenizer.Tokens)
        tree = parser.parse()
        // console.log(JSON.stringify(statements, null, 2))
        interpreter.interpret(tree.body)
    } catch (e) {
        if (e instanceof LoxError) {
            console.log(e.message)
        } else if (e instanceof LoxBulkError) {
            e.errors.forEach((e) => console.log(e.message))
        } else throw e
    }
}

function runFile(filePath: string) {
    if (!path.isAbsolute(filePath)) filePath = path.join(process.cwd(), filePath)
    const source = fs.readFileSync(filePath, { encoding: 'utf-8' })
    run(source)
}

async function runPrompt() {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    })
    async function prompt(): Promise<string> {
        return new Promise((resolve) => {
            readline.question('>', (source: string) => resolve(source))
        })
    }

    for (;;) {
        const source = await prompt()
        run(source)
    }
}

;(async function main() {
    const filePath = process.argv[2]
    if (filePath) {
        runFile(filePath)
    } else {
        runPrompt()
    }
})()

export function createAst(source: string): SyntaxTree {
    const tokenizer = new Tokenizer(source)
    try {
        tokenizer.scanTokens()
    } catch (e) {
        if (e instanceof LoxError) throw new LoxBulkError('Syntax', [e])
    }
    const parser = new Parser(tokenizer.Tokens)
    return parser.parse()
}
