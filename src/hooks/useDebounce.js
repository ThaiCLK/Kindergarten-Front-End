import { useState, useCallback } from "react"

function useDebounce(callback, delay) {
    // const [debounceValue, setDebounceValue] = useState('');
    const [debounceTimeout, setDebounceTimeout] = useState(null)

    const debouncedCallback = useCallback(
        (value) => {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout)
            }

            const timeout = setTimeout(() => {
                callback(value)
            }, delay)

            setDebounceTimeout(timeout)
        },
        [callback, delay, debounceTimeout]
    )

    return debouncedCallback
}

export default useDebounce
