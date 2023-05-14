import React, { useEffect, useState } from "react"
import { ColumnDataTypes } from "../dataTypes"
import { useSearchParams } from "react-router-dom"

export default function IssueArticles({username, password}){
    const [searchParams, setSearchParams] = useSearchParams()
    const [articles, setArticles] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()

    const columns = [['WRITER_ID', ColumnDataTypes.INT], ['ARTICLE_TITLE', ColumnDataTypes.VARCHAR], ['ISSUE_NUMBER', ColumnDataTypes.INT], ['SERIES_NAME', ColumnDataTypes.VARCHAR], ['PUBLISHER_NAME', ColumnDataTypes.VARCHAR]]

    useEffect(() => {
        const publisher = searchParams.get('publisher')
        const series = searchParams.get('series')
        const issueNum = searchParams.get('issue_number')
        fetch(process.env.REACT_APP_API + `/articles_from_issue?user=${username}&password=${password}&publisher_name=${publisher}&series_name=${series}&issue_number=${issueNum}`, {
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
                    setArticles(result)
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
                        {articles.map(item => {
                            return(
                                <tr>
                                    {columns.map(col => {
                                            if(col[0] == 'WRITER_ID'){
                                                return(
                                                    <td style={{border: '1px solid black', padding: '5px'}}>
                                                        <a href={`/writer_articles?writer_id=${item.WRITER_ID}`}>
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