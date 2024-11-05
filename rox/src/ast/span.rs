use serde::{Deserialize, Serialize};

#[cfg_attr(test, derive(PartialEq, Eq))]
#[derive(Debug, Clone, Copy, Default, Serialize, Deserialize)]
pub struct Span {
    pub from: usize,
    pub to: usize,
}

impl Span {
    pub fn new(from: usize, to: usize) -> Self {
        Self { from, to }
    }

    pub fn start(mut self, from: usize) -> Self {
        self.from = from;
        self
    }

    pub fn end(mut self, to: usize) -> Self {
        self.to = to;
        debug_assert!(self.from <= self.to);
        self
    }
}

pub trait Spanned {
    fn span(&self) -> Span;
}

macro_rules! impl_spanned {
	($($t: ty),*) => {
		$(
			impl Spanned for $t {
				fn span(&self) -> Span {
					self.span.clone()
				}
			}
		)*
	}
}

pub(crate) use impl_spanned;
