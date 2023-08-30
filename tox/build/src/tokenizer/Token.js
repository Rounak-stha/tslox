"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Token {
    constructor(type, lexeme, literal, line, from, to) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
        this.from = from;
        this.to = to;
    }
    toString() {
        return this.type + ' ' + this.lexeme + ' ' + this.literal;
    }
}
exports.default = Token;
