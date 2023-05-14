import React, { useEffect, useState } from "react"
import { ColumnDataTypes } from "../dataTypes"
import { useSearchParams } from "react-router-dom"

export default function Article({username, password}){
    const [searchParams, setSearchParams] = useSearchParams()
    const [article, setArticle] = useState()
    const [topics, setTopics] = useState()
    const [loadingArticle, setLoadingArticle] = useState(true)
    const [loadingTopics, setLoadingTopics] = useState(true)
    const [error, setError] = useState()
    const [insertValues, setInsertValues] = useState({})

    const topic_columns = [['TOPIC_NAME', ColumnDataTypes.VARCHAR], ['WRITER_ID', ColumnDataTypes.INT], ['ARTICLE_TITLE', ColumnDataTypes.VARCHAR]]
    const article_columns = [['WRITER_ID', ColumnDataTypes.INT], ['ARTICLE_TITLE', ColumnDataTypes.VARCHAR], ['ISSUE_NUMBER', ColumnDataTypes.INT], ['SERIES_NAME', ColumnDataTypes.VARCHAR], ['PUBLISHER_NAME', ColumnDataTypes.VARCHAR]]

    useEffect(() => {
        const writer = searchParams.get('writer_id')
        const title = searchParams.get('article_title')
        fetch(process.env.REACT_APP_API + `/article?user=${username}&password=${password}&writer_id=${writer}&article_title=${title}`, {
            method: 'GET',
            headers: {
                "content-type" : 'application/json'
            }
        }).then(
            (response) => response.json()
        ).then(
            (result) => {
                setLoadingArticle(false)
                if(result.message){
                    setError(result.message)
                }else{
                    setArticle(result[0])
                }
            }
        ).catch((error) => {
            alert(error)
        })
    }, [])

    useEffect(() => {
        const writer = searchParams.get('writer_id')
        const title = searchParams.get('article_title')
        fetch(process.env.REACT_APP_API + `/article_topics?user=${username}&password=${password}&writer_id=${writer}&article_title=${title}`, {
            method: 'GET',
            headers: {
                "content-type" : 'application/json'
            }
        }).then(
            (response) => response.json()
        ).then(
            (result) => {
                setLoadingTopics(false)
                if(result.message){
                    setError(result.message)
                }else{
                    setTopics(result)
                }
            }
        ).catch((error) => {
            alert(error)
        })
    }, [])

    const insertRow = () => {
        fetch(process.env.REACT_APP_API + '/article_topic', {
            method: 'POST',
            headers: {
                "content-type" : "application/json"
            },
            body: JSON.stringify({
                writer_id: searchParams.get('writer_id'),
                article_title: searchParams.get('article_title'),
                topic_name: insertValues.TOPIC_NAME,
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
                : loadingArticle || loadingTopics ||
                    <div>
                        <table style={{border: '1px solid black'}}>
                            <tr>
                                {topic_columns.map(item => <th syle={{border: '1px solid black'}}>{item[0]}</th>)}
                            </tr>
                            {topics.map(item => {
                                return(
                                    <tr>
                                        {topic_columns.map(col => <td style={{border: '1px solid black', padding: '5px'}}>{item[col[0]]}</td>)}
                                    </tr>
                                )
                            })}
                        </table>
                        <table style={{border: '1px solid black'}}>
                            <tr>
                                {article_columns.map(item => <th syle={{border: '1px solid black'}}>{item[0]}</th>)}
                            </tr>
                            <tr>
                                {article_columns.map(col => <td style={{border: '1px solid black', padding: '5px'}}>{article[col[0]]}</td>)}
                            </tr>
                        </table>
                    </div>
                }
                <div>
                <h3>New Entry</h3>
                {topic_columns.map(item => {
                    if(item[0] == 'ARTICLE_TITLE'){
                        return(
                            <div>
                                <label for={item[0]}>{item[0]}
                                </label>
                                <input type='text'
                                    value={searchParams.get('article_title')}
                                    disabled={true}
                                />
                            </div>)
                    }else if(item[0] == 'WRITER_ID'){
                        return(
                            <div>
                                <label for={item[0]}>{item[0]}
                                </label>
                                <input type='text'
                                    value={searchParams.get('writer_id')}
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