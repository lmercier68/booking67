import {useState, useEffect} from "react"


export function useFetch(url, options = {}) {
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null)
    const [data, setData] = useState(null)

    useEffect(() => {
        console.log('url useFetch: ', url)
        fetch(url, {
            ...options,
            headers: {
                'Accept': 'application/json; charset : UTF-8',
                ...options.headers
            }
        })
            .then(r => r.json())
            .then(data => {
                setData(data)
            })
            .catch((e) => {
                console.log('erreurs:' , errors)
                setErrors(e)
            })
            .finally(() => setLoading(false))
    },[]);
    return { loading, data, errors}
}