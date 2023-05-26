import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import {Button, Divider} from '@material-ui/core';
import { Link } from 'react-router-dom';
import './sidebar.css'
import { FaHome, FaPeopleArrows, FaUserFriends, FaEnvelope, FaUserAlt, FaTh, 
    FaBell, FaPlusSquare, FaChevronCircleDown,FaWindowClose, FaTools, FaSignOutAlt} from 'react-icons/fa' 
import { UseAppContext } from '../../Contexts/app-context'
import ListIcon from '@material-ui/icons/List';
import ProfileImage from '../../assets/profile.jpg'

//for popover starts
const useStyles = makeStyles((theme) => ({
    typography: {
      padding: theme.spacing(2),
    },
  }));
  
  //for popover ends

const Sidebar =()=>{
    const {setLoggedIn, loggedIn, currentUserParsed, allUsers, sidebarOpen, openSidebar,
        setCurrentUser} = UseAppContext()
    const [showDropdown, setShowDropdown] = useState(false)
    const [showDropdown2, setShowDropdown2] = useState(false)
    // const [closeDropdown, setCloseDropdown] = useState(false)

const {_id, username, firstname, lastname, profilePicture, receivedConnectionRequests, messageNotifications} = currentUserParsed
     //popover function start
     const classes = useStyles();
     const [anchorEl, setAnchorEl] = React.useState(null);
   
     let firstnameCapitalized = '';
     let lastnameCapitalized = ''
     if(firstname){
         firstnameCapitalized = firstname.slice(0,1).toUpperCase().concat(firstname.slice(1).toLowerCase())
     }
 
     if(lastname){
         lastnameCapitalized = lastname.slice(0,1).toUpperCase().concat(lastname.slice(1).toLowerCase())
     }
const setCloseDropdown = ()=>{
    if(showDropdown || showDropdown2){
        setShowDropdown(false)
        setShowDropdown2(false)
    }
}

const setLoginValues =(value, loginData)=>{
    setCurrentUser(loginData)
    setLoggedIn(value)
    window.location.href = '/login'
}


// get request users 
let requestUsers = []
let messageReceived = []
if(allUsers){
    requestUsers = allUsers.filter(user => user.sentConnectionRequests.includes(_id))
}
if(messageNotifications && allUsers){
   messageReceived = allUsers.filter(user => messageNotifications.includes(user._id))
}
     
    return <div className={ sidebarOpen ? `sidebarContainer2` : `sidebarContainer1`} onClick={()=>{setCloseDropdown(true)}} >
        <div className="sidebarTop " xs ={9} sm={3}>
             <div className='sidebarlogo' onClick={openSidebar}>
                <Link to='/' className='mainlogo-link'>
                <div className='mainlogo'>SC
                </div>
            </Link>
             </div>
            <FaWindowClose className='close-icon' size='25' onClick = {openSidebar}/>
        </div>
        <div className="sideTop" >
            <div className="sideTop-inner">
                <ul className="sideTop-ul">
                     <li className="sideTop-li" onClick={openSidebar}>
                    <Link to={`/userprofile/${_id}/${username}`}  className="left-nav">
                    <div className= {window.location.href.indexOf("userprofile") > -1 ? `sideTop-li-inner-active` :`sideTop-li-inner` }
                    >
                        {/* <FaUserAlt className= {window.location.href.indexOf("userprofile") > -1 ? `icons-active` :`icons`}  size='15'/> */}
                        <img src={profilePicture ? profilePicture : ProfileImage } className='sidebar-profile-img' /><br />
                        <span className='username1'>{firstname && lastname &&`${firstname} ${lastname}`}</span>
                    </div>
                    </Link>
                    </li>
                    <li className="sideTop-li" onClick={openSidebar}>
                    <Link to='/' className='left-nav'>
                    <div className= {window.location.pathname == '/' ? `sideTop-li-inner-active` :`sideTop-li-inner` }>
                    <FaHome className= {window.location.pathname == '/'? `icons-active` :`icons`}  size='15'/>
                         Home </div>
                    </Link>
                    </li>
                    <li className="sideTop-li" onClick={openSidebar}>
                    <Link to={`/connections/${_id}/${username}`} className='left-nav' >
                    <div className= {window.location.href.indexOf("connections") > -1 ? `sideTop-li-inner-active` :`sideTop-li-inner ` }>
                    <FaPeopleArrows className= {window.location.href.indexOf("connections") > -1 ? `icons-active` :`icons`} size='15'/>
                        Connections </div>
                    </Link>
                    </li>
                    <li className="sideTop-li" onClick={openSidebar}>
                    <Link to={`/follows/${_id}/${username}`} className='left-nav' >
                    <div className= {window.location.href.indexOf("follows") > -1 ? `sideTop-li-inner-active` :`sideTop-li-inner ` }>
                    <FaUserFriends className= {window.location.href.indexOf("follows") > -1 ? `icons-active` :`icons`} size='15'/>
                        Follows </div>
                    </Link>
                    </li>
                    <li className="sideTop-li" >
                    <div  className='left-nav' >
                     <div className= {window.location.href.indexOf("chat") > -1 ||
                     window.location.href.indexOf("inbox") > -1 || 
                     window.location.href.indexOf("composemessage") > -1 ?
                     `message-btn-box sideTop-li-inner-active` :`message-btn-box sideTop-li-inner`} 
                     onClick={()=>{setShowDropdown(!showDropdown)}} >
                    <FaEnvelope className= {window.location.href.indexOf("chat") > -1 || 
                     window.location.href.indexOf("inbox") > -1 || 
                     window.location.href.indexOf("composemessage") > -1 ? `icons-active` :`icons`}  size='15'/>
                        Messages <span className='message-sidebar-notification'>{messageNotifications && messageNotifications.length > 0 && messageNotifications.length}</span>
                     <FaChevronCircleDown  className="icons2" className='dropdown'
                     variant="contained"  />
                     </div>
                     {showDropdown && <div className='message-options-box'>
                        <Button className='link-btn' onClick={openSidebar}
                            style={{display:"flex", justifyContent:"flex-start", alignItems:"center",
                            width:"100%", padding:"0.3rem 0.5rem"}}>
                                <FaPlusSquare className= {window.location.href.indexOf("composemessage") > -1  ? `icons-active` :`icons`} />
                                <Link to='/composemessage'  
                                className= {window.location.href.indexOf("composemessage") > -1  ? `link-2-active` : `link-2`}>
                                    New Message
                                </Link>
                            </Button>
                            <Button className='link-btn' onClick={openSidebar}
                            style={{display:"flex", justifyContent:"flex-start", alignItems:"center",
                            width:"100%", padding:"0.3rem 0.5rem"}}>
                                <FaEnvelope className= {window.location.href.indexOf("inbox") > -1  ? `icons-active` :`icons`} />
                                <Link to='/inbox' 
                                className= {window.location.href.indexOf("inbox") > -1  ? `link-2-active` : `link-2`}>
                                    Inbox <span className='message-sidebar-notification-2'>{messageNotifications.length > 0 && messageNotifications.length}</span>
                                </Link>
                            </Button>
                        </div>}
                    </div>
                    </li>
                </ul> 
            </div>
        </div>

        <div className="sideTop-2">
            <div className="sideTop-inner-2" >
                <ul className="sideTop-ul">
                    <li className='sideTop-li'  onClick={()=>{setShowDropdown2(!showDropdown2)}}>
                        <FaBell  className="icons" size='15'/>
                        Notifications
                        <FaChevronCircleDown  className="icons2" className='dropdown-2'
                     variant="contained"  />
                     {showDropdown2 && <div className='message-options-box-2'>
                     <div >
                           {
                               requestUsers.length > 0 ? <>
                               <div onClick={openSidebar}>
                                   <Link to={`/connections/${_id}/${username}`} className='notification-link-title'>
                                       <h4>Received Requests ({receivedConnectionRequests.length})</h4>
                                    </Link>
                                    {requestUsers.slice(0,2).map(user =>{
                                        const {_id, username, firstname, lastname} = user
                                        return <Link key={_id} to={`/userprofile/${_id}/${username}`} className='notification-link'>
                                                <div className='notification-btn'>
                                                    {firstname && lastname &&`${firstname} ${lastname}`}
                                                </div>
                                            </Link>
                                    })} 
                               </div>
                               <span className='plus-more'>{requestUsers.length > 2 && `+ ${requestUsers.length - 2 } more`}</span>
                                </>
                                :
                               <div onClick={openSidebar}>No Notifications </div>
                           }
                           { messageNotifications && messageNotifications.length > 0 && <><div onClick={openSidebar}>
                           <Link to='/inbox' className='notification-link-title'>
                                <h4>Received Messages({messageNotifications.length})</h4>
                           </Link>
                                <div>
                                {messageReceived.slice(0,2).map(user =>{
                                    const {_id, username, firstname, lastname} = user
                                    return <Link to={`/userprofile/${_id}/${username}`} className='notification-link'>
                                        <div key={_id} className='notification-btn'>{firstname && lastname && `${firstname} ${lastname}`}</div>
                                    </Link>
                                })}
                                </div>
                            </div>
                            <span className='plus-more'>{messageReceived.length > 2 && `+ ${messageReceived.length - 2 } more`}</span>
                            </>
                           }
                           </div>
                        </div>}
                    </li>
                    <li className='sideTop-li'>
                        <FaTools  className="icons" size='15'/>
                        Settings
                    </li>
                    {loggedIn && <>
                        <li onClick={()=>setLoginValues(false, {})}  className='sideTop-li logout' 
                        style={{display:"flex", justifyContent:"flex-start", alignItems:"center",
                        width:"100%", padding:"0.3rem 0rem"}}>
                            <FaSignOutAlt className="log-out-icon" size='15'/><span  className='log-out-btn' >Sign-out</span>
                        </li>
                    </>}
                </ul>
            </div>
        </div> 
        
    </div>
}

export default Sidebar
