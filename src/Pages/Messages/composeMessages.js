import './messages.css'
import { useRef } from 'react'
import { Button, Grid } from "@material-ui/core"
import { UseAppContext } from "../../Contexts/app-context"
import { Topbar, Sidebar, Backdrop } from "../../Components"
import { useState, useEffect } from 'react'
import Axios from 'axios'
import API from '../../Utils/api'
import { FaImages, FaTelegramPlane, FaWindowClose } from 'react-icons/fa'
import { LeftNavigation } from '../../Components'
import { Link, Navigate } from 'react-router-dom';
import LoadingIcons from 'react-loading-icons'
import { Loader } from '../../Components'
import ProfileImage from '../../assets/profile.jpg'
import { Ads } from '../../Components'

const ComposeMessages = () =>{
const {loading, loggedIn, currentUserParsed, allUsers, setPostCreated, setTestValue} = UseAppContext()
const [error, setError] = useState({status : false, msg:''})
const [alertMsg, setAlertMsg] = useState({status : false, msg : ''})
const [postPicturePreview, setPostPicturePreview] = useState('')
const [postImage, setPostImage] = useState('')
const [postPreviewBox, setPostPreviewBox] = useState(false)
const [chatCreated, setChatCreated] = useState(false)
const [messageImage, setMessageImage] = useState('')
const [messageImagePreviewBox, setMessageImagePreviewBox] = useState(false)
const [searchValue, setSearchValue] = useState('')
const [usersNameValue, setUsersNameValue] = useState('')
const [chatUserName, setChatUserName] = useState('')
const [usersFoundAndSorted, setUsersFoundAndSorted] = useState([])
const [unconnectedUsers, setUnconnectedUsers] = useState([])
const [usersList, setUsersList] = useState(false)
const {_id, username, connections, profilePicture} = currentUserParsed
const newRef = useRef()
const [formData, setFormData] = useState({
    recipient : "",
    message1 : "",
    message2 : ""
})

const setCancelValues = (value)=>{
    setPostPreviewBox(value)
    setPostImage('')
}

const setPostData = (value1, value2)=>{
    setAlertMsg({status : value1, msg : value2})
    setPostPreviewBox(false)
    setChatCreated(!chatCreated)
    setFormData({
        recipient : "",
        message1 : "",
        message2 : ""
    })
}

//set both search value and value to show in input
const setSearchValueFunc = (e)=>{
    setSearchValue(e.target.value.toLowerCase())
    setUsersNameValue(e.target.value.toLowerCase())
}

const setFormValue = (e)=>{
    let name = e.target.name
    let value = e.target.value
    setFormData(prev =>{
        return {...prev, [name]: value}
    })
}

//set search value to the users name when selected
//set users name as empty when selected
const setButtonValue = (value1, value2, value3, value4)=>{
    setUsersList(false)
    const recipientValue = `${value1} ${value2}`
    const chatUserNameFormated = `${value3} ${value4}`
    setFormData({...formData, recipient : recipientValue})
    setSearchValue(chatUserNameFormated)
    setUsersNameValue('')    
}


useEffect(()=>{
    setUsersList(true)
    if(searchValue.length < 1 || !usersFoundAndSorted){
        setUsersList(false)
    }
},[searchValue])


// console.log('sadfd', usersFound )


const selectPostPic = (e)=>{
    e.preventDefault()
    setPostImage(e.target.files[0])
}


useEffect(()=>{
    if(postImage){
        const fileReader = new FileReader()
        fileReader.onloadend = ()=>{
            setPostPicturePreview(fileReader.result)
        }
        fileReader.readAsDataURL(postImage)
        setPostPreviewBox(true)
    }else{
        return
    }
},[postImage])

// Enter key to submit
 const enterClicked =(e)=>{
    if(e.charCode === 13){
        sendMessage(e)
      }
}

//SEND MESSAGE

const sendMessage = async(e)=>{
    
    e.preventDefault()
    const {_id , username} = currentUserParsed
    const userData = formData.recipient
    const recipientId = userData.split(' ')[0]
    const recipientUsername = userData.split(' ')[1]
    if(!formData.recipient && (!formData.message1 || !formData.message2)){
        return setError({status : true, msg:'Please select a recipient and enter your message'})
    }
    
    const url = `${API}/messages/${recipientId}/${recipientUsername}`

    if(postImage){        
    const fd = new FormData()
    fd.append("image", postImage, postImage.name)

    const result = await Axios.post(`${API}/messages/uploadmessageimage/${_id}/${username}`, fd)

    const {src : imgSrc} = result.data.image
        const message = formData.message2
        const options = {
            url: url,
            method : "POST",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json;charset=UTF-8"
            },
            data:{
                senderId : _id,
                senderUsername : username,
                receiverId : recipientId,
                receiverUsername : recipientUsername,
                message : message,
                img : imgSrc
            }
        }

        const result2 = await Axios(options)
        
        const {response, formatedMessage} = result2.data
 
        if(response === 'Success' && formatedMessage){ 
            setPostData(true, "Your post has been submited")
             window.location.href = `/chat/${_id}/${username}/${recipientId}/${recipientUsername}`
            
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
        const message = formData.message1
            const options = {
                url: url,
                method : "POST",
                headers : {
                    "Accept" : "application/json",
                    "Content-Type" : "application/json;charset=UTF-8"
                },
                data:{
                    senderId : _id,
                    senderUsername : username,
                    receiverId : recipientId,
                    receiverUsername : recipientUsername,
                    message : message
                }
            }
            
            const result = await Axios(options)
            
            const {formatedMessage, response} = result.data
           
            if(response === 'Success'){ 
                setFormData({
                    recipient : "",
                    message : ""
                })
                setPostData(true, "Your post has been submited")
                
                window.location.href = `/chat/${_id}/${username}/${recipientId}/${recipientUsername}`
            }else if(response === 'Fail'){
                const {message} = result.data
                setError({status : true, msg : message})
                setTimeout(()=>{
                    setError({status : false, msg :''})
                }, 4000)
            }
    }
}

const uploadMessagePicture = async(value)=>{
    const {_id : userId , username, firstname, lastname} = currentUserParsed
    // const  url =`${msgImgurl}/uploadmessageimage/${userId}/${username}`

    const fd = new FormData()
    fd.append("image", value, value.name)

    const result = await Axios.post(`${API}/user/uploadmessageimage/${userId}/${username}`, fd)
    
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

//scroll to top of page
useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(()=>{
    const usersFoundValues  =   allUsers.length > 1 && 
    allUsers.filter(allUser => allUser._id !== _id && (allUser.firstname.toLowerCase().startsWith(searchValue) 
    || allUser.lastname.toLowerCase().startsWith(searchValue) || allUser.username.toLowerCase().startsWith(searchValue)))
    
if(usersFoundValues){
    // setUsersFound(usersFoundValues)
    const sortedConnectedUsers = usersFoundValues.filter(user =>{
        return currentUserParsed.connections.includes(user._id) 
    })
    const sortedUconnectedUsers = usersFoundValues.filter(user =>{
        return !currentUserParsed.connections.includes(user._id) 
    })
    const allSortedUsers = sortedConnectedUsers.concat(sortedUconnectedUsers)
    setUsersFoundAndSorted(allSortedUsers)
    setUnconnectedUsers(sortedUconnectedUsers)
}
},[searchValue])

if(loggedIn == "false" || !loggedIn){
    return <Navigate to='/login' />
}

if(loading || allUsers.length == 0 || !currentUserParsed._id){
    return <Loader />
}


const {_id : userId , firstname, lastname} = currentUserParsed



    return <div>
        <Topbar />
        <Sidebar />
        <Backdrop />
        <Grid container className='compose'>
            {postPreviewBox && 
                <div className='message-img-preview-box'>
                        <div className='message-img-container'>
                            <img src={postPicturePreview} alt='Error loading preview' className='message-img-preview-2'/>
                        </div>
                        <div className='preview-bottom'>
                            <img src={profilePicture ? profilePicture : ProfileImage} className="message-profile-img-2" />
                            <textarea type='text' onChange={setFormValue} placeholder='Your message' variant = 'contained'
                            cols='20' rows='3' name='message2' className='forminput' value={formData.message}></textarea>
                    </div>
                       
                        <div className='pic-upload-btn'>
                            <div className='homepage-center-input-item-2'  onClick={()=>setCancelValues(false)}>
                            <FaWindowClose  className='homepage-center-input-icon-close' size='25' />
                            <span className='picture-name'>
                                Cancel
                            </span>
                            </div>
                            <div className='homepage-center-input-item-2'onClick={sendMessage} >
                            <FaTelegramPlane  className='homepage-center-input-icon' size='25' />
                            <span className='picture-name'>
                                Post
                            </span>
                            </div>
                        </div>
                   
                </div>
                }
            <Grid item xs={false} sm={3} md={3} className='compose-mobile-disabled'>
                <LeftNavigation />
            </Grid>
            <Grid item xs={12} sm={6} md={6} className="compose-center">
            <div className='compose-center-inner'>
            <h2>Compose Message</h2>
            
            <form className="compose-center-form">
                <input type='hidden'  value={username} name='from' className='forminput' /><br />
                {connections && connections.length > 0 && <div className='name'> <span>From: </span> {firstname && lastname && `${firstname} ${lastname}`}<br /></div> }
                {connections && connections.length > 0 && <div className='name'><span>To: </span> 
                <input type='text' value={searchValue} onChange={setSearchValueFunc} className='users-search'/>
                {usersNameValue && <div className='users-list'>
                    <h4 className='search-title'>{unconnectedUsers.length > 0 && "You can only send a message to your connections"}</h4 >
                    <h4 className='search-title-2'>{usersFoundAndSorted.length == 0 && "No users match your search"}</h4 >
                {                    
                    usersFoundAndSorted && usersFoundAndSorted.slice(0, 20).map(user =>{
                        const {_id, username, firstname, lastname, profilePicture} = user
                        return <Button onClick={()=>setButtonValue(_id, username,firstname, lastname)} 
                        key = {_id} disabled =  {currentUserParsed.connections && !currentUserParsed.connections.includes(_id)} >
                        <img src={profilePicture ? profilePicture : ProfileImage}  className='search-img'/>
                            <div className= {currentUserParsed.connections && currentUserParsed.connections.includes(_id) ? `search-name` : `search-name-disable`}>
                                {firstname && lastname && `${firstname} ${lastname}`}</div>
                        </Button>
                    })
                }
                </div>}


                </div>}
                <br />
                {connections && connections.length < 1 && <div className='no-connection'>No connections yet. 
                <Link to={`/connections/${userId}/${username}`} className='connect-link'>Connect</Link> with users to send messages.</div>}
                {connections && connections.length > 0 && <> 
                <textarea type='text' onChange={setFormValue} onKeyPress={enterClicked}  placeholder='Your message' variant = 'contained'
                cols='20' rows='5' name='message1' className='forminput' value={formData.message}></textarea><br 
                style={{background:"var(--background-color-2)"}}/>
                </>}
                
                {connections && connections.length > 0 && <Button  className='formbutton' onClick={formData.recipient && sendMessage}>
                    <FaTelegramPlane  className= {formData.recipient ? `message-input-icon-picture`:  `message-input-icon-pictur-2` } size='25'/>Send</Button>}
            </form>
            </div>
            {connections && connections.length > 0 && <> <div className='compose-center-top-inner2'>
                 <label htmlFor='postPicture'>
                        <div className="homepage-center-input-item">
                            <FaImages className={formData.recipient ? `homepage-center-input-icon` :`homepage-center-input-icon-2`} size='25'/> Picture
                       </div>
                    { !postImage && <input id='postPicture' type={formData.recipient ? `file` : null} name='postPic' className='compose-center-input2' 
                        onChange={selectPostPic}/>}
                    </label>
                </div>  </>}
            </Grid>
            <Grid item xs={false} sm={3} md={3} className="compose-right compose-mobile-disabled">
                <Ads />
            </Grid>
        </Grid>
    </div>
}


export default ComposeMessages