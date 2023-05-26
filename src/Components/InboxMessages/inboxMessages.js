import { Button, Grid } from "@material-ui/core"
import { UseAppContext } from "../../Contexts/app-context"
import { Topbar, Sidebar, Backdrop } from "../../Components"
import { useState, useEffect } from 'react'
import Axios from 'axios'
import { FaImages, FaSearch, FaPlusSquare } from 'react-icons/fa'
import { Link } from 'react-router-dom';
import axios from 'axios'
import LoadingIcons from 'react-loading-icons'
import { LeftNavigation } from '../../Components'
import Profile from "../../assets/profile.jfif"
import { Ads } from '../../Components'
import testUtils from "react-dom/test-utils"

const InboxMessages = ({})=>{

    const {loading, loggedIn, allUsers, currentUserParsed, setTestValue, testValue} = UseAppContext()
    const [newAllMessages, setNewAllMessages] = useState([])
    const [userUniqueIds, setUserUniqueIds] = useState([])
    const [fetchedUsers, setFetchedUsers] = useState([])
    const  {_id : userId, username : userUsername, messageNotifications, newMessageList } = currentUserParsed
    const messageUrl =  `https://server.connect.smartegbuchulem.co/api/v1/messages/${userId}/${userUsername}`
    const [usersWithMessages, setUsersWithMessages] = useState([])
    const [msgUsers, setMsgUsers] = useState([])
    const allMsgUsers = []
// console.log(currentUserParsed.newMessageList)
    const newUsersWithMessages = []

    //[61e9604cd8618895c8456f75,61e964b5d8618895c8457064,61e96413d8618895c8456feb]
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

// const filterMessages = ()=>{
    
//     const filteredSent = [...new Set(newAllMessages.map(item => item.senderId))] 
//     const filteredReceived = [...new Set(newAllMessages.map(item => item.receiverId))]  
//     const filtered = [...new Set(filteredSent.concat(filteredReceived))]  
//     setUserUniqueIds(filtered)

// }

// useEffect(()=>{
//   filterMessages()
// },[newAllMessages])



const fetchUsers = async(fetchurl)=>{
    const result = await axios(fetchurl)
    const fetchedUserVal = result.data.usersData 
    setFetchedUsers(fetchedUserVal)

}

useEffect(()=>{
    fetchUsers(`https://server.connect.smartegbuchulem.co/api/v1/user`)
},[newAllMessages, userUniqueIds])

const setUsersMessages = ()=>{
    fetchedUsers.length && newMessageList.length && newMessageList.map(itemId =>{
        fetchedUsers.map(userDetails =>{
            if(itemId == userDetails._id){
                allMsgUsers.unshift(userDetails)
                setMsgUsers(allMsgUsers)
            }
        })
    })


}

useEffect(()=>{
    setUsersMessages()
},[fetchedUsers])

// usersWithMessages.sort((a,b)=>{
    //     if(a.setNewAllMessages)
    // })
    //    const sentMessagesSorted =()=>{
        //    if(a.sentMessages.length > 0){

const sortUsersMessageByTime = ()=>{
   let idss = usersWithMessages.sort((a,b) =>{
            return  b.firstname - a.firstname
        })
        // console.log(usersWithMessages)
    }
    
    // return new Date(b.sentMessages[b.sentMessages.length - 1].createdAt) - new Date(a.sentMessages[a.sentMessages.length - 1].createdAt)
// }
//    } 

//    sentMessagesSorted()


useEffect(()=>{
    sortUsersMessageByTime()
},[fetchedUsers])


    // const newVar = tesUsers.reverse()
    // console.log(newVar)



    return <div >
        {
            msgUsers.length  ? msgUsers.map(user =>{
                const {_id : id, username : otherUsername, firstname, lastname, profilePicture} = user
                if(messageNotifications.includes(id)){
                    return <Link to={`/chat/${userId}/${userUsername}/${id}/${otherUsername}`} className='inbox-link' style={{textDecoration:"none"}}>
                    <button className='inbox-userbox' style={{width:"100%",border:"none", padding:"0.5rem 0", cursor:"pointer", marginLeft:'0'}}>
                        <div className='inbox-items'>
                            <img src={profilePicture ? profilePicture : Profile} className='inbox-photo'/>
                            <span className='inbox-name'>{firstname && lastname &&`${firstname} ${lastname}`}</span>
                            <div className='unread-message'></div>
                        </div>
                    </button>
                </Link>
                }else if(!messageNotifications.includes(id)){
                    return <Link to={`/chat/${userId}/${userUsername}/${id}/${otherUsername}`} className='inbox-link' style={{textDecoration:"none"}}>
                    <button className='inbox-userbox' style={{width:"100%",border:"none", padding:"0.5rem 0", cursor:"pointer", marginLeft:'0'}}>
                        <div className='inbox-items'>
                            <img src={profilePicture ? profilePicture : Profile} className='inbox-photo'/>
                            <span className='inbox-name'>{firstname && lastname &&`${firstname} ${lastname}`}</span>
                        </div>
                    </button>
                </Link>
                }
                
        })
         : 
        <div style={{width: "100%",height : "5rem", 
            display: 'grid', placeItems: "center"}}>
            <h4 className='no-message'>No Messages in your inbox</h4>
            <LoadingIcons.Puff  stroke="#555" strokeOpacity={.9} />
        </div>  
    
    }
    
    </div>
}


export default InboxMessages