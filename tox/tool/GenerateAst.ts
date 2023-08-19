import fs from 'fs'
const outputDir = './src' // run file from the root directory

const expressionTypes = [
    'Binary -> left: Expr , operator: Token, right: Expr',
    'Unary -> operator: Token, right: Expr',
    'Grouping -> expression: Expr',
    'Literal -> value: string | number',
]

const statementTypes = ['Expression -> expression: Expr', 'Print -> expression: Expr']

// ---------------------------------------------------------------------------------------------
// The 'string literal formatting' matters for proper format of the generated code
// Yes, formatters like prettier does it's job but the format of the generated code
// can help debug faster as we can point out the syntax error of our code faster without
// any help from formatters
// ---------------------------------------------------------------------------------------------
// I don't like the name 'generateAst' because we are not actually generating AST
// we are generating the Expression classes
// But since the book has use the name I am sticking to it for now
// ---------------------------------------------------------------------------------------------
function defineAst(outputDir: string, baseName: string, types: string[]) {
    const path = outputDir + '/' + baseName + '.ts'
    let code = `import Token from '../tokenizer/Token'

interface Expr {
}

`
    for (let type of types) {
        const [className, fieldString] = type.split('->').map((s) => s.trim())
        code += `export class ${className} implements Expr {
`

        fieldString.split(',').forEach((field) => (code += '	' + field.trim() + '\n'))
        code += `	constructor(${fieldString}) {
`
        fieldString.split(',').forEach((field) => {
            const fieldName = field.trim().split(':')[0].trim()
            code += `		this.${fieldName} = ${fieldName}\n`
        })
        code += `	}
} \n
`
    }

    fs.writeFileSync(path, code, { encoding: 'utf-8' })
}

defineAst(outputDir, 'expression', expressionTypes)
defineAst(outputDir, 'statement', statementTypes)
