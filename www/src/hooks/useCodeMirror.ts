import { useState, useEffect, useRef } from 'react'

import {
    keymap,
    highlightSpecialChars,
    drawSelection,
    highlightActiveLine,
    dropCursor,
    rectangularSelection,
    crosshairCursor,
    lineNumbers,
    highlightActiveLineGutter,
    EditorView,
    placeholder
} from '@codemirror/view'
import { Extension, EditorState } from '@codemirror/state'
import { defaultHighlightStyle, syntaxHighlighting, indentOnInput, bracketMatching, foldGutter, foldKeymap } from '@codemirror/language'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { lintKeymap } from '@codemirror/lint'
import { lox } from '../../lang/lang'

const basicSetup: Extension = (() => [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...searchKeymap, ...historyKeymap, ...foldKeymap, ...completionKeymap, ...lintKeymap])
])()

const initialCode = `var num = 1;

fun addNum(a) { 
  return a + num; 
} 

if (true) { 
 var name = "Nu Name";
 print name;
 addNum(9);
}`

export default function useCodeMirror(onChange: (doc: string) => void): [React.RefObject<HTMLDivElement>, EditorView | undefined] {
    const [Editor, setEditor] = useState<EditorView>()
    const refContainer = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!refContainer.current) return
        const editor = new EditorView({
            state: EditorState.create({
                doc: initialCode,
                extensions: [
                    basicSetup,
                    placeholder(''),
                    lox(),
                    EditorView.updateListener.of((update) => {
                        if (update.changes) {
                            onChange(update.state.doc.toString())
                        }
                    })
                ]
            }),
            parent: refContainer.current
        })

        setEditor(editor)
        return () => editor.destroy()
    }, [refContainer])

    return [refContainer, Editor]
}
