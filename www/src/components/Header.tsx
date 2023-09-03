import AboutBtn from './AboutBtn'
import SelectKeywords from './SelectKeywords'

export default function Header() {
    return (
        <header className="my-1 ml-2 text-blue-600 flex gap-2 items-center font-semibold">
            <p className="mr-1">Tox AST Explorer</p>
            <AboutBtn />
            <SelectKeywords />
        </header>
    )
}
