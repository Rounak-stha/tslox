use std::iter::Peekable;
use std::str::Chars;

pub struct Reader<'de> {
    source: &'de str,

    chars: Peekable<Chars<'de>>,

    // Start is always at the beginning of the current token
    pub start: usize,

    // Cursor is always at the next character to be read
    pub cursor: usize,

    pub line: usize,
}

impl<'de> Reader<'de> {
    pub fn new(source: &'de str) -> Self {
        Self {
            source,
            chars: source.chars().peekable(),
            start: 0,
            cursor: 0,
            line: 1,
        }
    }

    pub fn peek(&mut self) -> Option<&char> {
        self.chars.peek()
    }

    pub fn advance(&mut self) -> Option<char> {
        if self.cursor >= self.source.len() {
            return None;
        }

        let c = self.chars.next();

        if let Some(c) = c {
            self.cursor += 1;

            if c == '\n' {
                self.line += 1;
            }

            Some(c)
        } else {
            None
        }
    }

    pub fn advance_while<F>(&mut self, f: F)
    where
        F: Fn(char) -> bool,
    {
        while let Some(c) = self.peek() {
            if f(*c) {
                self.advance();
            } else {
                break;
            }
        }
    }

    pub fn sync(&mut self) {
        self.start = self.cursor;
    }
}

mod test {
    use super::*;

    #[test]
    fn test_reader_advance() {
        let source = "let x = 10;";
        let mut reader = Reader::new(source);

        assert_eq!(reader.advance(), Some('l'));
        assert_eq!(reader.advance(), Some('e'));
        assert_eq!(reader.advance(), Some('t'));
        assert_eq!(reader.advance(), Some(' '));
        assert_eq!(reader.advance(), Some('x'));
        assert_eq!(reader.advance(), Some(' '));
        assert_eq!(reader.advance(), Some('='));
        assert_eq!(reader.advance(), Some(' '));
        assert_eq!(reader.advance(), Some('1'));
        assert_eq!(reader.advance(), Some('0'));
        assert_eq!(reader.advance(), Some(';'));
        assert_eq!(reader.advance(), None);
    }

    #[test]
    fn test_reader_read_while() {
        let source = "123 456";
        let mut reader = Reader::new(source);
        reader.advance_while(|c| c.is_numeric());
        assert_eq!(reader.cursor, 3);
    }
}
