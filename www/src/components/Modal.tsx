import * as Dialog from '@radix-ui/react-dialog'

interface Props {
    name: string
    description?: React.ReactNode
    children?: React.ReactNode
}

export default function ModalOpener({ name, description, children }: Props) {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className="text-xs rounded-xl font-semibold bg-blue-600 text-white px-2 py-0.5 cursor-pointer">{name}</button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent overflow-y-auto">
                    <Dialog.Title className="DialogTitle">Tox Ast Explorer</Dialog.Title>
                    {description && <Dialog.Description className="DialogDescription">{description}</Dialog.Description>}
                    {children}
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
