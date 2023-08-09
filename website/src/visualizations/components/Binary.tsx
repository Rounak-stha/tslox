import { Binary, Literal } from "../../../../src/expression";
import VLiteral from "./VLiteral";

export default function VBinary({ node }: { node: Binary }) {
    return (
        <section>
            {node.type} &#123;
            <div className="pl-5">
                left - {node.left.type}
                <VLiteral node={node.left as Literal} />
                <p>operator - '{node.operator.lexeme}'</p>
                right - {node.right.type}
                <VLiteral node={node.right as Literal} />
            </div>
            &#125;
        </section>
    )
} 