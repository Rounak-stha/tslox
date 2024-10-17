mod ast;
mod lexer;
mod lox_error;

use lexer::Lexer;

fn main() {
    let mut lexer = Lexer::new("let x = 10; \"I am an unterminated string");
    lexer.scan_tokens();

    if lexer.has_errors() {
        lexer.report_errors();
    } else {
        for token in lexer.tokens {
            println!("{}", token);
        }
    }
}
