import { SyntaxTree } from '../../../../tox/src/parser'
import Block from './Block'
import Element from './Element'

export function Tree({ tree }: { tree: SyntaxTree }) {
    return (
        <Block name={tree.type} node={tree} openstate="open">
            <Element node={tree} />
        </Block>
    )
}
