import { useState } from 'react'
import { Node } from '../../../../tox/src/types'
import { NodeHelper } from '../../utils/vUtil'

const nodeHelper = new NodeHelper()

export default function Block({ name, node, children }: { name: string; children: React.ReactNode; node: Node | Node[] }) {
    const [showChildren, setShowChildren] = useState(true)
    const { startChar, endChar } = nodeHelper.getstartAndEndLiterals(node)
    const propStr = nodeHelper.getPropStr(node)

    return (
        <li className="py-1 list-none" onMouseOver={nodeHelper.getMouseOverHandler(node)} onMouseOut={nodeHelper.getMouseOuthandler()}>
            <span onClick={() => setShowChildren((prev) => !prev)}>
                <span className="pr-1.5">{showChildren ? '-' : '+'}</span>
                <span className="text-blue-500 hover:underline cursor-pointer">{name}</span>
                <span className="text-red-600 px-1.5">{startChar}</span>
                {!showChildren && <span className="text-gray-300">{propStr}</span>}
            </span>
            {showChildren && <ul className="pl-6 py-0.5">{children}</ul>}
            <span className="text-red-600 px-1.5">{endChar}</span>
        </li>
    )
}
