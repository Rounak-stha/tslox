import { useState } from 'react'
import Editor from './components/Editor'
import { createAst } from '../../src/'
import { SyntaxTree } from '../../src/parser'
import { Tree } from './components/Tree'

function App() {
    const [ast, setAst] = useState<SyntaxTree>()

    function getAst(): void {
        const source = Array.from(document.querySelectorAll('.cm-line'))
            .map((e) => e.textContent)
            .join('\n')

        try {
            setAst(createAst(source))
        } catch (err) {
            console.log('An Error Occoured')
        }
    }

    console.log(ast && <Tree tree={ast} />)
    return (
        <main className="flex flex-col h-full">
            <button
                onClick={getAst}
                className="px-4 pt-1 pb-1.5 font-semibold bg-blue-500 text-white rounded-sm active:scale-95"
            >
                Run
            </button>
            <div className="flex flex-1">
                <Editor className="flex-1" />
                <div className="flex-1">
                    <div className="mono text-xs">{ast ? <Tree tree={ast} /> : null}</div>
                </div>
            </div>
        </main>
    )
}

export default App
