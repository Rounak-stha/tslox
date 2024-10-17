// eslint-disable-next-line
import dKW from './default.json'
import nepKW from './nepLang.json'

// Abbreviations
// KW - Keyword
// KWs - keywords
// KWG - KeywordGroup

export const SELECTED_KEYWORD_GROP_NAME = 'selectedKeywordGroupName'
export const DEFAULT_KW = 'defaultKWs'
export const CUSTOM_KW = 'customKWs'
export const NEPALI_KW = 'nepaliKWs'

function initializeKeywords() {
    if (!localStorage.getItem('SELECTED_KEYWORD_GROP_NAME')) {
        localStorage.setItem('selectedKeywordGroupName', 'defaultKWs')
    }

    if (!localStorage.getItem(DEFAULT_KW)) {
        localStorage.setItem(DEFAULT_KW, JSON.stringify(dKW))
    }

    if (!localStorage.getItem(CUSTOM_KW)) {
        localStorage.setItem(CUSTOM_KW, JSON.stringify(dKW))
    }

    if (!localStorage.getItem(NEPALI_KW)) {
        localStorage.setItem(NEPALI_KW, JSON.stringify(nepKW))
    }
}

export function getActiveKeywordsStr() {
    const selectedKeywordGroupName = localStorage.getItem(SELECTED_KEYWORD_GROP_NAME)

    if (selectedKeywordGroupName) {
        return localStorage.getItem(selectedKeywordGroupName)
    }
    return null
}

initializeKeywords()
