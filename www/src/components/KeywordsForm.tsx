import { useCallback, useEffect, useState } from 'react'
import tokenNameToDisplayName from '../utils/tokenNameToDisplayName'
import { type keywordsName, setActiveKeyword, isActiveKW as isAKW, getKW, updateKW } from '../../lang/keywords/kwHelpers'

export default function KeywordsForm({ name, editable = false }: { name: keywordsName; editable?: boolean }) {
    const [keywords, setKeywords] = useState<Record<string, string>>({})
    const [isActiveKW, setisActiveKW] = useState(false)
    useEffect(() => {
        const kws = getKW(name)
        if (kws) {
            setKeywords(JSON.parse(kws) as Record<string, string>)
        }

        if (isAKW(name)) setisActiveKW(true)
    }, [name])

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            setKeywords((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        },
        [setKeywords]
    )

    const handleActiveKeywordChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(() => {
        if (!isActiveKW) {
            setActiveKeyword(name)
        }
    }, [isActiveKW, name])

    const handleUpdateKW = useCallback(() => {
        updateKW(name, JSON.stringify(keywords))
    }, [keywords, name])

    return (
        <div>
            <div className="flex items-center mb-2">
                <div className="flex items-center flex-1">
                    <input
                        id={'aKW-' + name}
                        onChange={handleActiveKeywordChange}
                        type="checkbox"
                        checked={isActiveKW}
                        disabled={isActiveKW}
                        // className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                        className="w-4 h-4 text-white bg-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:cursor-not-allowed checked:bg-blue-500 checked:after:content-['\2713'] relative checked:after:absolute checked:after:top-[-4px] checked:after:left-[1px]"
                    />
                    <label htmlFor={'aKW-' + name} className={`ml-2 text-sm font-semibold text-gray-500 ${isActiveKW ? 'cursor-not-allowed' : ''}`}>
                        Active Keyword
                    </label>
                </div>
                <button onClick={handleUpdateKW} className="px-3 pt-1 pb-1.5 ml-auto bg-blue-500 rounded-sm text-xs text-white font-semibold cursor-pointer">
                    Save
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {Object.keys(keywords).map((k, i) => (
                    <div key={k + ' KW' + i.toString()}>
                        <p className="text-gray-600 text-sm">{tokenNameToDisplayName[k as keyof typeof tokenNameToDisplayName]}</p>
                        {editable ? (
                            <input className="px-2 pt-1 pb-1.5 bg-gray-200 rounded-sm" type="text" name={k} value={keywords[k]} onChange={handleChange} />
                        ) : (
                            <input className="px-2 pt-1 pb-1.5 bg-gray-200 rounded-sm cursor-not-allowed" type="text" name={k} value={keywords[k]} readOnly />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
