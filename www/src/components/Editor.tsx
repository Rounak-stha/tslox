import { useEffect } from 'react'
import useCodeMirror from '../hooks/useCodeMirror'
import { updatesource } from '../features/sourceSlice'
import { useAppDispatch } from '../hooks/redux'
import { EditorSelection } from '@codemirror/state'
import { subscribe } from '../utils/pubSub'

export default function Editor() {
    const dispatch = useAppDispatch()
    const [refContainer, Editor] = useCodeMirror((doc) => dispatch(updatesource(doc)))
    useEffect(() => {
        if (Editor) {
            subscribe('HIGHLIGHT', (range) => {
                Editor.dispatch({
                    selection: EditorSelection.create([EditorSelection.range(range.from, range.to)]),
                    scrollIntoView: true
                })
            })
        }
    }, [Editor])
    return <div className="flex-1 overflow-scroll thin-scrollbar" ref={refContainer}></div>
}
