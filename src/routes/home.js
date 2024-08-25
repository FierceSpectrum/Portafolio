import React from 'react'
import { Link } from 'react-router-dom';


function home() {
    return (
        <div>
            <Link to='/contact'>Contact</Link>
            <br />
            <Link to='/About'>About</Link>
        </div>
    )
}

export default home
