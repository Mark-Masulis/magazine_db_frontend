import React, { useEffect, useState } from "react"
import { ColumnDataTypes } from "../dataTypes"
import { useSearchParams } from "react-router-dom"

export default function CustomerSubscriptions({username, password}){
    const [searchParams, setSearchParams] = useSearchParams()
    const [subscriptions, setSubscriptions] = useState()
    const [customer, setCustomer] = useState()
    const [loadingSubscriptions, setLoadingSubscriptions] = useState(true)
    const [loadingCustomer, setLoadingCustomer] = useState(true)
    const [error, setError] = useState()

    const customer_columns = [['CUSTOMER_ID', ColumnDataTypes.INT], ['CUSTOMER_NAME', ColumnDataTypes.VARCHAR], ['MAILING_ADDRESS', ColumnDataTypes.VARCHAR], ['SUBSCRIPTION_TYPE', ColumnDataTypes.VARCHAR], ['PHONE_NUMBER', ColumnDataTypes.VARCHAR], ['EMAIL', ColumnDataTypes.VARCHAR]]
    const subscription_columns = [['CUSTOMER_ID', ColumnDataTypes.INT], ['SERIES_NAME', ColumnDataTypes.VARCHAR], ['PUBLISHER_NAME', ColumnDataTypes.VARCHAR]]

    useEffect(() => {
        const customer = searchParams.get('customer_id')
        fetch(process.env.REACT_APP_API + `/customer_subscriptions?user=${username}&password=${password}&customer_id=${customer}`, {
            method: 'GET',
            headers: {
                "content-type" : 'application/json'
            }
        }).then(
            (response) => response.json()
        ).then(
            (result) => {
                setLoadingSubscriptions(false)
                if(result.message){
                    setError(result.message)
                }else{
                    setSubscriptions(result)
                }
            }
        ).catch((error) => {
            alert(error)
        })
    }, [])

    useEffect(() => {
        const customer = searchParams.get('customer_id')
        fetch(process.env.REACT_APP_API + `/customer?user=${username}&password=${password}&customer_id=${customer}`, {
            method: 'GET',
            headers: {
                "content-type" : 'application/json'
            }
        }).then(
            (response) => response.json()
        ).then(
            (result) => {
                setLoadingCustomer(false)
                if(result.message){
                    alert(result.message)
                    setError(result.message)
                }else{
                    setCustomer(result[0])
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
                : loadingCustomer || loadingSubscriptions ||
                    <div>
                        <table style={{border: '1px solid black'}}>
                            <tr>
                                {subscription_columns.map(item => <th syle={{border: '1px solid black'}}>{item[0]}</th>)}
                            </tr>
                            {subscriptions.map(item => {
                                return(
                                    <tr>
                                        {subscription_columns.map(col => <td style={{border: '1px solid black', padding: '5px'}}>{item[col[0]]}</td>)}
                                    </tr>
                                )
                            })}
                        </table>
                        <table style={{border: '1px solid black'}}>
                            <tr>
                                {customer_columns.map(item => <th syle={{border: '1px solid black'}}>{item[0]}</th>)}
                            </tr>
                            <tr>
                                {customer_columns.map(col => <td style={{border: '1px solid black', padding: '5px'}}>{customer[col[0]]}</td>)}
                            </tr>
                        </table>
                    </div>
                }
        </div>
    )
}