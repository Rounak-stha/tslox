import { Node } from '../../../../tox/src/types'
import Block from './Block'
import VPrimary from './VPrimary'

export default function Element({ node }: { node: Node | Node[] }) {
    if (Array.isArray(node)) return node.map((n) => <Element key={n.type + n.from.toString() + n.to.toString()} node={n} />)
    const elems = []
    for (const prop in node) {
        const key = node.type + prop + node.from.toString()
        const a: unknown = node[prop as keyof Node]
        if (Array.isArray(a)) {
            elems.push(
                <Block key={key} name={prop} node={a}>
                    {(a as Node[]).map((n) => (
                        <Block key={prop + n.type + n.from.toString() + n.to.toString()} name={n.type} node={n}>
                            <Element node={n} />
                        </Block>
                    ))}
                </Block>
            )
            continue
        }
        if (a && typeof a === 'object') {
            elems.push(
                <Block key={key} name={prop} node={a as Node}>
                    <Element node={a as Node} />
                </Block>
            )
            continue
        }
        elems.push(<VPrimary key={key} name={prop} value={a as string | number} />)
    }
    return elems
}
