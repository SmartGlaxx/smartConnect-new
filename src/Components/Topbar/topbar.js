import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import {Button, Divider} from '@material-ui/core';
import { Link, Navigate } from 'react-router-dom';
import './topbar.css'
import { Grid } from '@material-ui/core'
import {FaSearch, FaHome, FaPeopleArrows, FaRegClock, FaUserFriends, FaEnvelope, FaUserAlt,
     FaTh, FaBell, FaSignOutAlt, FaChevronCircleDown, FaTools, FaRegEnvelope, FaPlusSquare} from 'react-icons/fa' 
import { UseAppContext } from '../../Contexts/app-context'
import ListIcon from '@material-ui/icons/List';
import { Search } from '..';

//for popover starts
const useStyles = makeStyles((theme) => ({
    typography: {
      padding: theme.spacing(2),
    },
  }));
  

  //for popover ends

const Topbar =()=>{
     const {setLoggedIn, loggedIn, allUsers, setCurrentUser, currentUser, currentUserParsed, openSidebar,
        setSearchTermValue, searchTermValue} = UseAppContext()
     const {_id, username, firstname, lastname, receivedConnectionRequests, messageNotifications} = currentUserParsed
     const [receivedRequests, setReceivedRequests] = useState([])
     let usernameCapitalized = ''

     
    //  if(username){
    //      usernameCapitalized = username.slice(0,1).toUpperCase().concat(username.slice(1).toLowerCase())
    //  }
     let firstnameCapitalized = '';
     let lastnameCapitalized = ''
     if(firstname){
         firstnameCapitalized = firstname.slice(0,1).toUpperCase().concat(firstname.slice(1).toLowerCase())
     }
 
     if(lastname){
         lastnameCapitalized = lastname.slice(0,1).toUpperCase().concat(lastname.slice(1).toLowerCase())
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
     
     
    //  setReceivedRequests(requestUsers)

    //  console.log('receivedRequests', receivedRequests)

     //popover function start
     const classes = useStyles();
     const [anchorEl, setAnchorEl] = React.useState(null);
     const [anchorEl2, setAnchorEl2] = React.useState(null);
     const [anchorEl3, setAnchorEl3] = React.useState(null);
   
     const handleClick = (event) => {
       setAnchorEl(event.currentTarget);
     };

     const handleClick2 = (event) => {
        setAnchorEl2(event.currentTarget);
      };
      
    const handleClick3 = (event) => {
    setAnchorEl3(event.currentTarget);
    };
   
     const handleClose = () => {
       setAnchorEl(null);
     };
     const handleClose2 = () => {
        setAnchorEl2(null);
      };

    const handleClose3 = () => {
        setAnchorEl3(null);
    };
   
     const open = Boolean(anchorEl);
     const open2 = Boolean(anchorEl2);
     const open3 = Boolean(anchorEl3);
     const id = open ? 'simple-popover' : undefined;
     const id2 = open2 ? 'simple-popover2' : undefined;
     const id3 = open3 ? 'simple-popover3' : undefined;
     //popover function end

     const setLoginValues =(value, loginData)=>{
        setCurrentUser(loginData)
        setLoggedIn(value)
        window.location.href = '/login'
    }

  const setSearchTerm = (e)=>{
    setSearchTermValue(e.target.value)
  }
     
  let notificationSum = 0
  receivedConnectionRequests && receivedConnectionRequests.length > 0 && (notificationSum += receivedConnectionRequests.length)
  messageNotifications && messageNotifications.length > 0 && (notificationSum += messageNotifications.length)


    return <Grid className='topbarContainer' container>
        <Grid className="topLeft" item xs ={9} sm={3} >
            <Link to='/' className='mainlogo-link'>
                <div className='mainlogo'>SC</div>
            </Link>
            <div style={{display:"block"}}>
            <div className='topLeft-inner'>
                <FaSearch className='icons2' />
                <input type='search' className='search' onChange={setSearchTerm} value={searchTermValue}
                placeholder='Search SmartConnect'/>
            </div>
            {
            searchTermValue  && <div className='search-box'>
                     <Search />
                </div>
            }
            </div>
        </Grid>
        <Grid className="topCenter" item xs ={false} sm={5}>
            <div className="topCenter-inner">
                <ul className="topCenter-ul">
                    <Link to='/' className={window.location.pathname == '/' ? `topCenter-li-active` :`topCenter-li` }>
                        <li >
                            <FaHome 
                            className= {window.location.pathname == '/' ? `top-icons-active` :`top-icons` }
                             size='25'/>
                        </li>
                    </Link>
                    <Link to={`/connections/${_id}/${username}`}
                    className={window.location.href.indexOf("connections") > -1 ? `topCenter-li-active` :`topCenter-li` } >
                        <li >
                            <FaPeopleArrows 
                            className= {window.location.href.indexOf("connections") > -1 ? `top-icons-active` :`top-icons` }
                            size='25'/>
                        </li>
                    </Link>
                    <Link to={`/follows/${_id}/${username}`}
                    className={window.location.href.indexOf("follows") > -1 ? `topCenter-li-active` :`topCenter-li` } >
                        <li>
                            <FaUserFriends 
                            className= {window.location.href.indexOf("follows") > -1 ? `top-icons-active` :`top-icons` }
                            size='25'/>
                        </li>
                    </Link>
                    <Link to='/inbox' 
                    className= {window.location.href.indexOf("chat") > -1 ||
                    window.location.href.indexOf("inbox") > -1 || 
                    window.location.href.indexOf("composemessage") > -1 ? 
                    `topCenter-li-active` :`topCenter-li` }>
                        <li className="topCenter-li">
                            <FaEnvelope 
                            className= {window.location.href.indexOf("chat") > -1 ||
                            window.location.href.indexOf("inbox") > -1 || 
                            window.location.href.indexOf("composemessage") > -1 ?
                            `top-icons-active` :`top-icons` }
                            size='25'/>
                        </li>
                    </Link>
                </ul> 
            </div>
        </Grid>
        <Grid className="topCRight" item xs ={false} sm={4}>
            <div className="topRight-inner" >
                <ul className="topRight-ul" >
                    <li className='topRight-li'>
                        <div className='icon2-text'>
                            <button aria-describedby={id} variant="contained" onClick={handleClick3}
                            className='notification-btn'>
                            <FaBell  className="icons2"/>
                            <span className='notification-count'>{ notificationSum}</span>
                            </button>
                        <Popover
                            id={id}
                            open={open3}
                            anchorEl={anchorEl3}
                            onClose={handleClose3}
                            anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                            }}
                            transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                            }}
                        >
                            <div className='notification-box'>
                           {
                               requestUsers.length > 0 ? <>
                               <div>
                                   <Link to={`/connections/${_id}/${username}`} className='notification-link-title'>
                                       <h4>Received Requests ({receivedConnectionRequests.length})</h4>
                                    </Link>
                                    {requestUsers.slice(0,2).map(user =>{
                                        const {_id, username, firstname, lastname} = user
                                        return <Link key={_id} to={`/userprofile/${_id}/${username}`} className='notification-link'>
                                                <div className='notification-btn'>
                                                    {firstname && lastname && `${firstname} ${lastname}`}
                                                </div>
                                            </Link>
                                    })} 
                                    
                               </div>
                               <span className='plus-more'>{requestUsers.length > 2 && `+ ${requestUsers.length - 2 } more`}</span></>
                               :
                               <div>No Notifications </div>
                           }
                           { messageNotifications && messageNotifications.length > 0 && <> <div>
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
                        </Popover>

                        </div>
                    </li>
                    <li className='topRight-li'>
                        <FaChevronCircleDown  className="icons2" aria-describedby={id} variant="contained" color="primary" onClick={handleClick}/>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                            }}
                            transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                            }}
                        >
                        <div style={{ padding:" 1rem 0", display:"flex", flexDirection:"column", placeItems:"center"}}>
                        <Button className='link-btn'
                        style={{display:"flex", justifyContent:"flex-start", alignItems:"center", 
                        width:"100%", padding:"0.3rem 0.5rem", margin:"0"}}>
                            <Link to={`/userprofile/${_id}/${username}`} className='link'>
                                <FaUserAlt className='nav-icon' /> <span  className='link'>{firstname && lastname && `${firstname} ${lastname}`}</span>
                            </Link>
                        </Button>
                        <Button aria-describedby={id2} onClick={handleClick2} className='link-btn'
                        style={{display:"flex", justifyContent:"flex-start", alignItems:"center",
                        width:"100%", padding:"0.3rem 0.5rem"}}>
                            <FaEnvelope className='nav-icon link' /><span className='link'>Messages</span>
                        </Button>
                        <Button className='link-btn'
                        style={{display:"flex", justifyContent:"flex-start", alignItems:"center",
                        width:"100%", padding:"0.3rem 0.5rem"}}>
                            <FaTools className='nav-icon link' /><span className='link'>Settings</span>
                        </Button>
                        <Divider />
                        {loggedIn && 
                        // <Button onClick={()=>setLoginValues(false, {})} 
                        // className='link-btn'style={{display:"flex", justifyContent:"flex-start", alignItems:"center",
                        // width:"100%", padding:"0.3rem 0.5rem"}}>
                        //     <span  className='log-out' >Log out</span></Button>

                        <Button onClick={()=>setLoginValues(false, {})}  className='link-btn' 
                        style={{display:"flex", justifyContent:"flex-start", alignItems:"center",
                        width:"100%", padding:"0.3rem 0.5rem"}}>
                            <FaSignOutAlt className='link log-out-icon' /><span  className='log-out-btn' >Sign-out</span>
                        </Button>
                        }
                            </div>
                        </Popover>
                        <Popover
                            id={id2}
                            open={open2}
                            anchorEl={anchorEl2}
                            onClose={handleClose2}
                            anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                            }}
                            transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                            }}
                        >
                            <Button className='link-btn'
                            style={{display:"flex", justifyContent:"flex-start", alignItems:"center",
                            width:"100%", padding:"0.3rem 0.5rem"}}>
                                <FaPlusSquare className='nav-icon link' />
                                <Link to='/composemessage' className='link'>
                                    New Message
                                </Link>
                            </Button>
                            <Button className='link-btn'
                            style={{display:"flex", justifyContent:"flex-start", alignItems:"center",
                            width:"100%", padding:"0.3rem 0.5rem"}}>
                                <FaEnvelope className='nav-icon link' />
                                <Link to='/inbox' className='link'>
                                    Inbox
                                </Link>
                            </Button>
                        </Popover>
                    </li>
                </ul>
            </div>
        </Grid>
        <div className='menu-btn-box'><ListIcon className='menu-btn' onClick = {openSidebar}/></div>
    </Grid>
}

export default Topbar
