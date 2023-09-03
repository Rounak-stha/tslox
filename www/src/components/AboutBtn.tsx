// import * as Dialog from '@radix-ui/react-dialog'
import ELink from './ELink'
import ModalOpener from './Modal'

const description = (
    <p>
        The app uses TypeScript Implementation of <ELink href="https://craftinginterpreters.com" text="Lox" /> hence Tox (TSLox was taken) and is inspired by{' '}
        <ELink href="https://www.astexplorer.net" text="AST Explorer" />. The motivation behind this is an attempt to learn about language implementation, interpretation and the
        use of Abstract Syntax Trees.
    </p>
)

export default function AboutBtn() {
    return <ModalOpener name="About" description={description} />
}
