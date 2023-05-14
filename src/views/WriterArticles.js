import React, { useEffect, useState } from "react"
import { ColumnDataTypes } from "../dataTypes"
import { useSearchParams } from "react-router-dom"

export default function WriterArticles({username, password}){
    const [searchParams, setSearchParams] = useSearchParams()
    const [articles, setArticles] = useState()
    const [writer, setWriter] = useState()
    const [loadingArticles, setLoadingArticles] = useState(true)
    const [loadingWriter, setLoadingWriter] = useState(true)
    const [error, setError] = useState()

    const writer_columns = [['WRITER_ID', ColumnDataTypes.INT], ['NAME', ColumnDataTypes.VARCHAR], ['EMAIL', ColumnDataTypes.VARCHAR], ['PHONE', ColumnDataTypes.VARCHAR]]
    const article_columns = [['WRITER_ID', ColumnDataTypes.INT], ['ARTICLE_TITLE', ColumnDataTypes.VARCHAR], ['ISSUE_NUMBER', ColumnDataTypes.INT], ['SERIES_NAME', ColumnDataTypes.VARCHAR], ['PUBLISHER_NAME', ColumnDataTypes.VARCHAR]]

    useEffect(() => {
        const writer = searchParams.get('writer_id')
        fetch(process.env.REACT_APP_API + `/articles_from_writer?user=${username}&password=${password}&writer_id=${writer}`, {
            method: 'GET',
            headers: {
                "content-type" : 'application/json'
            }
        }).then(
            (response) => response.json()
        ).then(
            (result) => {
                setLoadingArticles(false)
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

    useEffect(() => {
        const writer = searchParams.get('writer_id')
        fetch(process.env.REACT_APP_API + `/writer?user=${username}&password=${password}&writer_id=${writer}`, {
            method: 'GET',
            headers: {
                "content-type" : 'application/json'
            }
        }).then(
            (response) => response.json()
        ).then(
            (result) => {
                setLoadingWriter(false)
                if(result.message){
                    setError(result.message)
                }else{
                    setWriter(result[0])
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
                : loadingArticles || loadingWriter ||
                    <div>
                        <table style={{border: '1px solid black'}}>
                            <tr>
                                {article_columns.map(item => <th syle={{border: '1px solid black'}}>{item[0]}</th>)}
                            </tr>
                            {articles.map(item => {
                                return(
                                    <tr>
                                        {article_columns.map(col => <td style={{border: '1px solid black', padding: '5px'}}>{item[col[0]]}</td>)}
                                    </tr>
                                )
                            })}
                        </table>
                        <table style={{border: '1px solid black'}}>
                            <tr>
                                {writer_columns.map(item => <th syle={{border: '1px solid black'}}>{item[0]}</th>)}
                            </tr>
                            <tr>
                                {writer_columns.map(col => <td style={{border: '1px solid black', padding: '5px'}}>{writer[col[0]]}</td>)}
                            </tr>
                        </table>
                    </div>
                }
        </div>
    )
}