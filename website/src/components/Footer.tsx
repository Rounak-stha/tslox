import { Feedback, Github } from '../icons'

export default function Footer() {
    return (
        <footer className="h-6 text-xs mono flex items-center justify-center text-blue-600">
            <a href="https://github.com/Rounak-stha/tslox/issues/new" target="_blank" >
                <span className="flex mr-4 hover:underline">
                    <span className="h-[14px] w-[14px] mr-1 fill-blue-600 hover:underline">
                        <Feedback />
                    </span>
                    Feedback
                </span>
            </a>
            <a href="https://github.com/rounak-stha/tslox" target="_blank" >
                <span className="mr-4 flex hover:underline">
                    <span className="mr-1">
                        <Github />
                    </span>
                    Github
                </span>
            </a>
            <a href="https://www.rounakstha.me" target="_blank" >
                <span className="mr-4 flex hover:underline">Developer</span>
            </a>
            <a href="https://craftinginterpreters.com" target="_blank" >
                <span className="mr-4 flex hover:underline">Language</span>
            </a>
        </footer>
    )
}
