    import React from 'react';
    import { makeStyles } from '@material-ui/core/styles';
    import './comments.css'
    import { Button, Grid } from '@material-ui/core'
    import Popover from '@material-ui/core/Popover';
    import Typography from '@material-ui/core/Typography';
    import Profile from "../../assets/profile.jfif"
    import TimeAgo from 'timeago-react'
    import { useEffect, useState } from 'react'
    import {FaExclamationCircle, FaThumbsUp, FaComment, FaEllipsisH, FaShare, FaWindowClose, 
        FaPen, FaTrash, FaTelegramPlane} from 'react-icons/fa'
    import axios from 'axios'
    import { UseAppContext } from '../../Contexts/app-context'
    import { Backdrop } from '../'
    import ProfileImage from '../../assets/profile.jpg'

    const useStyles = makeStyles((theme) => ({
        typography: {
            padding: theme.spacing(2),
        },
    }));
    

    const Comments = ({ id, _id, userId, username, comment : userComment, createdAt})=>{
        
        const {timelineposts, currentUser, setPostCreated, setCommentSent, commentSent,
            fetchedUser, currentUserParsed} = UseAppContext()
        const userFirstLetter = username.slice(0,1).toUpperCase()
        const userOtherLetters = username.slice(1)
        const newUsername = userFirstLetter + userOtherLetters
        const [error, setError] = useState({status : false, msg:''})
        const usersUrl = "https://server.connect.smartegbuchulem.co/api/v1/user"
        const commentsurl = 'https://server.connect.smartegbuchulem.co/api/v1/comments'
        const [comments , setComments] = useState([])
        const newComments = []
        const [commentForm, setCommentForm] = useState(false)
        const [commentValue, setCommentValue] = useState('')
        const [fetchedUserData, setFetchedUserData] = useState({})
        // const [commentSent, setCommentSent] = useState(false)
        // const [updateSent, setUpdateSent] = useState(false)
        // const [showOptions, setShowOptions] = useState(false)
        // const [showCommentOptions, setShowCommentOptions] = useState(false)
        const [showUpdatePostForm, setShowUpdatePostForm] = useState(false)
        const [showDeletePostDialog, setShowDeletePostDialog] = useState(false)
        const [updateCommentValue, setUpdateCommentValue] = useState(userComment)

        const {firstname, lastname, profilePicture} = fetchedUserData
        const classes = useStyles();

        const [anchorEl1, setAnchorEl1] = React.useState(null);
        
        const handleClick1 = (event) => {
            setAnchorEl1(event.currentTarget);
          };
          const handleClose1 = () => {
            setAnchorEl1(null);
          };
          
          const open1 = Boolean(anchorEl1);
          const id1 = open1 ? 'simple-popover1' : undefined


        const setFormForUpdate =()=>{
            setCommentForm(!commentForm)
            setShowUpdatePostForm(!showUpdatePostForm)
            setUpdateCommentValue(userComment)
            // setShowCommentOptions(!showCommentOptions)
        }

        const commentResponse = (value) =>{
            setCommentSent(value)
            setUpdateCommentValue('')
            setCommentForm(!commentForm)
        }
        

// Enter key to submit
const enterClicked =(e)=>{
    if(e.charCode === 13){
        commentUpdate(e)
    }
}
//Update comment
//show post update
const commentUpdate = async(e)=>{
    e.preventDefault()
    const {_id : currentUserId, username : currentUserName} = JSON.parse(currentUser)
            const options ={
            url : `https://server.connect.smartegbuchulem.co/api/v1/comments/${id}/${_id}`,
            method : "PATCH",
            headers : {
               "Accept" : "Application/json",
               "Content-Type" : "Application/json;charset=utf-8"
            },
            data :{
                userId : currentUserId,
                username : currentUserName,
                comment : updateCommentValue
            }
        }
 
        const result = await axios(options)
        const {response} = result.data
        
        if(response == 'Success'){
            commentResponse(commentSent)
        }else{
            setError({status : true, msg : "Failed to update post"})
        }
}


//Delete comment
        const deleteComment = async(id)=>{
            const {_id : currentUserId, username : currentUserName} = JSON.parse(currentUser)
            const options ={
                url : `https://server.connect.smartegbuchulem.co/api/v1/comments/${id}/${_id}`,
                method : "DELETE",
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
                setCommentSent(commentSent)
            }else{
                setError({status : true, msg : "Failed to delete comment"})
            }
    }

    //FETCH A USER
    const fetchAUser = async(url)=>{
        // dispatch({type : LOADING, payload : true})
        await axios(url).then(result =>{
        
            const {response, data} = result.data
            
            if(response == 'Success' && data){
                setFetchedUserData(data)
                
            }else if(response == 'Fail'){
                //dispatch({type : LOADING, payload : false})
                // dispatch({type: ALERT, payload : "An error occured fetching other users"})
            }
        })
            
     }
     //FETCH ALL USERS USEEFFECT
    useEffect(()=>{
        fetchAUser(`${usersUrl}/${userId}/${username}`)         
    },[fetchedUser, commentSent])

    
        const {_id : uId , username : userUsername} =  currentUserParsed
    return <div className='comment-main' >
        {uId == userId && userUsername == username && <Button className='more-options'  onClick={handleClick1}>
            <FaEllipsisH  />
        </Button>
        }
        {/* {
            showCommentOptions && <div className='options-box'>
            <FaWindowClose onClick={()=>setShowCommentOptions(!showCommentOptions)} className='close-options'/><br />
            <Button ><FaPen /></Button><br />
            \
            <button className='icon-btn' onClick={setFormForUpdate}><FaPen  className='update-icon'/></button>
            <button className='icon-btn' onClick={()=>setShowDeletePostDialog(!showDeletePostDialog)}><FaTrash  className='trash-icon'/></button>
            </div>
        } */}
        {/* {
            showDeletePostDialog && <div className='backdrop' onClick={()=>setShowDeletePostDialog(false)}>
            <div className='delete-box' >
                <form>
                    <Button onClick={()=>setShowDeletePostDialog(false)}>Cancel</Button>
                    <Button onClick={()=>deleteComment(id)}>Delete Comment</Button>
                </form>
            </div>
            </div>
        } */}
         <Popover
                id={id1}
                open={open1}
                anchorEl={anchorEl1}
                onClose={handleClose1}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
                }}
                transformOrigin={{
                vertical: 'center',
                horizontal: 'right',
                }}
            >
                <Typography className={classes.typography}>
                <div className='' > 
                <button className='icon-btn' onClick={setFormForUpdate}><FaPen  className='update-icon'/></button>
                <button className='icon-btn' onClick={()=>deleteComment(id)}><FaTrash  className='trash-icon'/></button>
                </div>
                </Typography>
            </Popover>
         <img src={profilePicture ? profilePicture : ProfileImage}  className='comment-pic'/>
        <div className='comment-username'>{firstname && lastname && `${firstname} ${lastname}`}</div>
        <div className='comment'>{userComment}</div>
        <TimeAgo datetime={createdAt} locale='en_US' className='comment-timeago'/>
        {
            commentForm && <form>
                <input type='text' value={updateCommentValue} onChange={(e)=>setUpdateCommentValue(e.target.value)} className='comment-input' /><br />
                <Button style={{float:"right", marginTop:"-1.9rem"}} onKeyPress={enterClicked} onClick={commentUpdate}><FaTelegramPlane className='submit-icon'/></Button>
            </form>
        }
    </div> 
}

export default Comments