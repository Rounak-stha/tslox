export default function ELink({ href, text }: { href: string; text: string }) {
    return (
        <a className="text-blue-600 hover:underline" href={href}>
            {text}
        </a>
    )
}
