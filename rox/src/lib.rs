mod ast;
mod lexer;
mod parser;

pub mod lox_error;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn parse_for_js(source: &str) -> JsValue {
    let allocator = bumpalo::Bump::new();
    let mut parser = parser::Parser::new(source, &allocator);
    let result = parser.parse();
    match result {
        Ok(ast) => serde_wasm_bindgen::to_value(&ast).unwrap(),
        Err(errors) => serde_wasm_bindgen::to_value(&errors).unwrap(),
    }
}

mod test {
    use crate::{parse_for_js, parser};

    #[test]
    fn test_parse() {
        let source = r#"
			var a = 1;
			var b = 2;
			var c = a + b;
			print c;
		"#;
        let allocator = bumpalo::Bump::new();
        let mut parser = parser::Parser::new(source, &allocator);
        let result = parser.parse();
        let js_value = match result {
            Ok(ast) => serde_wasm_bindgen::to_value(&ast).unwrap(),
            Err(errors) => serde_wasm_bindgen::to_value(&errors).unwrap(),
        };
        println!("{:?}", js_value);
    }
}
