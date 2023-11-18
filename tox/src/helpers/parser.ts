import path from 'path'
import fs from 'fs'
import Tokenizer from '../tokenizer'
import Parser from '../parser'
import LoxError from '../error/LoxError'
import { LoxBulkError } from '../error/LoxBulkError'

function run(source: string) {
    try {
        const tokenizer = new Tokenizer(source)
        tokenizer.scanTokens()
        const parser = new Parser(tokenizer.Tokens)
        const expr = parser.parse()
        console.log(JSON.stringify(expr, null, 4))
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
