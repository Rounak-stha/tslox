import { useState } from 'react'
import { Node } from '../../../../tox/src/types'
import { isNullOrUndefined } from '../../utils/helpers'
import { publish } from '../../utils/pubSub'

export default function Block({ name, node, children }: { name: string; children: React.ReactNode; node: Node | Node[] }) {
    const [showChildren, setShowChildren] = useState(true)
    const isArray = Array.isArray(node)
    let startChar: string
    let endChar: string
    let from: number
    let to: number

    if (isArray) {
        startChar = '['
        endChar = ']'
        if (node.length) {
            from = node[0].from
            to = node[node.length - 1].to
        }
    } else {
        startChar = '{'
        endChar = '}'
        from = node.from
        to = node.to
    }

    const propStr = isArray ? node.length.toString() + ' element' + (node.length > 1 ? 's' : '') : Object.keys(node).join(', ')

    const handleMouseOver = (e: React.MouseEvent<HTMLLIElement>) => {
        e.stopPropagation()
        ;(e.target as HTMLUListElement).classList.add('node-hover')
        !isNullOrUndefined(from) && !isNullOrUndefined(to) && publish('HIGHLIGHT', { from, to })
    }

    const handeMouseOut = (e: React.MouseEvent<HTMLLIElement>) => {
        e.stopPropagation()
        ;(e.target as HTMLUListElement).classList.remove('node-hover')
        // Remove the highlight
    }
    return (
        <li className="py-1 list-none" onMouseOver={handleMouseOver} onMouseOut={handeMouseOut}>
            <span onClick={() => setShowChildren((prev) => !prev)}>
                <span className="pr-1.5">{showChildren ? '-' : '+'}</span>
                <span className="text-blue-500 hover:underline cursor-pointer">{name}</span>
                <span className="text-red-600 px-1.5">{startChar} </span>
                {!showChildren && <span className="text-gray-300">{propStr}</span>}
            </span>
            {showChildren && <ul className="pl-6 py-0.5">{children}</ul>}
            <span className="text-red-600 px-1.5">{endChar}</span>
        </li>
    )
}
