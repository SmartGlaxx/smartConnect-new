import React, {useState} from 'react'
import './left-navigation.css'
import { Button } from '@material-ui/core'
import Grid from "react-loading-icons/dist/components/grid"
import { UseAppContext } from "../../Contexts/app-context"
import { Link } from "react-router-dom"
import { FaHome, FaUserAlt, FaImages, FaChevronCircleDown, FaPeopleArrows, FaUserFriends,
    FaEnvelope, FaPlusSquare} from 'react-icons/fa'
import ProfileImage from '../../assets/profile.jpg'

const LeftNavigation = ()=>{
    const {loggedIn, loading, setLazyLoading, lazyLoading, currentUser,timelineposts, allUsers, postcreated, 
        setPostCreated, currentUserParsed, fetchedUser, openSidebar} = UseAppContext()
    const {_id : userId, username : userUsername, followings, followers, 
        profilePicture : userProfilePicture, coverPicture : userCoverPicture} = fetchedUser
    const {_id , username, firstname, lastname, profilePicture} = currentUserParsed
    const [showDropdown, setShowDropdown] = useState(false)

    // let firstnameCapitalized = '';
    // let lastnameCapitalized = ''
    // if(firstname){
    //     firstnameCapitalized = firstname.slice(0,1).toUpperCase().concat(firstname.slice(1).toLowerCase())
    // }

    // if(lastname){
    //     lastnameCapitalized = lastname.slice(0,1).toUpperCase().concat(lastname.slice(1).toLowerCase())
    // }

    const setCloseDropdown = ()=>{
        if(showDropdown ){
            setShowDropdown(false)
        }
    }


    return   <div className='page-left-inner' onClick={()=>{setCloseDropdown(true)}}>
        <ul className='homepage-left-ul' >
            <li className='homepage-left-li'>
            <Link to={`/userprofile/${_id}/${username}`} className='left-nav'>
            <div  className='left-nav-inner2'> 
            <img src={profilePicture ? profilePicture : ProfileImage } className='left-nav-profile-img' /><br />
             { firstname && lastname &&`${firstname} ${lastname}`}</div>
            </Link>
            </li>
            <li className='homepage-left-li'>
              <Link to="/" className="left-nav" >
                <div className= {window.location.pathname == '/' ? `left-nav-inner-active` :`left-nav-inner` }
                ><FaHome />  Home</div>
            </Link>
            </li>
            <li className='homepage-left-li'>
              <Link to={`/connections/${_id}/${username}`}  className="left-nav" >
                <div className= {window.location.href.indexOf("connections") > -1 ? `left-nav-inner-active` :`left-nav-inner` }
                ><FaPeopleArrows />  Connections</div>
            </Link>
            </li>
            <li className='homepage-left-li'>              
                <Link to={`/follows/${_id}/${username}`} className="left-nav">
                <div className= {window.location.href.indexOf("follows") > -1 ? `left-nav-inner-active` :`left-nav-inner` }>
                <FaUserFriends />  Follows</div>
                </Link>
            </li>
            <li className='homepage-left-li'>
            <span className="left-nav">
            <div  className= {window.location.href.indexOf("chat") > -1 ||
            window.location.href.indexOf("inbox") > -1 || 
            window.location.href.indexOf("composemessage") > -1 ?
             `left-nav-inner-active` :`left-nav-inner` } onClick={()=>{setShowDropdown(!showDropdown)}}>
            <FaEnvelope /> Messages
            <FaChevronCircleDown  className='dropdown-2'
            variant="contained" />
            </div>
               </span>
            </li>
        </ul>
        {showDropdown && <div className='main-message-options-box'>
        <Link to='/composemessage'  
                className= {window.location.href.indexOf("composemessage") > -1  ? `left-nav-sub-link-active` : `left-nav-sub-link`}>
        <div className='sub-link-btn'>
                <FaPlusSquare className= {window.location.href.indexOf("composemessage") > -1  ? `icons-active` :`icons`} />
                    New Message
                </div>
                </Link>
            <Link to='/inbox' 
            className= {window.location.href.indexOf("inbox") > -1  ? `left-nav-sub-link-active` : `left-nav-sub-link`}>
            <div className='sub-link-btn' >
                <FaEnvelope className= {window.location.href.indexOf("inbox") > -1  ? `icons-active` :`icons`} />
                    Inbox
                </div>
            </Link>
        </div>}
    </div>
}

export default LeftNavigation