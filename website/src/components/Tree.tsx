import { LiteralValue } from '../../../src/expression'
import { SyntaxTree } from '../../../src/parser'
import { Node } from '../../../src/types'

export function Tree({ tree }: { tree: SyntaxTree }) {
    console.log(JSON.stringify(tree, null, 4))
    return <Element node={tree} />
}

function Element({ node }: { node: Node | Node[] }) {
    if (Array.isArray(node)) return node.map((n) => <Element node={n} />)
    const elems = []
    for (const key in node) {
        const a: unknown = node[key as keyof Node]
        if (Array.isArray(a)) {
            elems.push(
                <Block name={key} type="array">
                    {a.map((n) => (
                        <Block name={(n as Node).type} type="object">
                            <Element node={n as Node} />
                        </Block>
                    ))}
                </Block>
            )
            continue
        }
        if (a && typeof a === 'object') {
            elems.push(
                <Block name={key} type="object">
                    <Element node={a as Node} />
                </Block>
            )
            continue
        }
        elems.push(<VPrimary name={key} value={a as string | number} />)
    }
    return elems
}

function Block({ name, children, type }: { name: string; children: React.ReactNode; type: 'object' | 'array' }) {
    const startChar = type === 'object' ? '{' : '['
    const endChar = type === 'object' ? '}' : ']'
    return (
        <div>
            <p>
                {name} {startChar}
            </p>
            <div className="pl-6">{children}</div>
            {endChar}
        </div>
    )
}

function VPrimary({ name, value }: { name: string; value: LiteralValue }) {
    // Boolean values must be converted to string; true.toString() = 'true'
    const parsedValue = value ? (typeof value === 'string' ? `"${value}"` : value.toString()) : 'null'
    return (
        <div>
            {name} - {parsedValue}
        </div>
    )
}