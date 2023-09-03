import * as Tabs from '@radix-ui/react-tabs'
import type { keywordsName, keywordsDisplayName } from '../../lang/keywords/kwHelpers'
import ModalOpener from './Modal'
import KeywordsForm from './KeywordsForm'

interface TabValues {
    name: string
    editable: boolean
    KWName: keywordsName
}

const tabsAndValues: Record<keywordsDisplayName, TabValues> = {
    default: {
        name: 'Default',
        editable: false,
        KWName: 'defaultKWs'
    },
    one: {
        name: 'One',
        editable: false,
        KWName: 'oneKWs'
    },
    nepali: {
        name: 'Nepali',
        editable: false,
        KWName: 'nepaliKWs'
    },
    custom: {
        name: 'Custom',
        editable: true,
        KWName: 'customKWs'
    }
}

export default function SelectKeywords() {
    return (
        <ModalOpener name="Keywords">
            <Tabs.Root className="flex flex-col" defaultValue="default">
                <Tabs.List className="shrink-0 flex border-b border-mauve6" aria-label="Update Keywords">
                    {Object.entries(tabsAndValues).map(([key, value]) => (
                        <Tabs.Trigger
                            key={'kw-' + value.name + 'trigger'}
                            className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] outline-none cursor-default"
                            value={key}
                        >
                            {value.name}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>

                <div>
                    {Object.entries(tabsAndValues).map(([key, value]) => (
                        <Tabs.Content className="pt-1" key={'kw-' + value.name + 'content'} value={key}>
                            <KeywordsForm name={value.KWName} editable={value.editable} />
                        </Tabs.Content>
                    ))}
                </div>
            </Tabs.Root>
        </ModalOpener>
    )
}
