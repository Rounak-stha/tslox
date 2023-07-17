import useCodeMirror from '../../editor/hooks/useCodeMirror'

export default function Editor({ className }: { className: string }) {
	const [refContainer, Editor] = useCodeMirror()
	console.log(refContainer, Editor)
	return <div className={`min-h-[10rem] p-1 ${className ? className : ''}`} ref={refContainer}></div>
}
