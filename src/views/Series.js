import React, { useEffect, useState } from "react"
import { ColumnDataTypes } from "../dataTypes"
import { useSearchParams } from "react-router-dom"

export default function Series({username, password}){
    const [searchParams, setSearchParams] = useSearchParams()
    const [series, setSeries] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()

    const columns = [['SERIES_NAME', ColumnDataTypes.VARCHAR], ['PUBLISHER_NAME', ColumnDataTypes.VARCHAR], ['PUBLICATION_FREQUENCY', ColumnDataTypes.INT], ['COST_PER_BILLING_CYCLE', ColumnDataTypes.INT]]

    useEffect(() => {
        const publisher = searchParams.get('publisher')
        fetch(process.env.REACT_APP_API + `/series?user=${username}&password=${password}&publisher_name=${publisher}`, {
            method: 'GET',
            headers: {
                "content-type" : 'application/json'
            }
        }).then(
            (response) => response.json()
        ).then(
            (result) => {
                setLoading(false)
                if(result.message){
                    setError(result.message)
                }else{
                    setSeries(result)
                }
            }
        ).catch((error) => {
            alert(error)
        })
    }, [])


    return(
        <div>
            {error 
                ? <h1>Error: {error}</h1>
                : loading ||
                    <table style={{border: '1px solid black'}}>
                        <tr>
                            {columns.map(item => <th syle={{border: '1px solid black'}}>{item[0]}</th>)}
                        </tr>
                        {series.map(item => {
                            return(
                                <tr>
                                    {columns.map(col => {
                                            if(col[0] == 'SERIES_NAME'){
                                                return(
                                                    <td style={{border: '1px solid black', padding: '5px'}}>
                                                        <a href={`/magazine_issues?publisher=${item.PUBLISHER_NAME}&series=${item.SERIES_NAME}`}>
                                                            {item[col[0]]}
                                                        </a>
                                                    </td>
                                                )
                                            }else{
                                                return(
                                                    <td style={{border: '1px solid black', padding: '5px'}}>{item[col[0]]}</td>
                                                )
                                            }
                                        })
                                    }
                                </tr>
                            )
                        })}
                    </table>
                }
        </div>
    )
}