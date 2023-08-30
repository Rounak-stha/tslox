import { Node } from '../../../tox/src/types'
import { isNullOrUndefined } from './helpers'
import { publish } from './pubSub'

export type Range = { from: number; to: number }

export class NodeHelper {
    isArray(node: Node | Node[]) {
        return Array.isArray(node)
    }

    /**
     * @param node
     * @returns If object - The elements of the provided node separated by comma | If Array { <Number_of_Elements> element(s) }
     */
    getPropStr(node: Node | Node[]): string {
        if (Array.isArray(node)) {
            return node.length.toString() + ' element' + (node.length > 1 ? 's' : '')
        }
        return Object.keys(node).join(', ')
    }

    getstartAndEndLiterals(node: Node | Node[]) {
        let startChar: string, endChar: string
        if (Array.isArray(node)) {
            startChar = '['
            endChar = ']'
        } else {
            startChar = '{'
            endChar = '}'
        }
        return { startChar, endChar }
    }

    getRange(node: Node | Node[]): Range {
        let from = 0,
            to = 0
        if (Array.isArray(node)) {
            if (node.length) {
                from = node[0].from
                to = node[node.length - 1].to
            }
        } else {
            from = node.from
            to = node.to
        }
        return { from, to }
    }

    getMouseOverHandler(node: Node | Node[]): React.MouseEventHandler {
        const { from, to } = this.getRange(node)
        return (e: React.MouseEvent<HTMLElement>) => {
            if ((e.currentTarget as HTMLElement).tagName !== 'LI') {
                return
            }
            e.stopPropagation()
            ;(e.currentTarget as HTMLElement).classList.add('node-hover')
            !isNullOrUndefined(from) && !isNullOrUndefined(to) && publish('HIGHLIGHT', { from, to })
        }
    }

    getMouseOuthandler(): React.MouseEventHandler {
        return (e: React.MouseEvent<HTMLLIElement>) => {
            if ((e.currentTarget as HTMLElement).tagName !== 'LI') {
                return
            }
            e.stopPropagation()
            ;(e.currentTarget as HTMLElement).classList.remove('node-hover')
            // Remove the highlight
        }
    }
}
