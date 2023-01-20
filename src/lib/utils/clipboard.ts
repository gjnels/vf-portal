import { toast, type Renderable } from 'svelte-french-toast'

export const copyToClipboard = (
	text: string,
	msgs: {
		loading: Renderable
		success: Renderable
		error: Renderable
	} = {
		loading: 'Copying to clipboard...',
		success: 'Copied to clipboard!',
		error: 'Error copying to clipboard. Try again.'
	}
) => {
	toast.promise(navigator.clipboard.writeText(text), msgs)
}
