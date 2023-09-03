import TokenType from './TokenType'

const keywords: Record<string, TokenType> = {
    and: TokenType.AND,
    class: TokenType.CLASS,
    else: TokenType.ELSE,
    false: TokenType.FALSE,
    for: TokenType.FOR,
    fun: TokenType.FUN,
    if: TokenType.IF,
    nil: TokenType.NIL,
    or: TokenType.OR,
    print: TokenType.PRINT,
    return: TokenType.RETURN,
    super: TokenType.SUPER,
    this: TokenType.THIS,
    true: TokenType.TRUE,
    var: TokenType.VAR,
    while: TokenType.WHILE
}

export const keywordsList = Object.keys(keywords)
export const keywordTypeList = keywordsList.map((k) => keywords[k].toString())

export default function setupKeywords() {
    if (typeof window === undefined) return keywords

    const selectedKeywordGroupName = localStorage.getItem('selectedKeywordGroupName')

    console.log(selectedKeywordGroupName)
    if (!selectedKeywordGroupName) return keywords

    const keywordsGroup = localStorage.getItem(selectedKeywordGroupName)
    console.log(keywordsGroup)
    if (keywordsGroup) {
        const kws = JSON.parse(keywordsGroup)
        const customKeywords = {}
        for (let [key, value] of Object.entries(kws)) {
            // @ts-ignore
            customKeywords[value] = TokenType[key]
        }
        console.log(customKeywords)
        return customKeywords as Record<string, TokenType>
    } else {
        alert("Looks like something unexpected happened.\nCan't select the keywords group.\nPlease reload site")
        return keywords
    }
}
