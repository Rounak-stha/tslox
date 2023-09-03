import fs from 'fs'
import path from 'path'
import keywordsMap from './default/keywordsMap'

// Metaprogram TokenType enum
// First try to create dynamic keywords for the program
// Could not find a way to use it in client side

let TokenType = `enum TokenType {
    // Single-character tokens.
    LEFT_PAREN = 'LEFT_PAREN',
    RIGHT_PAREN = 'RIGHT_PAREN',
    LEFT_BRACE = 'LEFT_BRACE',
    RIGHT_BRACE = 'RIGHT_BRACE',
    COMMA = 'COMMA',
    DOT = 'DOT',
    MINUS = 'MINUS',
    PLUS = 'PLUS',
    SEMICOLON = 'SEMICOLON',
    COLON = 'COLON',
    SLASH = 'SLASH',
    STAR = 'STAR',
    QUESTION_MARK = 'QUESTION_MARK',

    // One or two character tokens.
    BANG = 'BANG',
    BANG_EQUAL = 'BANG_EQUAL',
    EQUAL = 'EQUAL',
    EQUAL_EQUAL = 'EQUAL_EQUAL',
    GREATER = 'GREATER',
    GREATER_EQUAL = 'GREATER_EQUAL',
    LESS = 'LESS',
    LESS_EQUAL = 'LESS_EQUAL',

    // Literals.
    IDENTIFIER = 'IDENTIFIER',
    STRING = 'STRING',
    NUMBER = 'NUMBER',
	
	// Keywords
`

const keywords = ['AND', 'CLASS', 'ELSE', 'FALSE', 'FUN', 'FOR', 'IF', 'NIL', 'OR', 'PRINT', 'RETURN', 'SUPER', 'THIS', 'TRUE', 'VAR', 'WHILE', 'EOF']

function setupBrowser(customKeyWordsMap: Record<keyof typeof keywordsMap, string>) {
    const cKWMap = customKeyWordsMap
    if (customKeyWordsMap) {
        for (let [key, value] of Object.entries(keywordsMap)) {
            if (keywords.includes(key)) {
                if (cKWMap[key as keyof typeof keywordsMap]) {
                    TokenType += '\t' + key + '=' + "'" + cKWMap[key as keyof typeof keywordsMap] + "',\n"
                } else {
                    TokenType += '\t' + key + '=' + "'" + value + "',\n"
                }
            }
        }
    }
}

async function setupNode() {
    if (process.argv[2]) {
        const tokenData = JSON.parse(fs.readFileSync(path.join(process.cwd(), process.argv[2]), { encoding: 'utf-8' }))
        for (let [key, value] of Object.entries(keywordsMap)) {
            if (keywords.includes(key)) {
                if (tokenData[key]) {
                    TokenType += '\t' + key + '=' + "'" + tokenData[key] + "',\n"
                } else {
                    TokenType += '\t' + key + '=' + "'" + value + "',\n"
                }
            }
        }
    } else {
        for (let [key, value] of Object.entries(keywordsMap)) {
            if (keywords.includes(key)) {
                TokenType += '\t' + key + '=' + "'" + value + "',\n"
            }
        }
    }
}

export default function setup(customKeyWordsMap?: Record<keyof typeof keywordsMap, string>) {
    const isBrowser = typeof window !== 'undefined'

    if (isBrowser) {
        if (!customKeyWordsMap) throw 'What are you doing?'
        setupBrowser(customKeyWordsMap)
    } else {
        setupNode()
    }

    TokenType += '}\nexport default TokenType'

    fs.writeFileSync(path.join(__dirname, '/tokenizer/TokenType.ts'), TokenType, { encoding: 'utf-8' })
}

// setup()
