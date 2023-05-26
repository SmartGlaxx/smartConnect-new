import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './connectionsList.css'
import axios from 'axios'
import { Grid } from '@material-ui/core'
import { FaUserAlt, FaUsers, FaImages, FaExclamationCircle, FaHome, FaUser, FaAngleRight, FaAngleLeft} from 'react-icons/fa'
import {Topbar, Sidebar, Backdrop} from '../../Components';
import { UseAppContext } from '../../Contexts/app-context'
import {Link, useNavigate} from 'react-router-dom'
import {Navigate} from 'react-router-dom'
import Axios from 'axios'
import OtherUsers from '../../Components/OtherUsers/otherUsers'
import LoadingIcons from 'react-loading-icons'
import { Loader } from '../../Components'
import ProfileImage from '../../assets/profile.jpg'
import CoverImage from '../../assets/cover.jfif'
import Button from '@restart/ui/esm/Button'
// import Profile from "../../assets/profile.jfif"
import { LeftNavigation } from '../../Components'

const ConnectionsList =()=>{
const {loggedIn, setLoading, loading, currentUser, currentUserParsed, allUsers, postcreated, setPostCreated, setTempAllusers,
tempAllUsers, setNewCurrentUser, setUserClicked, userClicked, setFetchedUser, fetchedUser, setTestValue, testValue} = UseAppContext()

return <div className='connections-list-box'>
    <hr />
    <h3 className='connections-header'>Connections</h3>
 {
    allUsers &&
    allUsers.map(allUser => {
        const {_id : id, username, firstname, lastname, profilePicture} = allUser
        const {_id, connections} = currentUserParsed.connections ? currentUserParsed : JSON.parse(currentUser)
                if(allUser._id !== _id && currentUserParsed.connections && currentUserParsed.connections.includes(allUser._id)){
                return <Link to={`/userprofile/${allUser._id}/${username}`} onClick={()=>setUserClicked(!userClicked)} className='link-homepage'>
                            <div key={id} className='connetions-box-homepage'>
                                <img src={profilePicture ? profilePicture : ProfileImage} alt={username} className="connections-img-homepage"/>
                            <div className='connections-name-homepage'>{firstname && lastname && `${firstname} ${lastname}`}</div>
                    </div>
                </Link>
                }
        })
    }
</div>
}

export default ConnectionsList