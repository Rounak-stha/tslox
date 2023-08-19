import * as Dialog from '@radix-ui/react-dialog'
import ELink from './ELink'

export default function AboutBtn() {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className="text-xs rounded-xl font-semibold bg-blue-600 text-white px-2 py-0.5 cursor-pointer">About</button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent">
                    <Dialog.Title className="DialogTitle">Tox Ast Explorer</Dialog.Title>
                    <Dialog.Description className="DialogDescription">
                        The app uses TypeScript Implementation of <ELink href="https://craftinginterpreters.com" text="Lox" /> hence Tox (TSLox was taken) and is inspired by{' '}
                        <ELink href="https://www.astexplorer.net" text="AST Explorer" />. The motivation benhind this is an attempt to learn about language implementation,
                        interpretation and the use of Abstract Syntax Trees.
                    </Dialog.Description>
                    <Dialog.Close asChild>
                        <button className="IconButton" aria-label="Close">
                            X
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
