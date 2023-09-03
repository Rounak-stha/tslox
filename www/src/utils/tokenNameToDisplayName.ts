const tokenNameToDisplayName = {
    AND: 'And',
    CLASS: 'class (Reserved)',
    ELSE: 'Else',
    FALSE: 'False',
    FUN: 'Function',
    FOR: 'For Loop',
    IF: 'If Statement',
    NIL: 'Nil',
    OR: 'Or',
    PRINT: 'Print Statement',
    RETURN: 'Return Statement',
    SUPER: 'Super (Reserved)',
    THIS: 'This (Reserved)',
    TRUE: 'True',
    VAR: 'Declaration Statement',
    WHILE: 'While Loop'
} as const

export default tokenNameToDisplayName
