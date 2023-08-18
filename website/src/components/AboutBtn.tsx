import * as Dialog from '@radix-ui/react-dialog'

const DialogDemo = () => (
    <Dialog.Root>
        <Dialog.Trigger asChild>
            <button className="text-xs rounded-xl font-semibold bg-blue-600 text-white px-2 py-0.5">About</button>
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay className="DialogOverlay" />
            <Dialog.Content className="DialogContent">
                <Dialog.Title className="DialogTitle">About</Dialog.Title>
                <Dialog.Description className="DialogDescription">Description about the app.</Dialog.Description>

                <Dialog.Close asChild>
                    <button className="IconButton" aria-label="Close">
                        X
                    </button>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
)

export default DialogDemo
