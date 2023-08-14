import { LiteralValue } from '../../../src/expression'
import { SyntaxTree } from '../../../src/parser'
import { Node } from '../../../src/types'
import { publish } from '../utils/pubSub'

export function Tree({ tree }: { tree: SyntaxTree }) {
    return (
        <Block name={tree.type} type="object" from={tree.from} to={tree.to}>
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
                <Block name={key} type="array">
                    {(a as Node[]).map((n) => (
                        <Block key={key + n.type + n.from.toString() + n.to.toString()} name={n.type} type="object" from={n.from} to={n.to}>
                            <Element node={n} />
                        </Block>
                    ))}
                </Block>
            )
            continue
        }
        if (a && typeof a === 'object') {
            elems.push(
                <Block name={key} type="object" from={(a as Node).from} to={(a as Node).to}>
                    <Element node={a as Node} />
                </Block>
            )
            continue
        }
        elems.push(<VPrimary name={key} value={a as string | number} />)
    }
    return elems
}

function Block({ name, children, type, from, to }: { name: string; children: React.ReactNode; type: 'object' | 'array'; from?: number; to?: number }) {
    const startChar = type === 'object' ? '{' : '['
    const endChar = type === 'object' ? '}' : ']'
    return (
        <li
            className="py-1 list-none"
            onMouseEnter={() => {
                !isNullOrUndefined(from) && !isNullOrUndefined(to) && publish('HIGHLIGHT', { from: from as number, to: to as number })
            }}
        >
            <span className="text-blue-500 hover:underline cursor-pointer">
                {name} {startChar}
            </span>
            <ul className="pl-6 py-0.5">{children}</ul>
            {endChar}
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
