import useCodeMirror from '../../editor/hooks/useCodeMirror'
import { updatesource } from '../features/sourceSlice'
import { useAppDispatch } from '../hooks/redux'

export default function Editor() {
    const dispatch = useAppDispatch()
    const [refContainer, _] = useCodeMirror((doc) => dispatch(updatesource(doc)))

    return <div className="p- flex-1" ref={refContainer}></div>
}
