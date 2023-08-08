import { Binary, Literal, variable } from '../src/expression'
import { PrintStmt, VarStmt, ExpressionStmt, BlockStmt, WhileStmt, IfStmt, FunctionStmt, Stmt } from '../src/statement'
import Token from '../src/tokenizer/Token'
import TokenType from '../src/tokenizer/TokenType'

describe('Test Statement', () => {
    it('Test Var Statement', () => {
        const name = new Token(TokenType.IDENTIFIER, 'name', null, 1)
        const initializer_1 = null
        const initializer_2 = new Literal(1)

        const varStmt_1 = new VarStmt(name, initializer_1)
        const varStmt_2 = new VarStmt(name, initializer_2)

        expect(varStmt_1).toEqual({
            name: { type: 'IDENTIFIER', lexeme: 'name', literal: null, line: 1 },
            initializer: null,
        })

        expect(varStmt_2).toEqual({
            name: { type: 'IDENTIFIER', lexeme: 'name', literal: null, line: 1 },
            initializer: { value: 1 },
        })
    })

    it('Test Print Statement', () => {
        const printStmt = new PrintStmt(
            new Binary(new Literal(1), new Token(TokenType.PLUS, '+', null, 1), new Literal(2))
        )

        expect(printStmt).toEqual({
            expression: {
                left: { value: 1 },
                operator: { type: 'PLUS', lexeme: '+', literal: null, line: 1 },
                right: { value: 2 },
            },
        })
    })

    it('Test Expression Statement', () => {
        const exprStmt = new ExpressionStmt(
            new Binary(new Literal(1), new Token(TokenType.STAR, '*', null, 1), new Literal(2))
        )

        expect(exprStmt).toEqual({
            expression: {
                left: { value: 1 },
                operator: { type: 'STAR', lexeme: '*', literal: null, line: 1 },
                right: { value: 2 },
            },
        })
    })

    it('Test Block Statement', () => {
        const blockstmt1 = new BlockStmt([])
        const blockStmt2 = new BlockStmt([
            new PrintStmt(new Binary(new Literal(1), new Token(TokenType.PLUS, '+', null, 1), new Literal(2))),
            new ExpressionStmt(new Binary(new Literal(1), new Token(TokenType.STAR, '*', null, 1), new Literal(2))),
        ])

        expect(blockstmt1.body.length).toEqual(0)
        expect(blockStmt2.body.length).toEqual(2)
    })

    it('Test Function Declaration Statement', () => {
        const funcDeclarationStmt = new FunctionStmt(
            new Token(TokenType.IDENTIFIER, 'NuName', 'NuName', 1),
            [
                new Token(TokenType.IDENTIFIER, 'param1', 'param1', 1),
                new Token(TokenType.IDENTIFIER, 'param2', 'param2', 1),
            ],
            [new PrintStmt(new Binary(new Literal(1), new Token(TokenType.PLUS, '+', null, 1), new Literal(2)))]
        )

        expect(Object.keys(funcDeclarationStmt)).toEqual(['name', 'parameters', 'body'])
        expect(funcDeclarationStmt['name']).toBeInstanceOf(Token)
        expect(funcDeclarationStmt['parameters']).toBeInstanceOf(Array)
        expect(funcDeclarationStmt['parameters'][0]).toBeInstanceOf(Token)
        expect(funcDeclarationStmt['body']).toBeInstanceOf(Array)
        expect(funcDeclarationStmt['body'][0]).toBeInstanceOf(PrintStmt)
    })

    it('Test If Statement', () => {
        const ifStmt = new IfStmt(
            new Binary(
                new variable(new Token(TokenType.IDENTIFIER, 'a', 'a', 1)),
                new Token(TokenType.LESS, '<', null, 1),
                new Literal(1)
            ),
            new BlockStmt([]),
            new BlockStmt([])
        )

        expect(ifStmt).toEqual({
            condition: {
                left: {
                    name: { type: TokenType.IDENTIFIER, lexeme: 'a', literal: 'a', line: 1 },
                },
                operator: { type: TokenType.LESS, lexeme: '<', literal: null, line: 1 },
                right: { value: 1 },
            },
            thenBranch: {
                statements: [],
            },
            elseBranch: {
                statements: [],
            },
        })
    })

    it('Test While Loop Statement', () => {
        const whileStatement = new WhileStmt(
            new Binary(
                new variable(new Token(TokenType.IDENTIFIER, 'a', 'a', 1)),
                new Token(TokenType.LESS, '<', null, 1),
                new Literal(1)
            ),
            new BlockStmt([])
        )
        expect(whileStatement).toEqual({
            condition: {
                left: {
                    name: { type: TokenType.IDENTIFIER, lexeme: 'a', literal: 'a', line: 1 },
                },
                operator: { type: TokenType.LESS, lexeme: '<', literal: null, line: 1 },
                right: { value: 1 },
            },
            body: {
                statements: [],
            },
        })
    })
})
