import { useState, useEffect } from 'react'
import { createAst } from '../../../tox/src'
import { useAppSelector } from '../hooks/redux'
import { Tree } from './visualizations'
import { SyntaxTree, ParserError } from '../../../tox/src/parser'
import { LoxBulkError } from '../../../tox/src/error/LoxBulkError'
import ErrorContainer from './ErrorContainer'

export default function OutputContainer() {
    const source = useAppSelector((state) => state.sourceReducer.value)
    const [data, setData] = useState<{ ast: SyntaxTree | null; error: ParserError | null }>({ ast: null, error: null })

    useEffect(() => {
        try {
            const ast = createAst(source)
            setData({ ast, error: null })
        } catch (e) {
            if (e instanceof LoxBulkError) {
                setData({ ast: null, error: e })
            } else throw e
        }
    }, [source])

    return (
        <div className="flex-1 flex flex-col overflow-auto thin-scrollbar px-2 text-sm">
            {data.ast && <Tree tree={data.ast} />}
            {data.error && <ErrorContainer error={data.error} />}
        </div>
    )
}
