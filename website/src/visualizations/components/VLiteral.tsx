import { Literal } from "../../../../src/expression";

export default function VLiteral({ node }: { node: Literal }) {
     return (
         <section>
             <div className="pl-5">
                 value - <span>{node.value}</span>
             </div>
         </section>
     )
} 