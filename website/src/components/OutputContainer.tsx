import { createAst } from '../../../src'
import { useAppSelector } from '../hooks/redux'
import { Tree } from '../visualizations'

export default function OutputContainer() {
    const source = useAppSelector((state) => state.sourceReducer.value)
    let ast = null
    try {
        ast = createAst(source)
    } catch (e) {
        console.log(e)
    }

    return <div className="flex-1 mono text-sm">{ast && <Tree tree={ast} />}</div>
}
