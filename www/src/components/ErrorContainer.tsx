import { LoxBulkError } from '../../../tox/src/error/LoxBulkError'

export default function ErrorContainer({ error }: { error: LoxBulkError }) {
    return (
        <div>
            {error.errors.map((e, i) => (
                <p key={e.code + i}>{e.message}</p>
            ))}
        </div>
    )
}
