import Tokenizer from '../src/tokenizer/tokenizer'
import Parser from '../src/parser'
import { ExpressionStmt, PrintStmt, Stmt, VarStmt } from '../src/statement'
import LoxError from '../src/error/LoxError'
import { Assignment, Binary, Ternary } from '../src/expression'

function parse(source: string): Stmt[] {
    const tokenizer = new Tokenizer(source)
    tokenizer.scanTokens()
    const tokens = tokenizer.Tokens
    const parser = new Parser(tokens)
    const statements = parser.parse()
    if (!statements) {
        throw parser.errors
    }
    return statements
}

describe('Test Parser', () => {
    it('Test Parse Var Dec. Assignment and Print Stmts', () => {
        const source = `
        var a = 1;
        var b;
        b = a;
        print a + b;
        `
        const statements = parse(source)

        expect(statements.length).toBe(4)

        // Statements are tested
        expect(statements[0]).toBeInstanceOf(VarStmt)
        expect(statements[1]).toBeInstanceOf(VarStmt)
        expect(statements[2]).toBeInstanceOf(ExpressionStmt)
        expect((statements[2] as ExpressionStmt).expression).toBeInstanceOf(Assignment)
        expect(statements[3]).toBeInstanceOf(PrintStmt)
        expect((statements[3] as PrintStmt).expression).toBeInstanceOf(Binary)
    })

    it('Test Parse Ternary', () => {
        const source = `a = b == 1 ? true : false;`
        const statement = parse(source)[0]

        expect(statement).toBeInstanceOf(ExpressionStmt)
        expect((statement as ExpressionStmt).expression).toBeInstanceOf(Assignment)
        expect(((statement as ExpressionStmt).expression as Assignment).value).toBeInstanceOf(Ternary)
    })

    it('Test Parser Errors', () => {
        const source = `var a = 
        var b = 1
        var
        1 + 1;
        1 = 2;
        `
        try {
            parse(source)
        } catch (e) {
            if (e instanceof Array) {
                expect(e.length).toBe(4)
                expect(e[0].message).toBe("[Syntax Error | Line: 1] Expression Expected, Got 'var'")
                expect(e[1].message).toBe("[Syntax Error | Line: 2] Expected ';' after variable declaration")
                expect(e[2].message).toBe('[Syntax Error | Line: 3] Expected Varible Name')
                expect(e[3].message).toBe('[Syntax Error | Line: 5] Invalid Assignment Target')
            }
        }
    })
})
