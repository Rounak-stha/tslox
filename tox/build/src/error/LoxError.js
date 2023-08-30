"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeError = void 0;
class LoxError extends Error {
    constructor(line, type, message) {
        switch (type) {
            case 'Unknown Lexeme':
                super(`[Unknown Lexeme | Line: ${line}]${message ? ' ' + message : ''}`);
                this.code = 401;
                this.type = type;
                break;
            case 'Syntax':
                super(`[Syntax Error | Line: ${line}]${message ? ' ' + message : ''}`);
                this.code = 402;
                this.type = type;
                break;
            case 'Parse Error':
                super(`[Parse Error | Line: ${line}]${message ? ' ' + message : ''}`);
                this.code = 403;
                this.type = type;
                break;
            case 'Unterminated String':
                super(`[Unterminated String | Line: ${line}]${message ? ' ' + message : ''}`);
                this.code = 404;
                this.type = type;
                break;
            case 'Runtime':
                super(`[Runtime Error | Line: ${line}]${message ? ' ' + message : ''}`);
                this.code = 405;
                this.type = type;
                break;
            default:
                super('Unknown Error');
                this.code = 406;
                this.type = type;
        }
    }
}
function RuntimeError(token, msg) {
    throw new LoxError(token.line, 'Runtime', msg);
}
exports.RuntimeError = RuntimeError;
exports.default = LoxError;
