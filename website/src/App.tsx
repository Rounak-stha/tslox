import Editor from './components/Editor'
import OutputContainer from './components/OutputContainer'
import { Provider } from 'react-redux'
import { store } from './store'
import Footer from './components/Footer'

function App() {
    return (
        <main className="flex flex-col h-screen max-h-screen">
            <div className="h-6 font-semibold">TSLox AST Explorer</div>
            <div className="flex flex-1 min-h-0">
                <Provider store={store}>
                    <Editor />
                    <OutputContainer />
                </Provider>
            </div>
            <Footer />
        </main>
    )
}

export default App
