import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './posts.css'
import { Comments } from '../';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { Button, Grid } from '@material-ui/core'
import ProfileImage from '../../assets/profile.jpg'
import { Link } from 'react-router-dom';
import TimeAgo from 'timeago-react'
import { useEffect, useState } from 'react'
import {FaExclamationCircle, FaThumbsUp, FaComment, FaEllipsisH, FaShare, FaWindowClose, 
    FaPen, FaTrash, FaTelegramPlane, FaTimes} from 'react-icons/fa'
    import axios from 'axios'
    import { UseAppContext } from '../../Contexts/app-context'
    import { Backdrop } from '../'
    
    const useStyles = makeStyles((theme) => ({
        typography: {
            padding: theme.spacing(2),
        },
    }));
    
const Posts =({_id : id, userId, username, firstname, lastname, description, likes, createdAt, sharedDescription,
     shareImg, sharedId, sharedUsername, sharedFirstname, sharedLastname, img : postImage})=>{
    const {timelineposts, currentUser, currentUserParsed, setPostCreated, postCreated,commentSent, 
        setCommentSent, fetchedUser} = UseAppContext()
    const [readMoreValue, setReadMoreValue] = useState(false)
    const [error, setError] = useState({status : false, msg:''})
    const [alertMsg, setAlertMsg] = useState({status : false, msg : ''})
    const [liked, setLiked] = useState(false)
    const [likesCount, setLikesCount] = useState(likes.length)
    const usersUrl = "https://server.connect.smartegbuchulem.co/api/v1/user"
    const postsurl = 'https://server.connect.smartegbuchulem.co/api/v1/posts'
    const commentsurl = 'https://server.connect.smartegbuchulem.co/api/v1/comments'
    const [comments , setComments] = useState([])
    const newComments = []
    const [commentForm, setCommentForm] = useState(false)
    const [commentValue, setCommentValue] = useState('')
    const [updateValue, setUpdateValue] = useState(description)
    // const [commentSent, setCommentSent] = useState(false)
    const [updateSent, setUpdateSent] = useState(false)
    // const [showOptions, setShowOptions] = useState(false)
    const [showCommentOptions, setShowCommentOptions] = useState(false)
    const [showUpdatePostForm, setShowUpdatePostForm] = useState(false)
    const [showDeletePostDialog, setShowDeletePostDialog] = useState(false)
    const [shareForm, setShareForm] = useState(false)
    const [sharePostValue, setSharePostValue] = useState('')
    const [fetchedUserData, setFetchedUserData] = useState({})
    const {_id : currentUserLikeId} = currentUserParsed

    const {_id : userID, username : userName, firstname : userFirstname, lastname : userLastname, profilePicture} = fetchedUserData


    const classes = useStyles();
    
//Popover functions
const [anchorEl1, setAnchorEl1] = React.useState(null);
const [anchorEl2, setAnchorEl2] = React.useState(null);
const [anchorEl3, setAnchorEl3] = React.useState(null);

  const handleClick1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClick3 = (event) => {
    setAnchorEl3(event.currentTarget);
  };

  const handleClose1 = () => {
    setAnchorEl1(null);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const handleClose3 = () => {
    setAnchorEl3(null);
  };

  const open1 = Boolean(anchorEl1);
  const id1 = open1 ? 'simple-popover1' : undefined;

  const open2 = Boolean(anchorEl2);
  const id2 = open2 ? 'simple-popover2' : undefined;

  const open3 = Boolean(anchorEl3);
  const id3 = open3 ? 'simple-popover3' : undefined;





    const setFormForComment =()=>{
        setCommentForm(!commentForm)
        setShowUpdatePostForm(false)
    }
    const setFormForUpdate =()=>{
        setUpdateValue(description)
        setCommentForm(false)
        setShowUpdatePostForm(!showUpdatePostForm)
        handleClose1()
    }

    const setPostData = (value1, value2, value3)=>{
        setSharePostValue(value1)
        setShareForm(false)
        setPostCreated(value2)
        setTimeout(()=>{
            setPostCreated(value3)
        }, 3000)
    }

    const setPostResponse = (value)=>{
        setUpdateValue('')
        setShowUpdatePostForm(!showUpdatePostForm)
        setShareForm(false)
        setPostCreated(true)
        setTimeout(()=>{
            setPostCreated(false)
        }, 3000)
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
    },[fetchedUser, postCreated, commentSent])

    useEffect(()=>{
        if(likes.includes(currentUserLikeId)){
            setLiked(true)
        }
    },[])
    
    //set values for liked post
    const setLikedValue=(value1, value2)=>{
        setLiked(value1)
        const {_id : currentUserId, username : currentUserName} =currentUserParsed
        
        const setLikedId=async(value)=>{
            
            const options = {
                url : `${postsurl}/${value}/${currentUserId}/${currentUserName}`,
                method : 'PATCH',
                headers : {
                    "Accept" : "Application/json",
                    "Content-Type" : "Application/json;charset=UTF-8"    
                }
            }
            
            const result = await axios(options)
            
            //fetch liked/unliked post
            const options2 ={
                url : `https://server.connect.smartegbuchulem.co/api/v1/posts/${id}/${userId}/${username}`,
                method : "GET",
                headers : {
                   "Accept" : "Application/json",
                   "Content-Type" : "Application/json;charset=utf-8"
                }
            }
            const result2 = await axios(options2)
            const {fetchedPost} = result2.data
            const {likes} = fetchedPost
            
            if(likes.includes(currentUserLikeId)){
                setLikesCount(likes.length)
               return setLiked(true)
            }else{
                setLikesCount(likes.length)
                return setLiked(false)
            }
      
            
        }
        setLikedId(value2)
    }

    
//    console.log('value', likes.includes(currentUserLikeId), likes,  currentUserLikeId)
    //fetchComments
    const fetchComments = async(url)=>{
        // const {_id : currentUserId, username : currentUserName} = JSON.parse(currentUser)
        const options ={
            url : `https://server.connect.smartegbuchulem.co/api/v1/comments/${id}`,
            method : "GET",
            headers : {
               "Accept" : "Application/json",
               "Content-Type" : "Application/json;charset=utf-8"
            }
        }
        const result = await axios(options)
        
        const {postComments} = result.data
        
        postComments.forEach(item => {
            if(item.postId === id){
                newComments.push(item)
            }
        });
       
        setComments(newComments)
    }

    useEffect(()=>{
        fetchComments(`${commentsurl}/${id}/${userId}/${username}`)
    },[commentSent])

    // fetch userId and userName using context
    
    
// Enter key to submit
    const enterClicked1 =(e)=>{
        if(e.charCode === 13){
            postComments(e)
        }
    }

    // //post a comment
    const postComments = async(e)=>{
        e.preventDefault()
        const {_id : currentUserId, username : currentUserName} = currentUserParsed
        const options ={
            url : `https://server.connect.smartegbuchulem.co/api/v1/comments/${id}/${currentUserId}/${currentUserName}`,
            method : "POST",
            headers : {
               "Accept" : "Application/json",
               "Content-Type" : "Application/json;charset=utf-8"
            },
            data :{
                    postId : id,
                    userId : currentUserId,
                    username : currentUserName,
                    comment : commentValue
            }
        }
        const result = await axios(options)
        const {response} = result.data
        if(response == 'Success'){
            setCommentValue('')
            setCommentSent(!commentSent)
        }else{
            setError({status : true, msg : "Failed to post comment"})
        }
    }

// Enter key to submit
const enterClicked2 =(e)=>{
    if(e.charCode === 13){
        postUpdate(e)
      }
}

//Update post
const postUpdate = async(e)=>{
    e.preventDefault()
    const {_id : currentUserId, username : currentUserName} = currentUserParsed
        const options ={
            url : `https://server.connect.smartegbuchulem.co/api/v1/posts/${id}`,
            method : "PATCH",
            headers : {
               "Accept" : "Application/json",
               "Content-Type" : "Application/json;charset=utf-8"
            },
            data :{
                userId : currentUserId,
                username : currentUserName,
                description : updateValue
            }
        }
        const result = await axios(options)
        const {response} = result.data
        if(response == 'Success'){
            setPostResponse(updateValue)
        }else{
            setError({status : true, msg : "Failed to update post"})
        }
}

//Delete Post
const deletePost = async(id)=>{
    const {_id : currentUserId, username : currentUserName} = currentUserParsed
    const options ={
        url : `https://server.connect.smartegbuchulem.co/api/v1/posts/${id}`,
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
        // setUpdateValue(updateValue)
        setPostCreated(true)
        setTimeout(()=>{
            setPostCreated(false)
        }, 3000)
    }else{
        setError({status : true, msg : "Failed to delete post"})
    }
}

//share a post

const sharePost = async(url)=>{
    //sharedId = ID of origina poster
    //sharedUsername = Username of origina poster
    const {_id : currentUserId, username : currentUserName} = currentUserParsed
    const options ={
        url : `https://server.connect.smartegbuchulem.co/api/v1/posts/${id}/${userId}/${username}`,
        method : "POST",
        headers : {
           "Accept" : "Application/json",
           "Content-Type" : "Application/json;charset=utf-8"
        },
        data :{
                userId : currentUserId,
                username : currentUserName,
                firstname : firstname,
                lastname : lastname,
                description : sharePostValue,
                sharedId : userId,
                sharedUsername : username,
                sharedFirstname : firstname,
                sharedLastname : lastname,
                sharedDescription : description,
                shareImg : postImage
        }
    }
    const result = await axios(options)
    const {response} = result.data

    
    if(response == 'Success'){
       setPostData("",true, false)
    }else{
        setError({status : true, msg : "Failed to share post"})
    }
}

const {_id : uId , username : userUsername} =  currentUserParsed
    return <div className='posts' > 
                {
                    error.status && <div className='errorNotice'><FaExclamationCircle />{error.msg}</div>
                }  
                {/* {
                    showOptions && <div className='options-box'>
                    <FaWindowClose onClick={()=>setShowOptions(!showOptions)} className='close-btn'/><br />
                    <Button onClick={setFormForUpdate}>Update Post</Button><br />
                    <Button onClick={()=>setShowDeletePostDialog(!showDeletePostDialog)}>Delete Post</Button>
                    </div>
                } */}
                {
                    showDeletePostDialog && <div className='backdrop' onClick={()=>setShowDeletePostDialog(false)}>
                    <div className='delete-box' >
                        <form>
                            <Button onClick={()=>setShowDeletePostDialog(false)}>
                                <FaTimes  style={{color:"var(--color4)"}}/>
                            </Button>
                            <Button onClick={()=>deletePost(id)}>
                                <FaTrash style={{color:"var(--color-close)"}}  />
                            </Button>
                        </form>
                    </div>
                    </div>
                }
                <div  className='postContainer' >
                { uId == userId && userUsername == username && <Button className='more-options' aria-describedby={id} variant="contained" color="primary" onClick={handleClick1}>
                     <FaEllipsisH  />
                 </Button>
                   }
                   <Popover
                        id={id1}
                        open={open1}
                        anchorEl={anchorEl1}
                        onClose={handleClose1}
                        anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                        }}
                        transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                        }}
                    >
                        <Typography className={classes.typography}>
                            <Button onClick={setFormForUpdate}>
                                <FaPen style={{color:"var(--color-7)"}}/> Update
                            </Button>
                            <Button onClick={handleClick2}>
                                <FaTrash style={{color:"var(--color-close)"}} /> Delete
                            </Button>
                        </Typography>
                    </Popover>
                    <Popover
                        id={id2}
                        open={open2}
                        anchorEl={anchorEl2}
                        onClose={handleClose2}
                        anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                        }}
                        transformOrigin={{
                        vertical: 'center',
                        horizontal: 'right',
                        }}
                    >
                        <div className={classes.typography}>
                        Comfirm Delete
                        <div className='delete-box-2' >
                            <form>
                                <Button onClick={handleClose2} >
                                    <FaTimes style={{color:"var(--color4)"}}/> Cancel
                                </Button>
                                <Button onClick={()=>deletePost(id)}>
                                    <FaTrash style={{color:"var(--color-close)"}} /> Delete
                                </Button>
                            </form>
                        </div>
                        </div>
                    </Popover>
                
                <div className='post-top'>
                <Link to={`/userprofile/${userID}/${userName}`} className='post-details-box '>
                    <img src={profilePicture ? profilePicture : ProfileImage}  className='profile-pic'/>
                    <div className='post-top-details'>
                        <div className='name'>{userFirstname && userLastname &&`${userFirstname} ${userLastname}`}</div>
                        <div className='post-timeago'><TimeAgo datetime={createdAt} locale='en_US' /></div>
                    </div>
                </Link>
                </div>
                <div className='description'>{description.length > 150  && !readMoreValue ? description.slice(0, 150) + "...  "  : description }
                    {description.length > 150 &&
                        <button className='more-btn' onClick={()=>setReadMoreValue(!readMoreValue)}>{readMoreValue ? `Show Less` : `Show More`}</button>}
                </div>
                {/* <div className="sharer">${username}<div></div> */}
                {/* `${username} shared a memory`  */}
                {/* `${username} shared a post by ${sharedUsername}` */}
                {
                sharedDescription && sharedDescription.length > 0 &&<div>
                        <div className='shared-box-info'>
                            {username == sharedUsername ? 
                            <div>
                                <span className='sharename'>{userFirstname && userLastname &&`${userFirstname} ${userLastname} `}</span>
                                 shared a memory
                            </div>
                            :
                             <div>
                                 <span className='sharename'>{userFirstname && userLastname &&`${userFirstname} ${userLastname} `}</span>
                                  shared a post by 
                                  <span className='sharename'>{` ${sharedFirstname} ${sharedLastname} `}</span>
                            </div>
                            }
                        </div>
                        <div className='shared-box'>
                            <div className='shared-description'>{sharedDescription}</div>
                            <div className='sharedname'>{sharedUsername}</div>
                        </div>
                    </div>
                }
                {
                shareImg && shareImg.length > 0 &&<div>
                        {/* <div className='shared-box-info'>{`${username} shared a post by ${sharedUsername}`}</div> */}
                        <div className='shared-box'>
                            <img src={shareImg} className='shared-img' />
                            {/* <div className='sharedname'>{sharedUsername}</div> */}
                        </div>
                    </div>
                }
                {
                    postImage && <div className='postImage-box'>
                        <img src ={postImage} alt='Error fetching image' className='postImage' />
                        </div>
                }
                <div className='icons-box'>
                    <div className='icons-box-item'><FaThumbsUp className='icon-thumbsup-liked-alt' /> {likesCount}</div>
                    <div className='icons-box-item2'>{comments.length} Comments</div>
                </div>
                
                <div className='icons-box'>
                    <Button className='icons-box-item' onClick={()=>setLikedValue(!liked, id)}><FaThumbsUp className={liked ? `icon-thumbsup-liked` : `icon-thumbsup`} /> </Button>
                    <Button className='icons-box-item' onClick={setFormForComment}><FaComment className='icon-comment' /></Button>
                    <Button className='icons-box-item' onClick={()=>setShareForm(!shareForm)}><FaShare className='icon-comment' /></Button>
                </div>
                <div className={commentForm || showUpdatePostForm ? `comment-box-open` : `comment-box-close`}>
                    {
                     commentForm && <form style={{position:"relative"}}>
                        <input type ='text' placeholder='Write a comment...' className='comment-input'
                        value = {commentValue} onChange={(e)=>setCommentValue(e.target.value)}/>
                        <Button style={{right:"0rem", top:"1.09rem", zIndex:"10", position:"absolute"}} onKeyPress={enterClicked1} onClick={postComments}>
                            <FaTelegramPlane className='submit-icon'/></Button>
                    </form>
                    }
                    <Popover
                        id={id3}
                        open={open3}
                        anchorEl={anchorEl3}
                        onClose={handleClose3}
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
                        <div className='delete-box' >
                        <input type ='text' placeholder='Write a comment...' className='comment-input'
                        value = {commentValue} onChange={(e)=>setCommentValue(e.target.value)}/>
                        <Button style={{float:"right", marginTop:"-1.85rem"}} onClick={postComments}>
                            <FaTelegramPlane className='submit-icon'/>
                        </Button>
                        </div>
                        </Typography>
                    </Popover>
                    {
                        showUpdatePostForm &&  <form style={{position:"relative"}}>
                        <input type ='text' className='comment-input' onKeyPress={enterClicked2}
                        value = {updateValue} onChange={(e)=>setUpdateValue(e.target.value)}/>
                        <Button style={{float:"right", marginTop:"-1.3rem"}} onClick={postUpdate}>
                            <FaTelegramPlane className='submit-icon'/>
                        </Button>
                    </form>
                    }
                    
                    <div className='users-comments'>
                        {comments.length > 0 && <h4>Comments</h4>}
                            {comments.map(comment =>{
                                const {_id} = comment
                                // const userFirstLetter = username.slice(0,1).toUpperCase()
                                // const userOtherLetters = username.slice(1)
                                // const newUsername = userFirstLetter + userOtherLetters
                                return <Comments key={_id} { ...comment} id={id}/>
                                // return <div className='comment-main' key={_id}>
                                    {/* { uId == userId && userUsername == username && <div className='comment-icons'>
                                        <button className='icon-btn'><FaPen  className='update-icon'/></button>
                                        <button className='icon-btn'><FaTrash  className='trash-icon'/></button>
                                    </div>} */}
                                    {/* { uId == userId && userUsername == username && <Button className='more-options'  onClick={()=>setShowCommentOptions(!showCommentOptions)}>
                                            <FaEllipsisH  />
                                        </Button>
                                    }
                                     {
                                        showCommentOptions && <div className='options-box'>
                                        <FaWindowClose onClick={()=>setShowCommentOptions(!showCommentOptions)} className='close-options'/><br />
                                        <Button onClick={setFormForUpdate}>Update Comment</Button><br />
                                        <Button onClick={()=>setShowDeletePostDialog(!showDeletePostDialog)}>Delete Comment</Button>
                                        <button className='icon-btn'><FaPen  className='update-icon'/></button>
                                        <button className='icon-btn'><FaTrash  className='trash-icon'/></button>
                                        </div>
                                    }
                                    <div className='comment-username'>{newUsername}</div>
                                    <div className='comment'>{userComment}</div>
                                <TimeAgo datetime={createdAt} locale='en_US' className='comment-timeago'/>
                                </div> */}
                            })}
                    </div>
                </div>
            </div>
            {
                shareForm && <div className='share-box'>
                    <div className='share-box-inner'>
                        <form className='share-input'>
                            <h4 className='title2'>Share this post</h4>
                        <FaWindowClose className='close-btn' onClick={()=>setShareForm(false)} />
                            <div className='shared-content'>
                                <div className='shared-item'>{description}</div>
                                <textarea type ='text' value={sharePostValue} onChange={(e)=>setSharePostValue(e.target.value)} className='share-input-box'></textarea>
                                    <Button className='share-btn'  onClick={sharePost}><FaShare className='icons2'/></Button>
                            </div>
                        </form>
                    </div>
                </div>
            }
    </div>
}

export default Posts




