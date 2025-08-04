import React from 'react'
import './Header.css'
import { NavLink } from 'react-router-dom'
function Header() {
    return (
        <div className="header">
            <div className='bot_name'>ChatBot Name</div>
            <div className="auth">
                <button>
                <NavLink
                to="/login">
                    Login
                </NavLink>
            </button><button>
                <NavLink
                to="/signUp">
                    SignUp
                </NavLink>
           </button>

                {/* <NavLink
                    to="/login">
                    Login
                </NavLink>

                <NavLink
                    to="/signUp">
                    SignUp
                </NavLink> */}

            </div>
        </div>
    )
}

export default Header
