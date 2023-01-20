import { toast, type Renderable } from 'svelte-french-toast'

/* 
  Credit:
  @timolins - https://github.com/timolins
  react-hot-toast: https://github.com/timolins/react-hot-toast

  svelte-french-toast (https://github.com/kbrgl/svelte-french-toast) does not currently implement allowing a function as a msg argument for toast.promise

  This is using the implementation of react-hot-toast toast.promise to allow passing a function or a value for success and error messages to a toast promise
*/

type ValueFunction<TValue, TArg> = (arg: TArg) => TValue
type ValueOrFunction<TValue, TArg> = TValue | ValueFunction<TValue, TArg>

const isFunction = <TValue, TArg>(
	valOrFunction: ValueOrFunction<TValue, TArg>
): valOrFunction is ValueFunction<TValue, TArg> => typeof valOrFunction === 'function'

const resolveValue = <TValue, TArg>(
	valOrFunction: ValueOrFunction<TValue, TArg>,
	arg: TArg
): TValue => (isFunction(valOrFunction) ? valOrFunction(arg) : valOrFunction)

export const toastPromise = <T>(
	promise: Promise<T>,
	msgs: {
		loading: Renderable
		success: ValueOrFunction<Renderable, T>
		error: ValueOrFunction<Renderable, any>
	}
) => {
	const id = toast.loading(msgs.loading)

	promise
		.then((p) => toast.success(resolveValue(msgs.success, p), { id }))
		.catch((e) => {
			toast.error(resolveValue(msgs.error, e), { id })
		})
}
