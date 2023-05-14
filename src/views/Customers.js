import React, { useEffect, useState } from "react"
import { ColumnDataTypes } from "../dataTypes"
import { useSearchParams } from "react-router-dom"

export default function Customers({username, password}){
    const [customers, setCustomers] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()

    const columns = [['CUSTOMER_ID', ColumnDataTypes.INT], ['CUSTOMER_NAME', ColumnDataTypes.VARCHAR], ['MAILING_ADDRESS', ColumnDataTypes.VARCHAR], ['SUBSCRIPTION_TYPE', ColumnDataTypes.VARCHAR], ['PHONE_NUMBER', ColumnDataTypes.VARCHAR], ['EMAIL', ColumnDataTypes.VARCHAR]]

    useEffect(() => {
        fetch(process.env.REACT_APP_API + `/customers?user=${username}&password=${password}`, {
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
                    setCustomers(result)
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
                        {customers.map(item => {
                            return(
                                <tr>
                                    {columns.map(col => {
                                            if(col[0] == 'CUSTOMER_ID'){
                                                return(
                                                    <td style={{border: '1px solid black', padding: '5px'}}>
                                                        <a href={`/subscriptions?customer_id=${item.CUSTOMER_ID}`}>
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