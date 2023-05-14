import React, { useEffect, useState } from "react"
import { ColumnDataTypes } from "../dataTypes"
import { useSearchParams } from "react-router-dom"

export default function MagazineIssues({username, password}){
    const [searchParams, setSearchParams] = useSearchParams()
    const [issues, setIssues] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()

    const columns = [['ISSUE_NUMBER', ColumnDataTypes.INT], ['SERIES_NAME', ColumnDataTypes.VARCHAR], ['PUBLISHER_NAME', ColumnDataTypes.VARCHAR], ['CURRENT_TOTALS', ColumnDataTypes.INT], ['QUANTITIES_ORDERED', ColumnDataTypes.INT], ['IDEAL_AMOUNT', ColumnDataTypes.INT], ['AMOUNT_SHIPPING', ColumnDataTypes.INT], ['PUBLISH_DATE', ColumnDataTypes.DATE]]

    useEffect(() => {
        const publisher = searchParams.get('publisher')
        const series = searchParams.get('series')
        fetch(process.env.REACT_APP_API + `/magazine_issues?user=${username}&password=${password}&publisher_name=${publisher}&series_name=${series}`, {
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
                    setIssues(result)
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
                        {issues.map(item => {
                            return(
                                <tr>
                                    {columns.map(col => {
                                            if(col[0] == 'ISSUE_NUMBER'){
                                                return(
                                                    <td style={{border: '1px solid black', padding: '5px'}}>
                                                        <a href={`/issue_articles?publisher=${item.PUBLISHER_NAME}&series=${item.SERIES_NAME}&issue_number=${item.ISSUE_NUMBER}`}>
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