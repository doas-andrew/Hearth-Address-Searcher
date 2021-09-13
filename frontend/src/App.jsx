import React, { useEffect, useState } from 'react'
import DataGrid from './components/DataGrid'
import QueryForm from './components/QueryForm'
import { baseUrl } from './constants'
import Hearth from './images/Hearth.png'


export default function Example() {
    const [useAdvanced, setUseAdvanced] = useState(false)
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [query, setQuery] = useState({
        text: '',
        pageIndex: 0,
        pageSize: 50,
        priceMin: 0,
        priceMax: 0,
        squareFeetMin: 0,
        squareFeetMin: 0,
        yearBuiltMin: 0,
        yearBuiltMax: 0,
        beds: 0,
        baths: 0
    })

    useEffect(() => {
        fetchData()
    }, [query])

    const fetchData = () => {
        fetch(buildUrl())
            .catch(console.error)
            .then(res => res.json())
            .then(json => {
                // console.log(json)
                if (json.data && json.total) {
                    setData(json.data)
                    setTotal(json.total)
                } else {
                    console.error(json)
                }
            })
    }

    const buildUrl = () => {
        let url = `${baseUrl}/addresses`
        url += `?text=${encodeURIComponent(query.text)}`
        url += `&pageIndex=${query.pageIndex}&pageSize=${query.pageSize}`
        
        if (useAdvanced) {
            // Beds / Baths
            if (query.beds)
                url += `&beds=${query.beds}`
            if (query.baths)
                url += `&baths=${query.baths}`

            // Price
            if (query.priceMin)
                url += `&priceMin=${query.priceMin}`
            if (query.priceMax)
                url += `&priceMax=${query.priceMax}`

            // Square Feet
            if (query.squareFeetMin)
                url += `&squareFeetMin=${query.squareFeetMin}`
            if (query.squareFeetMax)
                url += `&squareFeetMax=${query.squareFeetMax}`

            // Year Built
            if (query.yearBuiltMin)
                url += `&yearBuiltMin=${query.yearBuiltMin}`
            if (query.yearBuiltMax)
                url += `&yearBuiltMax=${query.yearBuiltMax}`
        }

        // console.log(url)
        return url
    }
    
    return (
        <div className='app-container'>
            <div className='title-container'>
                <img className='banner' src={Hearth} alt='Hearth-Banner' draggable='false' />
            </div>
            <QueryForm query={query} setQuery={setQuery} useAdvanced={useAdvanced} setUseAdvanced={setUseAdvanced}/>
            <DataGrid data={data} total={total} query={query} setQuery={setQuery}/>
        </div>
    )
}
