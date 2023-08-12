import { useState } from 'react'
import Editor from './components/Editor'
import { createAst } from '../../src/'
import { SyntaxTree } from '../../src/parser'
import { Tree } from './visualizations/Tree'
import OutputContainer from './components/OutputContainer'
import { Provider } from 'react-redux'
import { store } from './store'

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

    return (
        <main className="flex flex-col h-full">
            <button
                onClick={getAst}
                className="px-4 pt-1 pb-1.5 font-semibold bg-blue-500 text-white rounded-sm active:scale-95"
            >
                Run
            </button>
            <div className="flex flex-1">
                <Provider store={store}>
                    <Editor />
                    <OutputContainer />
                </Provider>
            </div>
        </main>
    )
}

export default App
