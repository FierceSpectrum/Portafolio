import React from 'react';
import { Link } from 'react-router-dom';


function about() {
    return (
        <div>
            <Link to='/'>Home</Link>
            <br />
            <Link to='/contact'>Contact</Link>
        </div>
    )
}

export default about
