export function getSourceCode(): string {
    return Array.from(document.querySelectorAll('.cm-line'))
        .map((e) => e.textContent)
        .join('\n')
}

export const isNullOrUndefined = (val: unknown) => val === 'undefined' || val === null

