"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoxError extends Error {
    constructor(line, type) {
        switch (type) {
            case 'Unknown Lexeme':
                super(`Unknown Lexeme at line: ${line}`);
                this.code = 401;
                this.type = type;
                break;
            case 'Syntax':
                super(`Syntax Error at line: ${line}`);
                this.code = 402;
                this.type = type;
                break;
            case 'Unterminated String':
                super(`Syntax Error at line: ${line}`);
                this.code = 403;
                this.type = type;
                break;
            default:
                super('Unknown Error');
                this.code = 400;
                this.type = type;
        }
    }
}
exports.default = LoxError;
