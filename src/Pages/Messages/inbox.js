import './messages.css'
import { Button, Grid } from "@material-ui/core"
import { UseAppContext } from "../../Contexts/app-context"
import { Topbar, Sidebar, Backdrop,InboxMessages } from "../../Components"
import { useState, useEffect } from 'react'
import Axios from 'axios'
import API from '../../Utils/api'
import { FaImages, FaSearch, FaPlusSquare } from 'react-icons/fa'
import { Link , Navigate} from 'react-router-dom';
import axios from 'axios'
import LoadingIcons from 'react-loading-icons'
import { Loader } from '../../Components'
import { LeftNavigation } from '../../Components'
import Profile from "../../assets/profile.jfif"
import { Ads } from '../../Components'

const Inbox = () =>{
    const {loading, loggedIn, allUsers, currentUserParsed, setTestValue, testValue} = UseAppContext()
    const [newAllMessages, setNewAllMessages] = useState([])
    const [userUniqueIds, setUserUniqueIds] = useState([])
    const [fetchedUsers, setFetchedUsers] = useState([])
    const  {_id : userId, username : userUsername, messageNotifications } = currentUserParsed
    const messageUrl =  `${API}/messages/${userId}/${userUsername}`
    
    const fetchUserMessages = async(url)=>{
      
        const options = {
            url: url,
            method : "GET",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json;charset=UTF-8"
            }
        }
        
       // dispatch({type : LOADING, payload : true})
    
        const result = await Axios(options)
        
        const {response, allUserMessages} = result.data
        
        if(response == 'Success' && allUserMessages){
            
           const newAllUserMessages = allUserMessages.sort((a,b)=>{
               return a.senderId - b.senderId
           })
           setNewAllMessages(newAllUserMessages)
        }else if(response == 'Fail'){
        //    setError({status : true, msg : "Fialed to fetch timeline posts"})
           return setTimeout(()=>{
                // setError({status : false, msg :''})
        }, 4000)
        }
        
    }

useEffect(()=>{
    fetchUserMessages(messageUrl)
},[fetchedUsers])

const filterMessages = ()=>{
    
    const filteredSent = [...new Set(newAllMessages.map(item => item.senderId))] 
    const filteredReceived = [...new Set(newAllMessages.map(item => item.receiverId))]  
    const filtered = [...new Set(filteredSent.concat(filteredReceived))]  
    setUserUniqueIds(filtered)

}

useEffect(()=>{
  filterMessages()
},[newAllMessages])



const fetchUsers = async(fetchurl)=>{
    const result = await axios(fetchurl)
    const fetchedUserVal = result.data.usersData 
    setFetchedUsers(fetchedUserVal)

}

useEffect(()=>{
    fetchUsers(`${API}/user`)
},[newAllMessages, userUniqueIds])

//scroll to top of page
useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

useEffect(()=>{
    setTestValue(!testValue)
},[])

if(loggedIn == "false" || !loggedIn){
    return <Navigate to='/login' />
}

if(loading || allUsers.length == 0 || !currentUserParsed._id){
    return <Loader />
}


    return <div>
        <Topbar />
        <Sidebar />
        <Backdrop />
        <Grid container className='inbox'>
            <Grid item xs={false} sm={3} md={3} className='inbox-mobile-disabled'>
                <LeftNavigation />
            </Grid>
            <Grid item  xs={12} sm={6} md={6} className="inbox-center">
            <div className='inbox-center-inner'>
                <h2>Inbox</h2>
            </div>
                {/* <div className='inbox-center-search'>
                    <FaSearch className='icons2' />
                    <input type='search' className='message-search' placeholder='Search Messages'/>
                </div> */}
                <Link to='/composemessage' className='message-header'><FaPlusSquare className='add-chat'  size='25'/></Link>
                <div className='all-messages'>
                    <InboxMessages />
                </div>
            </Grid>
            <Grid item xs={false} sm={false} md={3} className="inbox-right inbox-mobile-disabled">
                <Ads />
            </Grid>
        </Grid>
    </div>
}


export default Inbox