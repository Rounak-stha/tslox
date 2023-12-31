// eslint-disable-next-line
import dKW from './default.json'
import nepKW from './nepLang.json'

// Abbreviations
// KW - Keyword
// KWs - keywords
// KWG - KeywordGroup

if (!localStorage.getItem('selectedKeywordGroupName')) {
    localStorage.setItem('selectedKeywordGroupName', 'defaultKWs')
}

if (!localStorage.getItem('defaultKWs')) {
    localStorage.setItem('defaultKWs', JSON.stringify(dKW))
}

if (!localStorage.getItem('customKWs')) {
    localStorage.setItem('customKWs', JSON.stringify(dKW))
}

if (!localStorage.getItem('nepaliKWs')) {
    localStorage.setItem('nepaliKWs', JSON.stringify(nepKW))
}
