import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './connections.css'
import axios from 'axios'
import API from '../../Utils/api'
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

const Connections =()=>{
const {loggedIn, setLoading, loading, currentUser, currentUserParsed, allUsers, postcreated, setPostCreated, setTempAllusers,
tempAllUsers, setNewCurrentUser, setUserClicked, userClicked, setFetchedUser, fetchedUser, setTestValue, testValue} = UseAppContext()
const [formValue, setFormValue] = useState('')
const [error, setError] = useState({status : false, msg:''})
const {_id : userId, username : userUsername, followings, followers, connections, connectionRequests} = JSON.parse(currentUser)
const [alertMsg, setAlertMsg] = useState({status : false, msg : ''})
const unFollowurl = `${API}/user/unfollow`
const getUserurl = `${API}/user/${userId}/${userUsername}`
const posturl = `${API}/posts`
// const [userClicked, setUserClicked] = useState(false)
const [newPage, setNewPage] = useState(false)
const [timelineposts, setTimelinePosts] = useState([])

// const setValues = (e)=>{
//     setFormValue(e.target.value)
// }


const setValues = (value, data)=>{
    setNewCurrentUser(data)
    setLoading(value)
}

let newUserConections  = []
if(currentUserParsed.connections){
    newUserConections = currentUserParsed.connections
}

const {id, username} = useParams()


//CONNECTION REQUEST TO USER
const connectRequest =async(e, value1, value2)=>{
    e.preventDefault()
    
    const {_id , username} = currentUserParsed
   
        const options = {
            url : `${API}/user/connectrequest/${value1}/${value2}`,
            method : "PATCH",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json;charset=UTF-8"
            },
            data:{
                userId : _id,
                username : username                
            }
        } 
        
        const result = await axios(options)
      
        if(result.data.response == "Success"){
            const reponse_2 = await axios(getUserurl)
            const {data} = reponse_2.data
            if(data){
                setTestValue(!testValue)
                // window.location.href=`/userprofile/${_id}/${username}`
                // setDataValues(true, data)
            } 
        }else{
            setAlertMsg({status : true, msg : 'Failed to send request from user'})  
        }       
        
    // }

}


//ACCEPT CONNECTION REQUEST FROM A USER
const acceptConnectRequest = async(e, value1, value2)=>{
    e.preventDefault()
    const {_id : currentUserId, username : currentUserName} = JSON.parse(currentUser)
    const options ={
        url : `${API}/user/acceptconnectrequest/${value1}/${value2}`,
        method : "PATCH",
        headers : {
           "Accept" : "Application/json",
           "Content-Type" : "Application/json;charset=utf-8"
        },
        data :{
            userId : currentUserId,
            username : currentUserName
        }
    }
    
    const result = await axios(options)
    
    const {response} = result.data
    if(response == 'Success'){
        const reponse_2 = await axios(getUserurl)
        const {data} = reponse_2.data
        
        if(data){
            // window.location.href='/' 
            // setValues(true, data)
            setTestValue(!testValue)
        } 
    }else{
        setError({status : true, msg : "Failed to accept request from user"})
    }
}


//DECLINE CONNECTION REQUEST FROM A USER
const declineConnectRequest = async(e, value1, value2)=>{
    e.preventDefault()
    const {_id : currentUserId, username : currentUserName} = JSON.parse(currentUser)
    const options ={
        url : `${API}/user/declineconnectrequest/${value1}/${value2}`,
        method : "PATCH",
        headers : {
           "Accept" : "Application/json",
           "Content-Type" : "Application/json;charset=utf-8"
        },
        data :{
            userId : currentUserId,
            username : currentUserName
        }
    }
    
    const result = await axios(options)
    
    const {response} = result.data
    if(response == 'Success'){
        const reponse_2 = await axios(getUserurl)
        const {data} = reponse_2.data
        
        if(data){
            // window.location.href='/' 
            // setValues(true, data)
            setTestValue(!testValue)
        } 
    }else{
        setError({status : true, msg : "Failed to decline request from user"})
    }
}


//DISCONNECTION REQUEST TO USER
const disconnectRequest =async(e, value1, value2)=>{
    e.preventDefault()
    
    const {_id , username} = currentUserParsed
   
        const options = {
            url : `${API}/user/disconnectrequest/${value1}/${value2}`,
            method : "PATCH",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json;charset=UTF-8"
            },
            data:{
                userId : _id,
                username : username                
            }
        } 
        
        const result = await axios(options)
      
        if(result.data.response == "Success"){
            const reponse_2 = await axios(getUserurl)
            const {data} = reponse_2.data
            if(data){
                setTestValue(!testValue)
                // window.location.href=`/userprofile/${_id}/${username}`
                // setDataValues(true, data)
            } 
        }else{
            setAlertMsg({status : true, msg : 'Failed to disconnect from user'})  
        }       
        
    // }

}


let randomStart = 0
let randomEnd = 0


if(allUsers.length !== 0){
randomStart = Math.floor(Math.random() * 10)
if(allUsers.length - randomStart <= 5){
    randomStart = 0
}
randomEnd = randomStart + 20
}

const setRandomUsers = (value)=>{
    setTempAllusers(value.slice(randomStart,randomEnd))
}

useEffect(()=>{
    setRandomUsers(allUsers)
},[allUsers])

//scroll to top of page
useEffect(() => {
    window.scrollTo(0, 0)
}, [])

let userSentConnectionRequests = currentUserParsed.sentConnectionRequests ? currentUserParsed.sentConnectionRequests : []
let userReceivedConnectionRequests = currentUserParsed.receivedConnectionRequests ? currentUserParsed.receivedConnectionRequests : []
let userConnections = currentUserParsed.connections ? currentUserParsed.connections : []


    const sentConnectionRequestsArray =  allUsers.filter(user =>{
        if(currentUserParsed.sentConnectionRequests){
            if(currentUserParsed.sentConnectionRequests.includes(user._id)){
                return user
            }
            }else{
                return
            }
    })
    const receivedConnectionRequestsArray =  allUsers.filter(user =>{
        if(currentUserParsed.receivedConnectionRequests){
            if(currentUserParsed.receivedConnectionRequests.includes(user._id)){
                return user
            }
            }else{
                return
            }
    })
    const  connectionsArray =  allUsers.filter(user =>{
        if(currentUserParsed.connections){
            if(currentUserParsed.connections.includes(user._id)){
                return user
            }
        }else{
            return  
        }
        })        



if(loggedIn == "false" || !loggedIn){
    return <Navigate to='/login' />
}
        

if(loading || allUsers.length == 0 || !currentUserParsed._id){
    return <Loader />
}


    return <>
    <Topbar />
    <Sidebar />
    <Backdrop />
    <Grid className='connections' container > 
        <Grid className='connections-mobile-disabled' item  sm={false} md={3} >
        <LeftNavigation />   
        </Grid> 
            <Grid className='connections-center' item xs={12} sm={12} md={6} > 
            <h2 className='connect-title'>Connections</h2>
            <h4>People you can connect with</h4>
            <hr />
            {/* <br /> */}
            <div className='connections-center-inner' >
            {
            tempAllUsers &&
            tempAllUsers.map(allUser => {
                const {_id : id, username, firstname, lastname, profilePicture} = allUser
                const {_id, connections} = currentUserParsed.connections ? currentUserParsed : JSON.parse(currentUser)
                        if(allUser._id !== _id && currentUserParsed.connections && !currentUserParsed.connections.includes(allUser._id) && !currentUserParsed.receivedConnectionRequests.includes(allUser._id)){
                        return <div key={id} className='connetions-box'>
                            <Link to={`/userprofile/${allUser._id}/${username}`} onClick={()=>setUserClicked(!userClicked)}>
                                <img src={profilePicture ? profilePicture : ProfileImage} alt={firstname} className="connections-img"/>
                            </Link>
                            <div className='connections-name'>{firstname && lastname && `${firstname} ${lastname}`}</div>
                            <form>
                                <br/>
                                <button onClick={(e)=>connectRequest(e, id, username)} className='connect-btn'>
                                    { !currentUserParsed.sentConnectionRequests.includes(allUser._id) ? `Connect` : 
                                    !currentUserParsed.receivedConnectionRequests.includes(allUser._id) ? `Cancel` : null}
                                </button>
                            </form>
                        </div>
                        }
                })
            }
            </div>
            <div className='button-nav'>
            <button className='more-btn' onClick={()=>setRandomUsers(allUsers)}>Find Random Users</button>
            </div>
            {/* <br /> */}
            <h4> Received Connection Requests ({userReceivedConnectionRequests.length})</h4>
            <hr />
            {/* <br /> */}
             <div className='connections-center-inner' >
            {
            allUsers &&
            allUsers.map(allUser => {
                const {_id : id, username, firstname, lastname, profilePicture} = allUser
                const {_id, connections} = currentUserParsed.connections ? currentUserParsed : JSON.parse(currentUser)
                        if(allUser._id !== _id && currentUserParsed.receivedConnectionRequests && currentUserParsed.receivedConnectionRequests.includes(allUser._id)){
                        return <div key={id} className='connetions-box'>
                            <Link to={`/userprofile/${allUser._id}/${username}`} onClick={()=>setUserClicked(!userClicked)}>
                                <img src={profilePicture ? profilePicture : ProfileImage} alt={username} className="connections-img"/>
                            </Link>
                            <div className='connections-name'>{firstname && lastname && `${firstname} ${lastname}`}</div>
                            <form>
                                <br/>
                                <div className='connect-response'>
                                <button onClick={(e)=>acceptConnectRequest(e, id, username)} className='connect-btn2'>
                                    Accept
                                </button>
                                <button onClick={(e)=>declineConnectRequest(e, id, username)} className='decline-connect-btn'>
                                    Decline
                                </button>
                                </div>
                            </form>
                        </div>
                        }
                })
            }
            </div>
            <br />
             <h4> Sent Connection Requests ({userSentConnectionRequests.length})</h4>
             <hr />
            {/* <br /> */}
            <div className='connections-center-inner' >
            {
            allUsers &&
            allUsers.map(allUser => {
                const {_id : id, username, firstname, lastname, profilePicture} = allUser
                const {_id, connections} = currentUserParsed.connections ? currentUserParsed : JSON.parse(currentUser)
                        if(allUser._id !== _id && currentUserParsed.sentConnectionRequests && currentUserParsed.sentConnectionRequests.includes(allUser._id)){
                        return <div key={id} className='connetions-box'>
                            <Link to={`/userprofile/${allUser._id}/${username}`} onClick={()=>setUserClicked(!userClicked)}>
                                <img src={profilePicture ? profilePicture : ProfileImage} alt={username} className="connections-img"/>
                            </Link>
                            <div className='connections-name'>{firstname && lastname && `${firstname} ${lastname}`}</div>
                            <form>
                                <br/>
                                <button onClick={(e)=>connectRequest(e, id, username)} className='connect-btn'>
                                    Cancel
                                </button>
                            </form>
                        </div>
                        }
                })
            }
            </div>
            <br />
            <h4>Connections ({connectionsArray.length})</h4>
            <hr />
            {/* <br /> */}
             <div className='connections-center-inner' >
            {
            allUsers &&
            allUsers.map(allUser => {
                const {_id : id, username, firstname, lastname, profilePicture} = allUser
                const {_id, connections} = currentUserParsed.connections ? currentUserParsed : JSON.parse(currentUser)
                        if(allUser._id !== _id && currentUserParsed.connections && currentUserParsed.connections.includes(allUser._id)){
                        return <div key={id} className='connetions-box'>
                            <Link to={`/userprofile/${allUser._id}/${username}`} onClick={()=>setUserClicked(!userClicked)}>
                                <img src={profilePicture ? profilePicture : ProfileImage} alt={username} className="connections-img"/>
                            </Link>
                            <div className='connections-name'>{firstname && lastname && `${firstname} ${lastname}`}</div>
                            <form>
                                <br/>
                                <button onClick={(e)=>disconnectRequest(e, id, username)} className='connect-btn'>
                                    Disconnect
                                </button>
                            </form>
                        </div>
                        }
                })
            }
            </div>
            </Grid>
        </Grid>
        </>
}

export default Connections