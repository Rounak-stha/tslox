import { useState } from 'react'
import { LiteralValue } from '../../../src/expression'
import { SyntaxTree } from '../../../src/parser'
import { Node } from '../../../src/types'
import { publish } from '../utils/pubSub'

export function Tree({ tree }: { tree: SyntaxTree }) {
    return (
        <Block name={tree.type} node={tree}>
            <Element node={tree} />
        </Block>
    )
}

function Element({ node }: { node: Node | Node[] }) {
    if (Array.isArray(node)) return node.map((n) => <Element key={n.type + n.from.toString() + n.to.toString()} node={n} />)
    const elems = []
    for (const key in node) {
        const a: unknown = node[key as keyof Node]
        if (Array.isArray(a)) {
            elems.push(
                <Block name={key} node={a}>
                    {(a as Node[]).map((n) => (
                        <Block key={key + n.type + n.from.toString() + n.to.toString()} name={n.type} node={n}>
                            <Element node={n} />
                        </Block>
                    ))}
                </Block>
            )
            continue
        }
        if (a && typeof a === 'object') {
            elems.push(
                <Block name={key} node={a as Node}>
                    <Element node={a as Node} />
                </Block>
            )
            continue
        }
        elems.push(<VPrimary name={key} value={a as string | number} />)
    }
    return elems
}

function Block({ name, node, children }: { name: string; children: React.ReactNode; node: Node | Node[] }) {
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

function VPrimary({ name, value }: { name: string; value: LiteralValue }) {
    // Boolean values must be converted to string; true.toString() = 'true'
    const parsedValue = !isNullOrUndefined(value) ? (typeof value === 'string' ? `"${value}"` : (value as unknown as object).toString()) : 'null'
    return (
        <li className="py-0.5 list-none">
            <span className="text-orange-500">{name}</span> - {parsedValue}
        </li>
    )
}

const isNullOrUndefined = (val: unknown) => val === 'undefined' || val === null
