import fs from 'fs'
import path from 'path'
import { Expr } from './expression'
import Parser from './parser'
import Tokenizer from './tokenizer/tokenizer'
import AstToString from './AstToString'
import { Interpreter } from './interpreter'

// const astPrinter = new AstToString()
// console.log(astPrinter.print(result))

function run(source: string) {
    const interpreter = new Interpreter()
    const tokenizer = new Tokenizer(source)
    tokenizer.scanTokens()
    const parser = new Parser(tokenizer.Tokens)
    const expr = parser.parse()
    interpreter.interpret(expr as Expr)
}

function runFile(filePath: string) {
    if (!path.isAbsolute(filePath)) filePath = path.join(process.cwd(), filePath)
    const source = fs.readFileSync(filePath, { encoding: 'utf-8' })
    run(source)
}

async function runPrompt() {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
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

export function createAst(source: string) {
    const tokenizer = new Tokenizer(source)
    tokenizer.scanTokens()
    const parser = new Parser(tokenizer.Tokens)
    const result = parser.parse()
    if (result) {
        return JSON.stringify(result, null, 4)
    } else console.log('An Error Occoured')
}
