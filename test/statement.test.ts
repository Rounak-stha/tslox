import { Binary, Literal, variable } from '../src/expression'
import { PrintStmt, VarStmt, ExpressionStmt, BlockStmt, WhileStmt, IfStmt, FunctionStmt, Stmt } from '../src/statement'
import Token from '../src/tokenizer/Token'
import TokenType from '../src/tokenizer/TokenType'

describe('Test Statements', () => {
    const from = 1,
        to = 2

    it('Test Var Statement', () => {
        const name = new Token(TokenType.IDENTIFIER, 'name', null, 1, from, to)
        const initializer_1 = null
        const initializer_2 = new Literal(1, from, to)

        const varStmt_1 = new VarStmt(name, initializer_1, from, to)
        const varStmt_2 = new VarStmt(name, initializer_2, from, to)

        expect(varStmt_1).toEqual({
            type: 'VarStatement',
            name: { type: 'IDENTIFIER', lexeme: 'name', literal: null, line: 1, from, to },
            initializer: null,
            from,
            to,
        })

        expect(varStmt_2).toEqual({
            type: 'VarStatement',
            name: { type: 'IDENTIFIER', lexeme: 'name', literal: null, line: 1, from, to },
            initializer: { type: 'LiteralExpression', value: 1, from, to },
            from,
            to,
        })
    })

    it('Test Print Statement', () => {
        const printStmt = new PrintStmt(
            new Binary(
                new Literal(1, from, to),
                new Token(TokenType.PLUS, '+', null, 1, from, to),
                new Literal(2, from, to),
                from,
                to
            ),
            from,
            to
        )

        expect(printStmt).toEqual({
            type: 'PrintStatement',
            expression: {
                type: 'BinaryExpression',
                left: { type: 'LiteralExpression', value: 1, from, to },
                operator: { type: 'PLUS', lexeme: '+', literal: null, line: 1, from, to },
                right: { type: 'LiteralExpression', value: 2, from, to },
                from,
                to,
            },
            from,
            to,
        })
    })

    it('Test Expression Statement', () => {
        const exprStmt = new ExpressionStmt(
            new Binary(
                new Literal(1, from, to),
                new Token(TokenType.STAR, '*', null, 1, from, to),
                new Literal(2, from, to),
                from,
                to
            ),
            from,
            to
        )

        expect(exprStmt).toEqual({
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                left: { type: 'LiteralExpression', value: 1, from, to },
                operator: { type: 'STAR', lexeme: '*', literal: null, line: 1, from, to },
                right: { type: 'LiteralExpression', value: 2, from, to },
                from,
                to,
            },
            from,
            to,
        })
    })

    it('Test Block Statement', () => {
        const blockstmt1 = new BlockStmt([], from, to)
        const blockStmt2 = new BlockStmt(
            [
                new PrintStmt(
                    new Binary(
                        new Literal(1, from, to),
                        new Token(TokenType.PLUS, '+', null, 1, from, to),
                        new Literal(2, from, to),
                        from,
                        to
                    ),
                    from,
                    to
                ),
                new ExpressionStmt(
                    new Binary(
                        new Literal(1, from, to),
                        new Token(TokenType.STAR, '*', null, 1, from, to),
                        new Literal(2, from, to),
                        from,
                        to
                    ),
                    from,
                    to
                ),
            ],
            from,
            to
        )

        expect(blockstmt1.body.length).toEqual(0)
        expect(blockStmt2.body.length).toEqual(2)
    })

    it('Test Function Declaration Statement', () => {
        const funcDeclarationStmt = new FunctionStmt(
            new Token(TokenType.IDENTIFIER, 'NuName', 'NuName', 1, from, to),
            [
                new Token(TokenType.IDENTIFIER, 'param1', 'param1', 1, from, to),
                new Token(TokenType.IDENTIFIER, 'param2', 'param2', 1, from, to),
            ],
            [
                new PrintStmt(
                    new Binary(
                        new Literal(1, from, to),
                        new Token(TokenType.PLUS, '+', null, 1, from, to),
                        new Literal(2, from, to),
                        from,
                        to
                    ),
                    from,
                    to
                ),
            ],
            from,
            to
        )

        // NOTE: Order of the key-array matters
        expect(Object.keys(funcDeclarationStmt)).toEqual(['from', 'to', 'type', 'name', 'parameters', 'body'])
        expect(funcDeclarationStmt.type).toBe('FunctionDeclaration')
        expect(funcDeclarationStmt.from).toBe(from)
        expect(funcDeclarationStmt.to).toBe(to)
        expect(funcDeclarationStmt['name']).toBeInstanceOf(Token)
        expect(funcDeclarationStmt['parameters']).toBeInstanceOf(Array)
        expect(funcDeclarationStmt['parameters'][0]).toBeInstanceOf(Token)
        expect(funcDeclarationStmt['body']).toBeInstanceOf(Array)
        expect(funcDeclarationStmt['body'][0]).toBeInstanceOf(PrintStmt)
    })

    it('Test If Statement', () => {
        const ifStmt = new IfStmt(
            new Binary(
                new variable(new Token(TokenType.IDENTIFIER, 'a', 'a', 1, from, to), from, to),
                new Token(TokenType.LESS, '<', null, 1, from, to),
                new Literal(1, from, to),
                from,
                to
            ),
            new BlockStmt([], from, to),
            new BlockStmt([], from, to),
            from,
            to
        )
        // NOTE: Order of the key-array matters
        expect(Object.keys(ifStmt)).toEqual(['from', 'to', 'type', 'condition', 'thenBranch', 'elseBranch'])
        expect(ifStmt.type).toBe('IfStatement')
        expect(ifStmt.condition).toBeInstanceOf(Binary)
        expect(ifStmt.thenBranch).toBeInstanceOf(BlockStmt)
        expect(ifStmt.elseBranch).toBeInstanceOf(BlockStmt)
        expect(ifStmt.from).toBe(from)
        expect(ifStmt.to).toBe(to)
    })

    it('Test While Loop Statement', () => {
        const whileStatement = new WhileStmt(
            new Binary(
                new variable(new Token(TokenType.IDENTIFIER, 'a', 'a', 1, from, to), from, to),
                new Token(TokenType.LESS, '<', null, 1, from, to),
                new Literal(1, from, to),
                from,
                to
            ),
            new BlockStmt([], from, to),
            from,
            to
        )

        // NOTE: Order of the key-array matters
        expect(Object.keys(whileStatement)).toEqual(['from', 'to', 'type', 'condition', 'body'])
        expect(whileStatement.type).toBe('WhileLoop')
        expect(whileStatement.from).toBe(from)
        expect(whileStatement.to).toBe(to)
        expect(whileStatement.condition).toBeInstanceOf(Binary)
        expect(whileStatement.body).toBeInstanceOf(BlockStmt)
    })
})
