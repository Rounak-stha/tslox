enum TokenType {
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
    AND = 'AND',
    CLASS = 'CLASS',
    ELSE = 'ELSE',
    FALSE = 'FALSE',
    FUN = 'FUN',
    FOR = 'FOR',
    IF = 'IF',
    NIL = 'NIL',
    OR = 'OR',
    PRINT = 'PRINT',
    RETURN = 'RETURN',
    SUPER = 'SUPER',
    THIS = 'THIS',
    TRUE = 'TRUE',
    VAR = 'VAR',
    WHILE = 'WHILE',
    EOF = 'EOF'
}

/* function setupBrowser() {
    const selectedKeywordGroupName = localStorage.getItem('selectedKeywordGroupName')
    const keywordsGroup = selectedKeywordGroupName ? localStorage.getItem(selectedKeywordGroupName) : undefined

    // localStorage.getItem() returns string | null
    if (keywordsGroup === null) return alert('An Error Occoured.\nPlease Refresh Page')
    if (keywordsGroup !== undefined) {
        const kws = JSON.parse(keywordsGroup)
        console.log(kws)
        for (let [key, value] of Object.entries(kws)) {
            console.log(key, value)
            //@ts-ignore
            console.log(TokenType[key])
            // @ts-ignore
            if (TokenType[key]) {
                ;(TokenType as any)[key] = value
            }
        }
    }
}

;(function () {
    const isBrowser = typeof window !== undefined
    if (isBrowser) setupBrowser()
    // else setupNode()
})()

console.log(TokenType)
 */
export default TokenType
