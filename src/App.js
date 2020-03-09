import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
} from "react-router-dom";
import './App.css';
import Login from './Components/login';
import Home from './Components/home';
import Books from './Components/books';
import Authors from './Components/authors';
import SignIn from './Components/login';
import Register from './Components/register';
function App() {
  return (
    <div className="App">
          <Router>
              <div>                 
                  <Switch>
                      <Route exact path="/">
                          <SignIn />
                      </Route>
                      <Route exact path="/register">
                          <Register />
                      </Route>
                      <Route exact path="/home">
                          <Home />
                      </Route>
                      <Route path="/books">
                          <Books />
                      </Route>
                      <Route path="/authors">
                          <Authors />
                      </Route>
                  </Switch>
              </div>
          </Router>
    </div>
  );
}

export default App;
