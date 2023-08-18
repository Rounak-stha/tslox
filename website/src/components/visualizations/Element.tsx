import { Node } from "../../../../src/types"
import Block from "./Block"
import VPrimary from "./VPrimary"

export default function Element({ node }: { node: Node | Node[] }) {
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