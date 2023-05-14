import React, { useEffect, useState } from "react"
import { ColumnDataTypes } from "../dataTypes"
import { useSearchParams } from "react-router-dom"

export default function Series({username, password}){
    const [searchParams, setSearchParams] = useSearchParams()
    const [series, setSeries] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const [insertValues, setInsertValues] = useState({})

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

    const insertRow = () => {
        fetch(process.env.REACT_APP_API + '/series', {
            method: 'POST',
            headers: {
                "content-type" : "application/json"
            },
            body: JSON.stringify({
                publisher_name: searchParams.get('publisher'),
                series_name: insertValues.SERIES_NAME,
                publication_frequency: insertValues.PUBLICATION_FREQUENCY,
                cost: insertValues.COST_PER_BILLING_CYCLE,
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
                <div>
                <h3>New Entry</h3>
                {columns.map(item => {
                    if(item[0] == 'PUBLISHER_NAME'){
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
                                        }
                                    })()}
                                    value={searchParams.get('publisher')}
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