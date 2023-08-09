import { parser } from './parser.js'
import { foldNodeProp, foldInside, indentNodeProp } from '@codemirror/language'
import { styleTags, tags as t } from '@lezer/highlight'
import { LRLanguage } from '@codemirror/language'
import { completeFromList } from '@codemirror/autocomplete'
import { LanguageSupport } from '@codemirror/language'

const parserWithMetadata = parser.configure({
    props: [
        styleTags({
            Identifier: t.variableName,
            Boolean: t.bool,
            String: t.string,
            LineComment: t.lineComment,
            '( )': t.paren,
        }),
        indentNodeProp.add({
            Application: (context) => context.column(context.node.from) + context.unit,
        }),
        foldNodeProp.add({
            Application: foldInside,
        }),
    ],
})

export function lox() {
    return new LanguageSupport(loxLanguage, [loxCompletion])
}

export const loxLanguage = LRLanguage.define({
    parser: parserWithMetadata,
    languageData: {
        commentTokens: { line: ';' },
    },
})

export const loxCompletion = loxLanguage.data.of({
    autocomplete: completeFromList([
        { label: 'var', type: 'keyword' },
        { label: 'if', type: 'keyword' },
        { label: 'for', type: 'function' },
        { label: 'while', type: 'function' },
        { label: 'fun', type: 'function' },
    ]),
})
