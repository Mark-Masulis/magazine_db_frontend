import React, { useEffect, useState } from "react"
import { ColumnDataTypes } from "../dataTypes"
import { useSearchParams } from "react-router-dom"

export default function IssueArticles({username, password}){
    const [searchParams, setSearchParams] = useSearchParams()
    const [articles, setArticles] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const [insertValues, setInsertValues] = useState({})

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

    const insertRow = () => {
        fetch(process.env.REACT_APP_API + '/article', {
            method: 'POST',
            headers: {
                "content-type" : "application/json"
            },
            body: JSON.stringify({
                writer_id: insertValues.WRITER_ID,
                article_title: insertValues.ARTICLE_TITLE,
                issue_number: searchParams.get('issue_number'),
                series_name: searchParams.get('series'),
                publisher_name: searchParams.get('publisher'),
                user: username,
                password: password
            })
        }).then(
            (response) => {
                if(response.status == 200){
                    window.location.reload()
                }else{
                    alert("Error inserting.")
                }
            }
        ).catch(
            (error) => {
                alert(error)
            }
        )
    }

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
                                            }else if(col[0] == 'ARTICLE_TITLE'){
                                                return(
                                                    <td style={{border: '1px solid black', padding: '5px'}}>
                                                        <a href={`/article?writer_id=${item.WRITER_ID}&article_title=${item.ARTICLE_TITLE}`}>
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
                <div>
                <h3>New Entry</h3>
                {columns.map(item => {
                    if(item[0] == 'PUBLISHER_NAME'){
                        return(
                            <div>
                                <label for={item[0]}>{item[0]}
                                </label>
                                <input type='text'
                                    value={searchParams.get('publisher')}
                                    disabled={true}
                                />
                            </div>)
                    }else if(item[0] == 'SERIES_NAME'){
                        return(
                            <div>
                                <label for={item[0]}>{item[0]}
                                </label>
                                <input type='text'
                                    value={searchParams.get('series')}
                                    disabled={true}
                                />
                            </div>)
                    }else if(item[0] == 'ISSUE_NUMBER'){
                        return(
                            <div>
                                <label for={item[0]}>{item[0]}
                                </label>
                                <input type='text'
                                    value={searchParams.get('issue_number')}
                                    disabled={true}
                                />
                            </div>)
                    }else{
                        return(
                        <div>
                            <label for={item[0]}>{item[0]}
                            </label>
                            <input type={(()=>{
                                    switch(item[1]){
                                        case ColumnDataTypes.INT:
                                            return 'number'
                                        case ColumnDataTypes.VARCHAR:
                                            return 'text'
                                        case ColumnDataTypes.DATE:
                                            return 'date'
                                    }
                                })()}
                                onChange={(event) =>  {
                                    var newInsertValues = insertValues
                                    newInsertValues[item[0]] = event.target.value
                                    setInsertValues(newInsertValues)
                                }}
                            />
                        </div>)
                    }
                })}
                <button
                    onClick={insertRow}
                >
                    Insert Row
                </button>
            </div>
        </div>
    )
}