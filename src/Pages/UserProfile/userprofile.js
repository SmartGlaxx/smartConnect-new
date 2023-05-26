import React, { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import './userprofile.css'
import axios from 'axios'
import API from '../../Utils/api'
import { Grid } from '@material-ui/core'
import { FaUserAlt, FaUsers, FaImages, FaExclamationCircle, FaHome, FaUser, FaCamera,
    FaTelegramPlane, FaEllipsisH, FaWindowClose, FaChevronCircleDown } from 'react-icons/fa'
import {Topbar, Sidebar, Backdrop, Posts} from '../../Components';
import { UseAppContext } from '../../Contexts/app-context'
import {Link, useNavigate} from 'react-router-dom'
import {Redirect} from 'react-router-dom'
import Axios from 'axios'
import OtherUsers from '../../Components/OtherUsers/otherUsers'
import LoadingIcons from 'react-loading-icons'
import { Loader } from '../../Components'
import ProfileImage from '../../assets/profile.jpg'
import CoverImage from '../../assets/coverpic.jpg'
import Button from '@restart/ui/esm/Button'
import Profile from "../../assets/profile.jfif"
import { Timeline, Update } from '@material-ui/icons'
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';


const UserProfile =()=>{
const {setLoggedIn, loggedIn, setLoading, loading, setLazyLoading, lazyLoading, currentUser, currentUserParsed, allUsers, 
    postcreated, setPostCreated, tempAllUsers, setNewCurrentUser, setUserClicked, userClicked, setFetchedUser, 
    fetchedUser, setTestValue, testValue} = UseAppContext()
const [formValue, setFormValue] = useState('')
const [error, setError] = useState({status : false, msg:''})
// const [alert, setAlert] = useState({status : false, msg:''})
const {_id : userId, username : userUsername, firstname, lastname, followings, followers, 
    profilePicture : userProfilePicture, coverPicture : userCoverPicture, email, phone, 
    aboutMe, country, state, city, employment} = fetchedUser

const [alertMsg, setAlertMsg] = useState({status : false, msg : ''})
const [successMsg, setSuccessMsg] = useState({status : false, msg : ''})
const followurl = `${API}/user/follow`
const unFollowurl = `${API}/user/unfollow`
const getUserurl = `${API}/user/${userId}/${userUsername}`
const posturl = `${API}/posts`
// const [userClicked, setUserClicked] = useState(false)
const [newPage, setNewPage] = useState(false)
// const [timelineposts, setTimelinePosts] = useState([])
const [profilePicture, setProfilePicture] = useState('')
const [timelineposts, setTimelinePosts] = useState([])
const [coverImage, setCoverImage] = useState('')
const [profileImage, setProfileImage] = useState('')
const [postImage, setPostImage] = useState('')
const [coverPicturePreview, setCoverPicturePreview] = useState('')
const [profilePicturePreview, setProfilePicturePreview] = useState('')
const [postPicturePreview, setPostPicturePreview] = useState('')
// const [profilereviewBox, setProfilereviewBox] = useState(false)
const [coverPreviewBox, setCoverPreviewBox] = useState(false)
const [profilePreviewBox, setProfilePreviewBox] = useState(false)
const [postPreviewBox, setPostPreviewBox] = useState(false)
const [userEditBox, setUserEditBox] = useState(false)
const [deleteBox, setDeleteBox] = useState(false)
const [showPasswordBox, setShowPasswordBox] = useState(false)
const [deleteValue, setDeleteValue] = useState("")
const [editUserValues, setEditUserValues] = useState({
    firstname : "",
    lastname : "",
    username : "",
    email : "",
    oldpassword : "",
    newpassword : "",
    comfirmpassword : "",
    phone : "",
    aboutme : "",
    country : "",
    state : "",
    city : "",
    employment : ""    
})

// const [imageValue, setProfilePicture] = useState('')

//pagination constants
let [page, setPage] = useState(0)
let [incrementor, setIncrementor] = useState(1)
const [timeline, setTimeline] = useState([])
const [arrayofArrayList, setArrayofArrayList] = useState([])


const setValues = (e)=>{
    setFormValue(e.target.value)
}

const setUserCoverPicture = (value)=>{
    setCoverPreviewBox(false)
    setTestValue(value)
    setCoverImage('')
}

const setUserProfilePicture = (value)=>{
    setProfilePreviewBox(false)
    setTestValue(value)
    setProfileImage('')
}

//Alert function

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  
  const useStyles = makeStyles((theme) => ({
    root: {
      width: '20rem',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
      position:"absolute",
      top:"30%",
      left : "50%",
      transform : "translate(-50%)"
    },
    typography: {
      padding: theme.spacing(2),
    },
  }));
  

//Popover starts 

// const useStyles = makeStyles((theme) => ({
    // typography: {
    //     padding: theme.spacing(2),
    //   },
//   }));
  

const classes = useStyles();
const [anchorEl, setAnchorEl] = React.useState(null);

const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
};

const handleClose = () => {
    setAnchorEl(null);
};

const open = Boolean(anchorEl);
const popOverId = open ? 'simple-popover' : undefined;

    //Popover ends

//close edit user  
const closeEditBox = ()=>{
    setUserEditBox(false)
}

//edit user 
const openEditBox=()=>{
    setDeleteBox(false)
    setUserEditBox(true)
}

//close delete box
const closeDeleteBox=()=>{
    setDeleteBox(false)
}
//open delete account comfirmation
const openDeleteBox=()=>{
    setUserEditBox(false)
    setDeleteBox(true)
}

const showPasswordBoxFunc =()=>{
    setShowPasswordBox(!showPasswordBox)
}

const setEditValues =(e)=>{
    const name = e.target.name;
    const value = e.target.value;

    setEditUserValues(prev =>{
        return {...prev, [name]: value}
    })
}

//fill edit user input values on page load
useEffect(()=>{
    setEditUserValues({
        firstname : currentUserParsed.firstname,
        lastname : currentUserParsed.lastname,
        username : currentUserParsed.username,
        email : currentUserParsed.email,
        oldpassword : "",
        newpassword : "",
        comfirmpassword : "",
        phone : currentUserParsed.phone,
        aboutme : currentUserParsed.aboutMe,
        country : currentUserParsed.country,
        state : currentUserParsed.state,
        city : currentUserParsed.city,
        employment : currentUserParsed.employment 
    })
},[currentUserParsed])

const setResponseData =()=>{
    closeEditBox()
    setSuccessMsg({status : true, msg : "Profile updated"})
    return setTimeout(()=>{
        setSuccessMsg({status : false, msg : ""})
    },5000)
}


//delete user function
const deleteUser = async(e)=>{
    console.log("result")
    e.preventDefault()
        const {_id : id, username} = currentUserParsed 

        if(!deleteValue ){
            setError({status : true, msg : "Please enter your username" })
            return setTimeout(()=>{
                setError({status : false, msg : "" })
            },5000)
            return
        }
        if(deleteValue.toLowerCase() !== username.toLowerCase()){
            setError({status : true, msg : "Incorrect username. Please try again" })
            return setTimeout(()=>{
                setError({status : false, msg : "" })
            },5000)
            return
        }
        const options ={
            url : `${API}/user/delete/${id}/${username}`,
            method : "DELETE",
            headers : {
                "Accept" : "Application/json",
                "Content-Type" : "Application/json;charset=utf-8"
            },
            data :{
                userId : id,
                username : username
            }
        }
        const result = await axios(options)
        const {response} = result.data 
        if(response == 'Success'){
            setLoggedIn(false)
            window.location.href = '/signup'
        }else{
            const {response, message} = result.data
            setError({status : true, msg : message })
            return setTimeout(()=>{
                setError({status : false, msg : "" })
            },5000)
        }
}

//update user fundtion
const updateUser = async(e)=>{
    e.preventDefault()
    const {firstname, lastname, oldpassword, newpassword, comfirmpassword,
        phone, aboutme, country, state, city, employment} = editUserValues
        const {_id, username, email} = currentUserParsed

        
        if(newpassword.length && comfirmpassword.length){
            
            if(!firstname || !lastname || !oldpassword || !newpassword || !comfirmpassword || !phone || !aboutme || !country || !state || !city || !employment){
                setAlertMsg({status : true, msg : "Please provide all required fields"})
                return setTimeout(()=>{
                    setAlertMsg({status : false, msg : ""})
                },5000)

            }
            if(newpassword != comfirmpassword){
                setAlertMsg({status : true, msg : "Password comfirmation mismatch"})
                return setTimeout(()=>{
                    setAlertMsg({status : false, msg : ""})
                },5000)
            }
                const options ={
                    url : `${API}/user/update/${_id}/${username}`,
                    method : "PATCH",
                    headers : {
                       "Accept" : "Application/json",
                       "Content-Type" : "Application/json;charset=utf-8"
                    },
                    data :{
                        userId : _id,
                        firstname : firstname,
                        lastname : lastname,
                        username : username,
                        email : email,
                        password : oldpassword,
                        newpassword : newpassword,
                        phone : phone,
                        aboutMe : aboutme,
                        country : country,
                        state : state,
                        city : city,
                        employment : employment,
                    }
                }
                const result = await axios(options)
                const {response} = result.data 
                console.log(response)
                if(response == 'Success'){
                    setResponseData(true, "Profile updated")
                }else{
                    const {response, message} = result.data
                    setError({status : true, msg : message })
                    return setTimeout(()=>{
                        setError({status : false, msg : "" })
                    },5000)
                } 
        }else{
            if(!firstname || !lastname || !phone || !aboutme || !country || !state || !city || !employment){
                setAlertMsg({status : true, msg : "Please provide all required fields"})
                return setTimeout(()=>{
                    setAlertMsg({status : false, msg : ""})
                },5000)
            }
                const options ={
                url : `${API}/user/update/${_id}/${username}`,
                method : "PATCH",
                headers : {
                   "Accept" : "Application/json",
                   "Content-Type" : "Application/json;charset=utf-8"
                },
                data :{
                    userId : _id,
                    firstname : firstname,
                    lastname : lastname,
                    username : username,
                    email : email,
                    phone : phone,
                    aboutMe : aboutme,
                    country : country,
                    state : state,
                    city : city,
                    employment : employment,
                }
            }
            const result = await axios(options)
            const {response} = result.data
            console.log(response)
            if(response == 'Success'){
                setResponseData(true, "Profile updated")
            }else{
                setError({status : true, msg : "Failed to update post"})
                return setTimeout(()=>{
                    setError({status : false, msg : ""})
                },5000)
            }        
        }
}


//upload cover image and return url 

const uploadCoverPicture = async(value)=>{
    const  url =`${posturl}/uploadprofileimage/${userId}/${username}`

    const fd = new FormData()
    fd.append("image", value, value.name)

    const result = await axios.post(`${API}/user/uploadcoverimage/${userId}/${username}`, fd)
    
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
        setUserCoverPicture(message)
    }else if(response == 'Fail'){
       setError({status : true, msg : "Fialed to upload profile image"})
       return setTimeout(()=>{
            setError({status : false, msg :''})
    }, 4000)
    }
}

//upload profile image and return url 
const uploadProfilePicture = async(value)=>{
    const  url =`${posturl}/uploadprofileimage/${userId}/${username}`

    const fd = new FormData()
    fd.append("image", value, value.name)

    const result = await axios.post(`${API}/user/uploadprofileimage/${userId}/${username}`, fd)

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
            profilePicture : imgSrc
        }
    }

    
    const result2 = await Axios(options)

    const {response, message} = result2.data
    
    if(response == 'Success' && message){
        setUserProfilePicture(message)
    }else if(response == 'Fail'){
       setError({status : true, msg : "Fialed to upload profile image"})
       return setTimeout(()=>{
            setError({status : false, msg :''})
    }, 4000)
    }
}


//select cover pic
const selectCoverPic = (e)=>{
    e.preventDefault()
    setCoverImage(e.target.files[0])
}

//select profile picture
const selectProfilePic = (e)=>{
    e.preventDefault()
    setProfileImage(e.target.files[0])
}

//select post pic
const selectPostPic = (e)=>{
    e.preventDefault()
    setPostImage(e.target.files[0])
}

useEffect(()=>{
    if(coverImage){
        const fileReader = new FileReader()
        fileReader.onloadend = ()=>{
            setCoverPicturePreview(fileReader.result)
        }
        fileReader.readAsDataURL(coverImage)
        setCoverPreviewBox(true)
        setProfilePreviewBox(false)
        setPostPreviewBox(false)
    }else{
        return
    }
},[coverImage])

useEffect(()=>{
    if(profileImage){
        const fileReader = new FileReader()
        fileReader.onloadend = ()=>{
            setProfilePicturePreview(fileReader.result)
        }
        fileReader.readAsDataURL(profileImage)
        setProfilePreviewBox(true)
        setCoverPreviewBox(false)
        setPostPreviewBox(false)
    }else{
        return
    }
},[profileImage])


useEffect(()=>{
    if(postImage){
        const fileReader = new FileReader()
        fileReader.onloadend = ()=>{
            setPostPicturePreview(fileReader.result)
        }
        fileReader.readAsDataURL(postImage)
        setPostPreviewBox(true)
        setCoverPreviewBox(false)
        setProfilePreviewBox(false)
    }else{
        return
    }
},[postImage])




// if(followings == undefined){
//     followings = currentUser.followings    
// }



const {id, username} = useParams()

const fetchUser = async(fetchurl)=>{
    setLoading(true)
    const result = await axios(fetchurl)
    const fetchedUserVal = result.data.data 
    
    setFetchedUser(fetchedUserVal)
    setLoading(false)
}

useEffect(()=>{
    fetchUser(`${API}/user/${id}/${username}`)
},[postcreated, id, username, testValue])


// let lastUrl = window.location.href; 
// new MutationObserver(() => {
//   const url = window.location.href;
//   if (url !== lastUrl) {
//     lastUrl = url;
//     onUrlChange();
//   }
// }).observe(document, {subtree: true, childList: true});


function onUrlChange() {
  setNewPage(true)
  setTimeout(()=>{
    setNewPage(false)
  },1000)
}



///forget these

    // if(userId != id && username != userUsername){ 
    //     fetchUser(`${API}/user/${id}/${username}`)
    // }


    const fetchTimelinePosts = async(url)=>{
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

        const {response, allPosts} = result.data
        if(response == 'Success' && allPosts){
            
           const newTimelinePosts = allPosts.sort((a,b)=>{
               return new Date(b.createdAt) - new Date(a.createdAt)
           })
           setTimelinePosts(newTimelinePosts)
        }else if(response == 'Fail'){
           setError({status : true, msg : "Fialed to fetch timeline posts"})
           return setTimeout(()=>{
                setError({status : false, msg :''})
        }, 4000)
        }
        
    }

useEffect(()=>{
    fetchTimelinePosts(`${posturl}/${id}/${username}/timeline`)

},[id, username, userClicked, postcreated])



const setPostData = (value1, value2)=>{
    setAlertMsg({status : value1, msg : value2})
    setPostPreviewBox(false)
    setPostCreated(true)
    setFormValue('')
    setPostImage('')
    setTimeout(()=>{
        setPostCreated(false)
    }, 3000)
}

const setPostCancelValues = ()=>{
    setPostPreviewBox(false)
    setFormValue('')
    setPostImage('')
}

const setCoverCancelValues = (value) =>{
    setCoverPreviewBox(value)
    setCoverImage('')
}

const setProfileCancelValues = (value) =>{
    setProfilePreviewBox(value)
    setProfileImage("")
}

const setDataValues = (value, data)=>{
    setNewCurrentUser(data)
    setLoading(value)
}
let newUserFollowings  = []
if(currentUserParsed){
     newUserFollowings = currentUserParsed.followings
}

let newUserFollowers  = []
if(currentUserParsed){
    newUserFollowers = currentUserParsed.followers
}

//FOLLOW USER
const follow =async(e, id, followedUsername)=>{
    e.preventDefault()
    const {_id , username} = JSON.parse(currentUser)
   
        const options = {
            url: `${followurl}/${id}/${followedUsername}`,
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
                // window.location.href='/' 
                // setValues(true, data)

                setTestValue(!testValue)
                setPostCreated(true)
                setTimeout(()=>{
                    setPostCreated(false)
                }, 3000)
            } 
        }else{
            setAlertMsg({status : true, msg : 'An error occured while following'})  
        }       
        
    // }

}



//UNFOLLOW USER
const unfollow =async(e, id, followedUsername)=>{
    e.preventDefault()
    const {_id , username} = currentUserParsed
   
        const options = {
            url: `${unFollowurl}/${id}/${followedUsername}`,
            method : "PATCH",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json;charset=UTF-8"
            },
            data:{
                userId : _id,
                userUsername : username                
            }
        } 
       
        const result = await axios(options)
        console.log(result)
        if(result.data.response == "Success"){
            const reponse_2 = await axios(getUserurl)
            const {data} = reponse_2.data
            if(data){
                setTestValue(!testValue)
                setPostCreated(true)
                setTimeout(()=>{
                    setPostCreated(false)
                }, 3000)
            } 
        }else{
            setAlertMsg({status : true, msg : 'An error occured while following'})  
        }       
        
    // }

}


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


const submit = async(e)=>{
    e.preventDefault()
    const {_id , username} = currentUserParsed
    const url = `${API}/posts`
    if(postImage){    
  
    const fd = new FormData()
    fd.append("image", postImage, postImage.name)

    const result = await axios.post(`${API}/posts/uploadimage/${userId}/${username}`, fd)

    const {src : imgSrc} = result.data.image
        
        const options = {
            url: url,
            method : "POST",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json;charset=UTF-8"
            },
            data:{
                userId : _id,
                username : username,
                firstname : firstname,
                lastname : lastname,
                description : formValue,
                img : imgSrc
            }
        }

        const result2 = await Axios(options)
        console.log("data now 2",result2)
        const {response, newPost} = result2.data
   
        if(response === 'Success' && newPost){ 
            setPostData(true, "Your post has been submited")
            // setPostcreated(!postcreated)
        }else if(response === 'Fail'){
            
            // setError({status : true, msg : message})
            setTimeout(()=>{
                setError({status : false, msg :''})
            }, 4000)
        }
    }else{
        if(!formValue){
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
                    userId : _id,
                    username : username,
                    firstname : firstname,
                    lastname : lastname,
                    description : formValue
                    
                }
            }
    
            const result = await Axios(options)
    
            const {data, response} = result.data
        //    console.log("data now",result)
            if(response === 'Success'){ 
                setPostData(true, "Your post has been submited")
                
                // return window.location.href = '/'
            }else if(response === 'Fail'){
                const {message} = result.data
                setError({status : true, msg : message})
                setTimeout(()=>{
                    setError({status : false, msg :''})
                }, 4000)
            }
    }
}


//Pagination
//create pagination to break timelineposts which
//would be a huge array into smaller bits of 
//arrays containing arrays. That way, when you
//access an array, it'll show a specific number
//of items n a page(You choose 10 items oer page)

const paginate = (value)=>{

    const itemsPerPage = 4
    const numberOfPages = Math.ceil(value.length / itemsPerPage)


    const newArray = Array.from({length : numberOfPages},(_, index)=>{
        const startNum = index * itemsPerPage
        const endNum = itemsPerPage * incrementor
        return value.slice(startNum, endNum)

    })
    return newArray

}
//call the paginate to use/ break-up the timelineposts
//-paginate breaks the long array (timelineposts) down using the code above
//-it creats an array of arrays called arrayOfArrays
//-items in each page can now be accessed in the arrayOfArrays 
//by using an index (called page) which can be altered using a button to change 
//its default index from 0 to anu number  
//the page should display new items when the page number is changed

useEffect(()=>{
    const arrayOfArrays = paginate(timelineposts)
    setTimeline(arrayOfArrays[page])
    setArrayofArrayList(arrayOfArrays)
},[timelineposts, incrementor])

//set an incrementor to increase everytime the documents total height
//plus 50 is equal to the scrollY - scrolled vertical distance plus
//the windows inner height or display height. Now use the incremented
//value as the endpoint for the new set of documents in arrayOfArrays.
//so the page remains on 0, while the start point remians on 1st array of 
//page 0, and the endpoint extends with increase in the incrementor
useEffect(()=>{
    const fetchItems = ()=>{
        if(window.scrollY + window.innerHeight >= document.body.scrollHeight - 2){
            setLazyLoading(true)
            setTimeout(()=>{
                setIncrementor(incrementor++)
                setLazyLoading(false)
            },3000)
            
        }
    }
    const event = window.addEventListener('scroll', fetchItems)
    return ()=> window.removeEventListener('scroll', event)
},[])

//scroll to top of page
useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
 
if(loggedIn == "false" || !loggedIn){
    return <Navigate to='/login' />
}


if(loading || allUsers.length == 0 || !username && !timelineposts || !fetchedUser.followings || !currentUserParsed._id){
    return <Loader />
}



const {_id : idCurrent , username : usernameCurrent} = currentUserParsed

const firstLetter = username[0]
const otherLettes = username.slice(1)
const usernameCapitalized = firstLetter.toUpperCase() + otherLettes
    return <>
    <Topbar />
    <Sidebar />
    <Backdrop />
    <Grid className='profile' container > 
        <Grid className='profile-left-border' item xs={false} sm={1} ></Grid> 
        {
            alertMsg.status &&  <div className='alert-box'>
            <Alert severity="error">{alertMsg.msg}</Alert>
          </div>
        }
        {
            successMsg.status &&  <div className='alert-box'>
            <Alert severity="success">{successMsg.msg}</Alert>
          </div>
        }
        {
            error.status &&  <div className='alert-box'>
            <Alert severity="error">{error.msg}</Alert>
          </div>
        }
        {userEditBox && currentUserParsed &&<div className='editprofile-box' >
            <div className='editprofile-box-inner' >
                <FaWindowClose size='23' className='close-useredit' onClick={closeEditBox} />
            <h4 className='box-header'>Update Profile</h4>
            <Grid container>
                <Grid item xs={12} sm={12} md={6} >
                    First name: <span className='required'>*</span> <br /><input type='text' name='firstname' className='edituser-input' value={editUserValues.firstname} onChange={setEditValues} /><br />
                    Last name: <span className='required'>*</span> <br /><input type='text' name='lastname' className='edituser-input' value={editUserValues.lastname} onChange={setEditValues} /><br />
                    Username: <span className='required'>*</span><br /><input type='text' name='username' className='edituser-input' value={editUserValues.username} disabled /><br />
                    Email: <span className='required'>*</span><br /><input type='text' name='email' className='edituser-input' value={editUserValues.email} disabled/><br />
                    Phone: <span className='required'>*</span><br /><input type='text' name='phone' className='edituser-input' value={editUserValues.phone} onChange={setEditValues} /><br />
                </Grid>
                <Grid item xs={12} sm={12} md={6} >
                    About Me: <span className='required'>*</span><br /><input type='text' name='aboutme' className='edituser-input' value={editUserValues.aboutme} onChange={setEditValues} /><br />
                    Country: <span className='required'>*</span><br /><input type='text' name='country'className='edituser-input'  value={editUserValues.country} onChange={setEditValues} /><br />
                    State / Province: <span className='required'>*</span><br /><input type='text' name='state' className='edituser-input' value={editUserValues.state} onChange={setEditValues} /><br />
                    City: <span className='required'>*</span><br /><input type='text' name='city'className='edituser-input'  value={editUserValues.city} onChange={setEditValues} /><br />
                    Occupation: <span className='required'>*</span><br /><input type='text' name='employment' className='edituser-input' value={editUserValues.employment} onChange={setEditValues} /><br />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} sm={12} md={6} >
                <div className='show-password' onClick={showPasswordBoxFunc}>
                    <div>Change Password?</div>
                    <FaChevronCircleDown size='15'/>
                </div>
                {showPasswordBox && <div>
                    Old Password: <br /><input type='text' name='oldpassword' className='edituser-input' value={editUserValues.oldpassword} onChange={setEditValues} /><br />
                    New Password: <br /><input type='text' name='newpassword' className='edituser-input' value={editUserValues.newpassword} onChange={setEditValues} /><br />
                    Comfirm Password: <br /><input type='text' name='comfirmpassword' className='edituser-input' value={editUserValues.comfirmpassword} onChange={setEditValues} /><br />
                </div>}
                </Grid>
            </Grid>
            <div className='update-btn-box'>
                <button onClick={closeEditBox} className='update-user-btn2' size='25'>Cancel</button>
                <button onClick={updateUser} className='update-user-btn1' size='25'>Update</button>
            </div>
            </div>
        </div>}
        {
            deleteBox && currentUserParsed &&<div className='deleteprofile-box' >
                <div className='deleteprofile-box-inner' >
                <FaWindowClose size='23' className='close-useredit' onClick={closeDeleteBox} />
                <h4 className='box-header'>Delete Account?</h4>
                <div className='delete-notification'>This is a serious action and cannot be undone</div>
                <div className='delete-notification'>To comfirm delete, please type <span className='delete-username'>{username}</span> below</div>
                <input type='text' value={deleteValue} onChange={(e)=>setDeleteValue(e.target.value)} className="delete-input"/>
                <div className='deleteprofile-btns'>
                    <div className='delete-btn-box'>
                        <button onClick={closeDeleteBox} className='delete-user-btn1' size='25'>Cancel</button>
                        <button onClick={deleteUser} className='delete-user-btn2' size='25'>Delete</button>
                    </div>
                </div>
                </div>
            </div>
        }
        
        <Grid className='profile-center'item xs={12} sm={10} container>
            
            <Grid className='profile-center-left' item sm={false} md={1} ></Grid>
            
            <Grid className='profile-top'  item xs={12}> 
                { <img src={userCoverPicture ? userCoverPicture : CoverImage} alt='Cover Image' className='cover-image' />}
                <form className="cover-label-box" enctype="multipart/form-data">
                        {idCurrent == userId && usernameCurrent == userUsername && <label htmlFor='coverPicture'  >
                            <div className="cover-label-box-inner" > 
                                <FaCamera  className='img-upload-icon' size='30' /> 
                          </div>
                        {!coverImage &&<input id='coverPicture' type='file' name='coverPic' className='homepage-center-input2' 
                        onChange={selectCoverPic}/>}
                        </label>}
                    </form>
                <Grid className='profile-img-box' container>
                <Grid item xs={12} sm={3}>
                   { <img src={userProfilePicture ? userProfilePicture : ProfileImage} alt='Profile Image' className='profile-img' />}
                    <form className="profile-label-box" enctype="multipart/form-data">
                        {idCurrent == userId && usernameCurrent == userUsername && <label htmlFor='profilePicture'  >
                            <div className="profile-label-box-inner">
                                <FaCamera  className='img-upload-icon' size='30'/> 
                          </div>
                        {!profileImage && <input id='profilePicture' type='file' name='profilePic' className='homepage-center-input2' 
                        onChange={selectProfilePic}/>}
                        </label>}
                    </form>
                    <div className='profile-summary-desktop'>
                        <h1 className='username'>{firstname && lastname && `${firstname} ${lastname}`}</h1>
                        <div className='-followings'>{`Following : ${followings.length}`}</div>
                        <div className='-followings'>{`Followers : ${followers.length}`}</div>
                    </div>
                </Grid>
                <Grid className='profile-summary' item xs={12} sm={5}> 
                    <div className='profile-summary-inner'>
                        <h1 className='username'>{firstname && lastname && `${firstname} ${lastname}`}</h1>
                        <div className='-followings'>{`Following : ${followings.length}`}</div>
                        <div className='-followings'>{`Followers : ${followers.length}`}</div>
                    </div>
                </Grid>
                <Grid className='btn-box' item xs={12} sm={4}>
                    
                { idCurrent == userId && usernameCurrent == userUsername ?
                <>




                    <div className='main-userbtn1'>
                        <Button aria-describedby={popOverId} className='user-options' variant="contained" color="primary" onClick={handleClick}>
                           <FaEllipsisH />
                        </Button>
                    </div>
                    <Popover
                        id={popOverId}
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
                        <Typography className={classes.typography}>
                            <Button className='popover-btn' onClick={openEditBox}>Edit Profile</Button><br/>
                            <Button className='popover-btn' onClick={openDeleteBox}>Delete Account</Button>
                        </Typography>
                    </Popover>
                <div className='main-userbtn2'>
                    <Button className='btn' onClick={openEditBox}>Edit Profile</Button><br/>
                    <Button className='btn' onClick={openDeleteBox}>Delete Account</Button>
                </div>
                </> : 
                    <>
                    <div className='other-userbtn1'>
                        <Button aria-describedby={popOverId} className='user-options' variant="contained" color="primary" onClick={handleClick}>
                           <FaEllipsisH />
                        </Button>
                    </div>
                    <Popover
                        id={popOverId}
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
                        <Typography className={classes.typography}>
                        {  currentUserParsed.followings && !currentUserParsed.followings.includes(userId) ?
                            <><Button className='popover-btn' onClick={(e)=>follow(e, userId, userUsername)}>Follow</Button><br /></>
                        : <><Button className='popover-btn' onClick={(e)=>unfollow(e, userId, userUsername)}>Unfollow</Button><br/></>
                        }
                        { currentUserParsed.connections && !currentUserParsed.connections.includes(userId) &&
                            !currentUserParsed.sentConnectionRequests.includes(userId) &&
                            !currentUserParsed.receivedConnectionRequests.includes(userId) && 
                            <><Button onClick={(e)=>connectRequest(e, id, username)} className='popover-btn'>Connect Request
                            </Button><br/></>
                        }
                        {currentUserParsed.connections && !currentUserParsed.connections.includes(userId) &&
                            (currentUserParsed.receivedConnectionRequests.includes(userId) || 
                            currentUserParsed.sentConnectionRequests.includes(userId)) &&
                            <><Button onClick={(e)=>connectRequest(e, id, username)} className='popover-btn'>Cancel Request</Button><br /></>
                        } 
                        { currentUserParsed.connections && currentUserParsed.connections.includes(userId) &&
                            <Button className='popover-btn' onClick={(e)=>disconnectRequest(e, userId, userUsername)}>Disconnect</Button>
                        }
                        <Link to={ `/chat/${idCurrent}/${usernameCurrent}/${userId}/${userUsername}`} >
                            <Button className='popover-btn'>Send Message</Button>
                        </Link> 
                        </Typography>
                    </Popover>
                    <div className='other-userbtn2'>
                        {  currentUserParsed.followings && !currentUserParsed.followings.includes(userId) ?
                            <Button className='btn' onClick={(e)=>follow(e, userId, userUsername)}>Follow</Button>
                        : <Button className='btn' onClick={(e)=>unfollow(e, userId, userUsername)}>Unfollow</Button>
                        }
                        { currentUserParsed.connections && !currentUserParsed.connections.includes(userId) &&
                            !currentUserParsed.sentConnectionRequests.includes(userId) &&
                            !currentUserParsed.receivedConnectionRequests.includes(userId) && 
                            <Button onClick={(e)=>connectRequest(e, id, username)} className='btn'>Connect Request
                            </Button>
                        }
                        {currentUserParsed.connections && !currentUserParsed.connections.includes(userId) &&
                            (currentUserParsed.receivedConnectionRequests.includes(userId) || 
                            currentUserParsed.sentConnectionRequests.includes(userId)) &&
                            <Button onClick={(e)=>connectRequest(e, id, username)} className='btn'>Cancel Request</Button>
                        } 
                    { currentUserParsed.connections && currentUserParsed.connections.includes(userId) &&
                    <Button className='btn' onClick={(e)=>disconnectRequest(e, userId, userUsername)}>Disconnect</Button>}
                        <Link to={ `/chat/${idCurrent}/${usernameCurrent}/${userId}/${userUsername}`} >
                            <Button className='btn'
                            disabled = {currentUserParsed.connections && !currentUserParsed.connections.includes(userId)}
                           >Send Message</Button>
                        </Link>
                        {currentUserParsed.connections && !currentUserParsed.connections.includes(userId) && 
                        <div style={{textDecoration:"none"}}>Connet to this user to send a message</div>
                        }
                    </div>
                </>
                }
                </Grid>
            </Grid>
            {coverPreviewBox && 
                <div className='cover-img-preview-box'>
                    <h3 className='upload-title'>Upload Cover Picture</h3>
                    <div className='cover-img-container'>
                        <img src={coverPicturePreview} alt='Error loading preview' className='cover-img-preview'/>
                    </div>
                    <div className='user-pic-upload-btn'>
                        <div className='homepage-center-input-item-2' onClick={()=>setCoverCancelValues(false)} >
                        <FaWindowClose  className='homepage-center-input-icon-close' size='25' />
                        <span className='picture-name'>
                            Cancel
                        </span>
                        </div>
                        <div className='homepage-center-input-item-2' onClick={()=>uploadCoverPicture(coverImage)}>
                        <FaTelegramPlane  className='homepage-center-post-icon' size='25' />
                        <span className='picture-name'>
                            Upload
                        </span>
                        </div>
                    </div>
                    </div>  
                }
                {profilePreviewBox && 
                    <div className='profile-img-preview-box'>
                        <h3 className='upload-title'>Upload Profile Picture</h3>
                    <div className='profile-img-container'>
                        <img src={profilePicturePreview} alt='Error loading preview' className='profile-img-preview'/>
                    </div>
                    <div className='user-pic-upload-btn'>
                        <div className='homepage-center-input-item-2' onClick={()=>setProfileCancelValues(false)} >
                        <FaWindowClose  className='homepage-center-input-icon-close' size='25' />
                        <span className='picture-name'>
                            Cancel
                        </span>
                        </div>
                        <div className='homepage-center-input-item-2' onClick={()=>uploadProfilePicture(profileImage)}>
                        <FaTelegramPlane  className='homepage-center-post-icon' size='25' />
                        <span className='picture-name'>
                            Upload
                        </span>
                        </div>
                    </div>
                    </div>     
                }
            </Grid>
            
            <Grid className='profile-center-left' item sm={false} md={1} ></Grid>


            
            <Grid className=''item sm={12}  container >
            
            <Grid className='profile-center-inner-left'item xs={12} sm={12} md={6} style={{marginTop:"10rem"}}>
                
            <div className='profile-center-inner-left-1' >
                <div className='profile-center-inner-left-2'>
                    <h3>My Bio</h3>
                    <h4>{aboutMe}</h4>
                    <div className='icons-box'>
                        <FaHome className='icons'/> Lives in {city}, {state}, {country}
                    </div>
                    <div className='icons-box'>
                        <FaUsers className='icons'/>Working as: {employment}
                    </div>
                    <div className='icons-box'>
                        <FaUsers className='icons'/>Phone: {phone}
                    </div>
                    <div className='icons-box'>
                        <FaUsers className='icons'/>Email: {email}
                    </div>
                </div>   
                <br/>
              <hr />
           {fetchedUser.connections.length > 0 ? <h4>Connections ({fetchedUser.connections.length})</h4> : <><h4>No connections yet</h4>
           { idCurrent == userId &&  usernameCurrent == userUsername && <p>Find <Link to={`/connections/${userId}/${userUsername}`}>Connections</Link></p>}
            </> }
              <div className='connections-box'>
              {
            allUsers.length == 0 ? 
            <div style={{width: "100%",height : "7rem", 
                display: 'grid', placeItems: "center"}}>
                <LoadingIcons.Puff stroke="#555" strokeOpacity={.9} />
            </div>:
               fetchedUser ?
            allUsers.map(allUser => {
                const {_id : id, username, firstname, lastname, profilePicture} = allUser
                const {_id, connections} = fetchedUser
                      if(allUser._id !== _id && connections.includes(allUser._id)){
                        return <div key={id} className='otherUsers-inner'>
                            <Link to={`/userprofile/${allUser._id}/${username}`} onClick={()=>setUserClicked(!userClicked)}>
                                <img src={profilePicture ? profilePicture : ProfileImage}  className="follow-img" />
                            </Link>
                            <div className='profile-follow-name-2'>{firstname && lastname && `${firstname} ${lastname}`}</div>
                        </div>
                     }
                })

                : null
            
           }
            </div>
            <br/>
              <hr />
           {fetchedUser.followings.length > 0 ? <h4>Following ({fetchedUser.followings.length})</h4> : <><h4>Not following anyone yet</h4> 
           { idCurrent == userId &&  usernameCurrent == userUsername && <p>Find people to <Link to={`/follows/${userId}/${userUsername}`}>Follow</Link></p>}
            </> }
              <div className='connections-box'>
              {
            allUsers.length == 0 ? 
            <div style={{width: "100%",height : "7rem", 
                display: 'grid', placeItems: "center"}}>
                <LoadingIcons.Puff stroke="#555" strokeOpacity={.9} />
            </div>:
               fetchedUser ?
            allUsers.map(allUser => {
                const {_id : id, username, firstname, lastname, profilePicture} = allUser
                const {_id, followings} = fetchedUser
                      if(allUser._id !== _id && followings.includes(allUser._id)){
                        return <div key={id} className='otherUsers-inner'>
                            <Link to={`/userprofile/${allUser._id}/${username}`} onClick={()=>setUserClicked(!userClicked)}>
                                <img src={profilePicture ? profilePicture : ProfileImage}  className="follow-img" />
                            </Link>
                            <div className='profile-follow-name'>{firstname && lastname && `${firstname} ${lastname}`}</div>
                            <form>
                                <br/>
                                <button onClick={(e)=>unfollow(e, id, username)} className='profile-page-follow-btn'>
                                    {newUserFollowings  && newUserFollowings.includes(allUser._id) ? `Unfollow` : `Follow`}</button>
                            </form>
                        </div>
                     }
                })

                : null
            
           }
           </div>
           <br/>
              <hr />
           {fetchedUser.followers.length > 0 ? <h4>Followers ({fetchedUser.followers.length})</h4> : <h4>No followers yet</h4> }
              <div className='connections-box'>
              {
            allUsers.length == 0 ? 
            <div style={{width: "100%",height : "7rem", 
                display: 'grid', placeItems: "center"}}>
                <LoadingIcons.Puff stroke="#555" strokeOpacity={.9} />
            </div>:
               fetchedUser ?
            allUsers.map(allUser => {
                const {_id : id, username, firstname, lastname, profilePicture} = allUser
                const {_id, followers} = fetchedUser
                      if(allUser._id !== _id && followers.includes(allUser._id)){
                        return <div key={id} className='otherUsers-inner'>
                            <Link to={`/userprofile/${allUser._id}/${username}`} onClick={()=>setUserClicked(!userClicked)}>
                                <img src={profilePicture ? profilePicture : ProfileImage}  className="follow-img" />
                            </Link>
                            <div className='profile-follow-name'>{firstname && lastname && `${firstname} ${lastname}`}</div>
                            <form>
                                <br/>
                                {  allUser._id != currentUserParsed._id  && newUserFollowings &&
                                    <button onClick={newUserFollowings.includes(allUser._id) ? 
                                        (e)=>unfollow(e, id, username) : (e)=>follow(e, id, username)}
                                        className='profile-page-follow-btn'>
                                        { newUserFollowings.includes(allUser._id) ? `Unfollow` :
                                        (idCurrent == userId &&  usernameCurrent == userUsername) ?
                                         `Follow Back` : `Follow`}</button>}
                            </form>
                        </div>
                     }
                })
                : null
            
           }
           </div>
           <hr className='profile-center-top-hr' />
            </div>    
            </Grid>
            <Grid className='profile-center-inner-right'item xs={12} sm={12} md={6} >
            { idCurrent == userId && usernameCurrent == userUsername &&
            <div className='profile-center-top' >
                <div className='profile-center-top-inner'>
                { 
                <Link to={`/userprofile/${id}/${username}`}>
                    <img src={userProfilePicture ? userProfilePicture : ProfileImage} alt='Profile Image' className='profile-img-2' />
                </Link>
                
                }
                    <input type='hidden' name='userId' />
                    <input type='hidden'  name='username'/>
                     <input type='text' name='post-input' placeholder='Make a post' className='profile-center-input' 
                    value={formValue} onChange={setValues}/>
                </div>     
                {
                    error.status && <div className='errorNotice'><FaExclamationCircle />{error.msg}</div>
                }   
                <hr className='profile-center-top-hr'/>
                    {postPreviewBox && 
                    <div className='post-img-preview-box'>
                         <div className='preview-top'>
                            <img src={userProfilePicture ? userProfilePicture : ProfileImage} className="post-profile-img-2" />
                            <input type='hidden' name='userId' />
                            <input type='hidden'  name='username'/>
                            <input type='text' name='post-input' placeholder='Make a post' className='homepage-center-input-2' 
                        value={formValue} onChange={setValues}/>
                        </div>
                        <div className='post-img-container'>
                            <img src={postPicturePreview} alt='Error loading preview' className='post-img-preview'/>
                        </div>
                        <div className='pic-upload-btn'>
                            <div className='homepage-center-input-item-2'onClick={()=>setPostCancelValues(false)} >
                            <FaWindowClose  className='homepage-center-input-icon-close' size='25' />
                            <span className='picture-name'>
                                Cancel
                            </span>
                            </div>
                            <div className='homepage-center-input-item-2'onClick={submit} >
                            <FaTelegramPlane  className='homepage-center-post-icon' size='25' />
                            <span className='picture-name'>
                                Post
                            </span>
                            </div>
                        </div>
                    </div>
                    }
                <div className='profile-center-top-inner2' >
                {idCurrent == userId && usernameCurrent == userUsername && <label htmlFor='postPicture'  >
                        <div className="profile-center-input-item">
                        <FaImages className='profile-center-input-icon-picture' size='25'/> 
                            <span className='picture-name'>Picture</span>
                       </div>
                    {!postImage && <input id='postPicture' type='file' name='postPic' className='profile-center-input2' 
                        onChange={selectPostPic}/>}
                    </label>}
                    <div className='profile-center-input-item'onClick={submit} >
                        <FaTelegramPlane  className='homepage-center-post-icon' size='25' />
                        <span className='picture-name'>Post</span>
                    </div>
                </div>     
            </div> 
            
            }
            <div className='profile-center-middle'>
              {!timeline  ?
              <div style={{width: "100%",height : "100vh", 
              display: 'grid', placeItems: "center"}}>
                 <LoadingIcons.Puff       stroke="#555" strokeOpacity={.9} />
             </div> :
                <>
                    {
                    timeline.map(item =>{
                        const {id} = item
                        return <Posts key={id} {...item}/>
                    })
                    }
                </>
              }   
            </div>
            {
                lazyLoading &&  (timelineposts.length > arrayofArrayList.length) && <div style={{width: "100%",height : "6rem", 
                display: 'grid', placeItems: "center"}}>
                    <LoadingIcons.Puff  stroke="#555" strokeOpacity={.9} />
                </div>
            }
            </Grid>

            </Grid>

            {/* <Grid className='profile-center-right' item sm={false} md={1} ></Grid>  */}
        </Grid>
        
        <Grid className='profile-right-border' item xs={false} sm={1} ></Grid>
    </Grid>
    </>
}

export default UserProfile






