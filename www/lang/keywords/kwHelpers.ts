import TokenType from '../../../tox/src/tokenizer/TokenType'
import { keywordsList, keywordTypeList } from '../../../tox/src/tokenizer/setup'

// console.log(keywordTypeList, keywordsList)
type Replace<T extends string, U extends string, V extends string> = T extends `${infer Prefix}${U}${infer Suffix}` ? `${Prefix}${V}${Suffix}` : T

export type keywordsName = 'defaultKWs' | 'oneKWs' | 'nepaliKWs' | 'customKWs'
export type keywordsDisplayName = Replace<keywordsName, 'KWs', ''>

const defaultCode = `var num = 1;

fun addNum(a) { 
	return a + num; 
} 

if (true) { 
	var name = "Nu Name";
	print name;
	addNum(9);
}

for (var i = 1; i < 10; i = i + 1) {
	print i;
}

var active = true;

while (active) {
	print "Active";
	active = false;
}
`

function createSourceCode(name: keywordsName) {
    const kws = localStorage.getItem(name)
    if (kws) {
        const parsedKws = JSON.parse(kws) as Record<TokenType, string>
        let customCode = defaultCode

        // eslint-disable-next-line
        keywordsList.forEach((k, i) => {
            console.log(k, parsedKws[keywordTypeList[i]])
            // eslint-disable-next-line
            const regex = new RegExp('\\b' + k + '\\b', 'g')
            // eslint-disable-next-line
            customCode = customCode.replace(regex, parsedKws[keywordTypeList[i] as TokenType])
        })
        return customCode
    } else {
        alert('Something Unexpected Happened.\nPlease reload the site.')
        return defaultCode
    }
}

const codeByKW: Record<keywordsName, string> = {
    defaultKWs: defaultCode,

    oneKWs: `let num = 1;

func addNum(a) { 
	return a + num; 
} 

if (treu) { 
	let name = "Nu Name";
	print name;
	addNum(9);
}`,
    customKWs: createSourceCode('customKWs'),
    nepaliKWs: createSourceCode('nepaliKWs')
}

const activeKWGName = 'selectedKeywordGroupName'

export function setActiveKeyword(name: keywordsName) {
    localStorage.setItem(activeKWGName, name)
    location.reload()
}

function getActiveKW() {
    return localStorage.getItem(activeKWGName) as keywordsName
}

export function updateKW(name: keywordsName, value: string) {
    localStorage.setItem(name, value)
    if (isActiveKW(name)) {
        location.reload()
    }
}

export function isActiveKW(name: keywordsName) {
    return localStorage.getItem(activeKWGName) == name
}

export function getKW(name: keywordsName) {
    return localStorage.getItem(name)
}

export function initialSourceCode() {
    const activeKW = getActiveKW()
    if (activeKW) {
        return codeByKW[activeKW]
    } else {
        codeByKW['defaultKWs']
    }
}
