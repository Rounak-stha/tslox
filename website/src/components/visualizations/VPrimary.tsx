import type { LiteralValue } from '../../../../tox/src/expression'
import { isNullOrUndefined } from '../../utils/helpers'

export default function VPrimary({ name, value }: { name: string; value: LiteralValue }) {
    // Boolean values must be converted to string; true.toString() = 'true'
    const parsedValue = !isNullOrUndefined(value) ? (typeof value === 'string' ? `"${value}"` : (value as unknown as object).toString()) : 'null'
    return (
        <li className="py-0.5 list-none">
            <span className="text-orange-500">{name}</span> - {parsedValue}
        </li>
    )
}
