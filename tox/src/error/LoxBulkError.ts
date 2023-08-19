import LoxError from './LoxError'

type ErrorType = 'Syntax'

export class LoxBulkError {
    type: ErrorType
    errors: LoxError[] = []

    constructor(type: ErrorType, errors: LoxError[]) {
        switch (type) {
            case 'Syntax':
                this.type = type
                this.errors = errors
                break
        }
    }
}
