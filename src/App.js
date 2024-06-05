// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Home from './Home';

import './App.css';

const NotFound = () => {
    return <h2>404 Not Found</h2>;
}

const App = () => {

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Router>
            <nav className="navbar navbar-expand-lg navbar-dark">
                <Link className="navbar-brand ms-3" to="/">Currency Converter</Link>
            </nav>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route component={NotFound} />
            </Switch>
            <footer className="p-3 bg-dark">  
                <div className="text-white">
                    <span className="mr-3">Built by <a href="https://my-personalweb-portfolio.netlify.app/" target="_blank" className="text-success">Viktoriia Koyun</a></span>
                    <span className="mr-3"> from <a href="https://www.altcademy.com" target="_blank" className="text-success">Altcademy</a></span>
                </div>
            </footer>
            <button onClick={scrollToTop} className="up-button">↑</button>
        </Router>
        
    );
}

export default App;