import './App.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from "react-router-dom"
import Publishers from './views/Publishers'
import Series from './views/Series'
import MagazineIssues from './views/MagazineIssues';
import { useState } from 'react'
import IssueArticles from './views/IssueArticles';
import WriterArticles from './views/WriterArticles';
import Customers from './views/Customers';
import CustomerSubscriptions from './views/CustomerSubscriptions'
import Article from './views/Article';

function App() {

  const [user, setUser] = useState()
  const [password, setPassword] = useState()
  const [submitted, setSubmitted] = useState(false)

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<div></div>}/>
        <Route path="/publishers" element={<Publishers username={'root'} password={'abc123'}/>}/>
        <Route path="/series" element={<Series username={'root'} password={'abc123'}/>}/>
        <Route path="/magazine_issues" element={<MagazineIssues username={'root'} password={'abc123'}/>}/>
        <Route path="/issue_articles" element={<IssueArticles username={'root'} password={'abc123'}/>}/>
        <Route path="/writer_articles" element={<WriterArticles username={'root'} password={'abc123'}/>}/>
        <Route path="/customers" element={<Customers username={'root'} password={'abc123'}/>}/>
        <Route path="/subscriptions" element={<CustomerSubscriptions username={'root'} password={'abc123'}/>}/>
        <Route path="/article" element={<Article username={'root'} password={'abc123'}/>}/>
      </Route>
      
    )
  )

  return (
    <div>
      <table>
        <tr>
          <td>
            <a href='/publishers'>View Publications</a>
          </td>
          <td>
            <a href='/customers'>View Customers</a>
          </td>
        </tr>
      </table>
      <RouterProvider router={router}/>
      {/*<div style={{padding: '10px'}}>
        <label for='user'>Username: </label>
        <input 
            id='user' 
            type='text' 
            onChange={(event) => {
              setUser(event.value)
            }}
            value={user}
        />
        <label for='pass'>Password: </label>
        <input 
            id='pass' 
            type='text' 
            onChange={(event) => {
              setPassword(event.value)
            }}
            value={password}
        />
      </div>*/}
    </div>
  )
}

export default App;
