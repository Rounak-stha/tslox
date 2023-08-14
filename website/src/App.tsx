import Editor from './components/Editor'
import OutputContainer from './components/OutputContainer'
import { Provider } from 'react-redux'
import { store } from './store'

function App() {
    return (
        <main className="flex flex-col h-screen max-h-screen">
            <div className="h-6">Header</div>
            <div className="flex flex-1 min-h-0">
                <Provider store={store}>
                    <Editor />
                    <OutputContainer />
                </Provider>
            </div>
            <div className="h-6">Footer</div>
        </main>
    )
}

export default App
