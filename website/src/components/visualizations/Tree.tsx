import { SyntaxTree } from '../../../../src/parser'
import Block from './Block'
import Element from './Element'

export function Tree({ tree }: { tree: SyntaxTree }) {
    return (
        <Block name={tree.type} node={tree}>
            <Element node={tree} />
        </Block>
    )
}







