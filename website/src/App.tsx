import { useState } from 'react'
import Editor from './components/Editor'
import { createAst } from '../../src/'

function App() {
	const [astString, setAstString] = useState<string>()
	function getAst(): void {
		setAstString(
			createAst(
				Array.from(document.querySelectorAll('.cm-line'))
					.map((e) => e.textContent)
					.join('\n')
			)
		)
	}
	return (
		<>
			<button
				onClick={getAst}
				className='px-4 pt-1 pb-1.5 font-semibold bg-blue-500 text-white rounded-sm active:scale-95'
			>
				Run
			</button>
			<div className='flex'>
				<Editor className='flex-1' />
				<div className='flex-1'>
					<pre>{astString}</pre>
				</div>
			</div>
		</>
	)
}

export default App
