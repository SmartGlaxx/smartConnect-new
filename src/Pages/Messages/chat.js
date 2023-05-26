 './messages.css'
import {useState, useEffect} from 'react'
import {Link, useParams, Navigate} from "react-router-dom"
import axios from 'axios'
import API from '../../Utils/api'
import { FaUserAlt, FaUsers, FaImages, FaHome, FaUser, FaCamera, FaEllipsisH, FaTelegramPlane,
    FaFileImage, FaWindowClose } from 'react-icons/fa'
import { Topbar, Sidebar, Backdrop } from "../../Components"
import {Button, Grid} from '@material-ui/core'
import { UseAppContext } from '../../Contexts/app-context'
import Axios from 'axios'
import SinglgeMessage from './singleMessage'
import { Satellite } from '@material-ui/icons'
import { LeftNavigation } from '../../Components'
import { Ads } from '../../Components'
import LoadingIcons from 'react-loading-icons'
import { Loader } from '../../Components'
import ProfileImage from '../../assets/profile.jpg'

const Chat = ()=>{

    const {loading, loggedIn, setTestValue, currentUserParsed, allUsers, setChatUser, chatUser, 
        replySent, setScrollIntoViewValue, scrollIntoViewValue, testValue } = UseAppContext()
    const [error, setError] = useState({status : false, msg:''})
    const [alertMsg, setAlertMsg] = useState({status : false, msg : ''})
    const [messageImagePreview, setMessageImagePreview] = useState('')
    const [messageImage, setMessageImage] = useState('')
    const [postPreviewBox, setPostPreviewBox] = useState(false)
    const elmnt = document.getElementById("content");
    const [chatCreated, setChatCreated] = useState(false)
    const [fetchedUser, setFetchedUser] = useState({})
    const [messageImagePreviewBox, setMessageImagePreviewBox] = useState(false)
    const msgImgurl = `${API}/messages`
    let chatUsername = ''

    const {_id : idCurrent , username : usernameCurrent, messageNotifications} = currentUserParsed

    let chatUserId = '' 
    let chatUserUsername = '' 
    let firstname  = '' 
    let lastname  = ''
    let profilePicture = ''

    if(fetchedUser){
        chatUserId = fetchedUser._id
        chatUserUsername = fetchedUser.username
        firstname = fetchedUser.firstname
        lastname = fetchedUser.lastname
        profilePicture = fetchedUser.profilePicture
        // const {_id : chatUserId, username : chatUserUsername, firstname, lastname, profilePicture} = fetchedUser
    }

const {userId, userUsername, id, otherUsername} = useParams()
const [fetchedMsg, setFetchedMsg] = useState([])
const [formData, setFormData] = useState({
    userID : '',
    userName : "",
    message : ""
})

const cancelValues = (value)=>{
    setMessageImagePreview('')
    setMessageImagePreviewBox(value)
    setMessageImage('')
}
const [otherUser, setOtherUser] = useState({
    id: "",
    username : ""
})


const setPostData = (value1, value2)=>{
    setAlertMsg({status : value1, msg : value2})
    setMessageImagePreviewBox(false)
    setChatCreated(!chatCreated)
    setMessageImage('')
    setFormData({
        userName : "",
        message : ""
    })
}

    const fetchUsersChat = async(fetchurl)=>{
        
        const result = await axios(fetchurl)

        const fetchedMsg = result.data.allUserMessages 
        const filtredForNull = fetchedMsg.filter(item => item !== null)
        const fetchedMsgSorted = filtredForNull.sort((a,b)=>{
            return new Date(a.createdAt) - new Date(b.createdAt)
        })
        setFetchedMsg(fetchedMsgSorted)
    
    }

    useEffect(()=>{
        const newArrId = []
        const newArrUsername = []
        fetchedMsg.map(msg =>{
            newArrId.push(msg.senderId)
            newArrId.push(msg.receiverId)
            newArrUsername.push(msg.senderUsername)
            newArrUsername.push(msg.receiverUsername)
        const newArrayId2 =  newArrId.filter(item =>{
            return item != userId
        })
        const newArrUsername2 =  newArrUsername.filter(item =>{
            return item != userUsername
        })
        const ID = newArrayId2[0]
        const UserName = newArrUsername2[0]
        setOtherUser({
                id : ID,
                username : UserName
            })
        })
    },[fetchedMsg])
    

    useEffect(()=>{
        fetchUsersChat(`${API}/messages/chat/${userId}/${userUsername}/${id}`)
    },[chatCreated, replySent])
    
    const setFormValue = (e, value1, value2)=>{
        e.preventDefault()
        setFormData({userID : value1, userName : value2,  message : e.target.value})
        
    }

//set Message as read
const messageRead = async(url)=>{    
  const options = {
        url: url,
        method : "PATCH",
        headers : {
            "Accept" : "application/json",
            "Content-Type" : "application/json;charset=UTF-8"
        }
    }

    const result = await Axios(options)
console.log('result', result)
    // const {response, message} = result2.data
    
    // if(response == 'Success' && message){
    //     setUserCoverPicture(message)
    // }else if(response == 'Fail'){
    //    setError({status : true, msg : "Fialed to upload profile image"})
    //    return setTimeout(()=>{
    //         setError({status : false, msg :''})
    // }, 4000)
    // }
}


//set Message as read useEffect
useEffect(()=>{
    messageRead(`${API}/messages/chat/${userId}/${userUsername}/${id}`)
},[])

useEffect(()=>{
    setTimeout(()=>{
        setTestValue(!testValue)
    },3000)
},[])

    //select message pic
const selectMessagePic = (e, value1, value2)=>{
    e.preventDefault()
    setMessageImage(e.target.files[0])
    setFormData({userID : value1, userName : value2})
}


useEffect(()=>{
    if(messageImage){
        const fileReader = new FileReader()
        fileReader.onloadend = ()=>{
            setMessageImagePreview(fileReader.result)
        }
        fileReader.readAsDataURL(messageImage)
        setMessageImagePreviewBox(true)
    
    }else{
        return
    }
},[messageImage])


// const setMessagePicture = (value)=>{
//     setCoverPreviewBox(false)
//     setTestValue(value)
// }


// Enter key to submit
const enterClicked =(e)=>{
    // if(e.charCode === 13){
    //     sendMessage(e)
    //   }
    alert('mes')
}

//SEND MESSAGE
    
const sendMessage = async(e)=>{
    
    e.preventDefault()
    const {_id , username} = currentUserParsed
    // const userData = formData.recipient
    // const recipientId = userData.split(' ')[0]
    // const recipientUsername = userData.split(' ')[1]
    let recipientId = ''
    let recipientUsername = ''
    if(formData.userID && formData.userName){
        const {userID , userName } = formData
        recipientId = userID;
        recipientUsername = userName
    }else if(id && otherUsername){
        recipientId  =  id;
        recipientUsername =  otherUsername
    }
    
    const url = `${API}/messages/${recipientId}/${recipientUsername}`
    
    if(!formData.message && ! messageImage){
        return 
    }
    if(messageImage){      
    const fd = new FormData()
    fd.append("image", messageImage, messageImage.name)
    const {_id , username} = currentUserParsed
    const result = await Axios.post(`${API}/messages/uploadmessageimage/${_id}/${username}`, fd)

    const {src : imgSrc} = result.data.image
    let options = {}
    const {userID : recipientId, userName : recipientUsername} = formData
    
    if(formData.message){
         options = {
            url: url,
            method : "POST",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json;charset=UTF-8"
            },
            data:{
                senderId : userId,
                senderUsername : username,
                receiverId : recipientId,
                receiverUsername : recipientUsername,
                message : formData.message,
                img : imgSrc
            }
        }
    }else{
         options = {
            url: url,
            method : "POST",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json;charset=UTF-8"
            },
            data:{
                senderId : userId,
                senderUsername : username,
                receiverId : recipientId,
                receiverUsername : recipientUsername,
                img : imgSrc
            }
        }
    }
       

         const result2 = await Axios(options)
        const {response, formatedMessage} = result2.data
       
        if(response === 'Success' && formatedMessage){ 
            // const {_doc} = response
            setPostData(true, "Your post has been submited")
            // setPostcreated(!postcreated)
        }else if(response === 'Fail'){
            const {message} = result2.data
            setError({status : true, msg : message})
            setTimeout(()=>{
                setError({status : false, msg :''})
            }, 4000)
        }
    }else{
        if(!formData){
            setError({status : true, msg : "Pleae enter a text to post"})
           return setTimeout(()=>{
                setError({status : false, msg :''})
            }, 4000)
        }
            const options = {
                url: url,
                method : "POST",
                headers : {
                    "Accept" : "application/json",
                    "Content-Type" : "application/json;charset=UTF-8"
                },
                data:{
                    senderId : userId,
                    senderUsername : username,
                    receiverId : recipientId,
                    receiverUsername : recipientUsername,
                    message : formData.message
                }
            }
            
            const result = await Axios(options)
            const {formatedMessage, response} = result.data
           
            if(response === 'Success'){ 
               setTimeout(() => {
                const elmnt = document.getElementById("content");
                elmnt.scrollIntoView();   
               }, 1000);
                setPostData(true, "Your post has been submited")
            }else if(response === 'Fail'){
                const {message} = result.data
                setError({status : true, msg : message})
                setTimeout(()=>{
                    setError({status : false, msg :''})
                }, 4000)
            }
    }
}

//upload message image and return url 

const uploadMessagePicture = async(value)=>{
    const {_id : userId , username} = currentUserParsed
    // const  url =`${msgImgurl}/uploadmessageimage/${userId}/${username}`

    const fd = new FormData()
    fd.append("image", value, value.name)

    const result = await axios.post(`${API}/user/uploadmessageimage/${userId}/${username}`, fd)
    
    const {src : imgSrc} = result.data.image
    
  const options = {
        url: `${API}/user/createimage/${userId}/${username}`,
        method : "PATCH",
        headers : {
            "Accept" : "application/json",
            "Content-Type" : "application/json;charset=UTF-8"
        },
        data : {
            userId : userId,
            username : username,
            coverPicture : imgSrc
        }
    }

    const result2 = await Axios(options)

    const {response, message} = result2.data
    
    if(response == 'Success' && message){
        setMessageImgePicture(message)
    }else if(response == 'Fail'){
       setError({status : true, msg : "Fialed to upload profile image"})
       return setTimeout(()=>{
            setError({status : false, msg :''})
    }, 4000)
    }
}

const setMessageImgePicture = (value)=>{
    setMessageImagePreviewBox(false)
    setTestValue(value)
}

useEffect(()=>{
    window.addEventListener('load', (event) => {
        setTimeout(() => {
            const elmnt = document.getElementById("content");
            elmnt.scrollIntoView();   
        }, 1000);
      });
}, [])


//scroll into view
useEffect(()=>{     
    window.addEventListener('load', (event) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
    const scrollIntoViewFunc = ()=>{
        setTimeout(() => {
            const elmnt = document.getElementById("content");
            elmnt.scrollIntoView();   
        }, 1000);
    }
    scrollIntoViewFunc()
});
},[scrollIntoViewValue])

//scroll to top of page
useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  const fetchUser = async(fetchurl)=>{
    const result = await axios(fetchurl)
    const fetchedUserVal = result.data.data 
    
    setFetchedUser(fetchedUserVal)

}

//fetch other chat user useEffect
  useEffect(()=>{
    fetchUser(`${API}/user/${id}/${otherUsername}`)
},[chatUserId, chatUserUsername, testValue])


if(loggedIn == "false" || !loggedIn){
    return <Navigate to='/login' />
}

if(loading || !fetchedUser || !currentUserParsed._id){
    return <Loader />
}

if(otherUsername){
    chatUsername = otherUsername.slice(0,1).toUpperCase().concat(otherUsername.slice(1).toLowerCase())
}

// const {_id : idCurrent , username : usernameCurrent, messageNotifications} = currentUserParsed

    return <div className='chat-main'>
        <Topbar />
        <Sidebar />
        <Backdrop />
        <Grid container className="chat" >
            <Grid item xs={false} sm={3} className='chat-mobile-disabled'>
                <LeftNavigation />
            </Grid>
            <Grid item xs={12} sm={6} className="chats-container" >
                <div className = 'chat-top'>
                <Link to={`/userprofile/${chatUserId}/${chatUserUsername}`} className = 'chat-top-inner'>
                    <img src={profilePicture ? profilePicture : ProfileImage}  className='chat-profile-pic'/>
                    <div> {firstname && lastname && `${firstname} ${lastname}`}</div>
                </Link>
                </div>
                <div className='observer-container'>
                {
                    fetchedMsg.map(message =>{   
                        const {_id} = message             
                    return  <SinglgeMessage key={_id} {...message} otherUser={otherUser} />
                    })
                }
                <div id='content'></div>
            </div>
            <div className='sendingBox'>
            <textarea value={formData.message} type='text' onChange={(e)=>setFormValue(e,otherUser.id, otherUser.username)} placeholder='Your message' variant = 'contained'
                name='message' className='chatinput' ></textarea><br />
                <form className="message-img-label-box" enctype="multipart/form-data">
                    {idCurrent == userId && usernameCurrent == userUsername && <label htmlFor='messagePicture'  >
                        {/* <div style={{ position: "absolute", top:"0rem", right:"0rem", width:"2rem", background:"green", padding:"0.0.4rem"}}>  */}
                            <FaImages  className='msg-img-upload-icon' size='23' /> 
                        {/* </div> */}
                    {!messageImage && <input id='messagePicture' type='file' name='messagePic' className='homepage-center-input2' 
                    onChange={(e)=>selectMessagePic(e, otherUser.id, otherUser.username)}/>}
                    </label>}
                    
                <div className='submit-icon-box' onClick={sendMessage} onKeyPress={enterClicked}>
                    <FaTelegramPlane className='submit-icon' size='23'/>
                </div>
                </form>
            </div>
            </Grid>
         <Grid item xs={false} sm={3} className="chat-right chat-mobile-disabled" >
            <Ads /> 
        </Grid>
        {messageImagePreviewBox && 
         <Grid item xs={12} className='preview-container'>
                <div className='chat-message-img-preview-box'>
                    {/* <div> */}
                        <div className='chat-message-img-container'>
                            <img src={messageImagePreview} alt='Error loading preview' className='chat-message-img-preview'/>
                        </div>
                        <div className='pic-upload-btn'>
                            <div className='homepage-center-input-item-2' onClick={()=>cancelValues(false)}>
                                <FaWindowClose  className='homepage-center-input-icon-close' size='25' />
                                <span className='picture-name'>
                                    Cancel
                                </span>
                            </div>
                            <div className='homepage-center-input-item-2'onClick={sendMessage} >
                            <FaTelegramPlane  className='homepage-center-input-icon' size='25' />
                                <span className='picture-name'>
                                    Send Picture
                                </span>
                            </div>
                        </div>
                    {/* </div> */}
                </div>
                </Grid>
            }
    </Grid>
    </div>
}

export default Chat