interface Expr<T> {
    accept(visitor: Visitor<T>): T
}

interface Visitor<T> {
    visitBinaryExpression<T>()
}
