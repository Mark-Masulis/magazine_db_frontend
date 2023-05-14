import React, { useEffect, useState } from "react"
import { ColumnDataTypes } from "../dataTypes"

export default function Publishers({username, password}){
    const [publishers, setPublishers] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const [insertValues, setInsertValues] = useState({})

    const columns = [['PUBLISHER_NAME', ColumnDataTypes.VARCHAR], ['MAILING_ADDRESS', ColumnDataTypes.VARCHAR], ['PHONE_NUMBER', ColumnDataTypes.VARCHAR], ['EMAIL', ColumnDataTypes.VARCHAR]]

    useEffect(() => {
        fetch(process.env.REACT_APP_API + `/publishers?user=${username}&password=${password}`, {
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
                    setPublishers(result)
                }
            }
        ).catch((error) => {
            alert(error)
        })
    }, [])

    const insertRow = () => {
        fetch(process.env.REACT_APP_API + '/publisher', {
            method: 'POST',
            headers: {
                "content-type" : "application/json"
            },
            body: JSON.stringify({
                publisher_name: insertValues.PUBLISHER_NAME,
                address: insertValues.MAILING_ADDRESS,
                phone: insertValues.PHONE_NUMBER,
                email: insertValues.EMAIL,
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
                        {publishers.map(item => {
                            return(
                                <tr>
                                    {columns.map(col => {
                                            if(col[0] == 'PUBLISHER_NAME'){
                                                return(
                                                    <td style={{border: '1px solid black', padding: '5px'}}>
                                                        <a href={`/series?publisher=${item[col[0]]}`}>
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
                {columns.map(item => <div>
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
                    </div>)}
                <button
                    onClick={insertRow}
                >
                    Insert Row
                </button>
            </div>
        </div>
    )
}