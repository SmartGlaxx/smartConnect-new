import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import './login.css'
import API from '../../../Utils/api';
import { Button, Grid} from '@material-ui/core'
import { useState, useEffect } from 'react'
import {FaExclamationCircle, FaLeaf} from 'react-icons/fa'
import Axios from 'axios'
import {Link, useParams} from 'react-router-dom'
import { UseAppContext } from '../../../Contexts/app-context'
import LoadingIcons from 'react-loading-icons'
import { ParticlesComponent, TransparentLoader } from '../../../Components';

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
      transform : "translate(-50%)",
      zIndex : "10"
    },
  }));
  

const Login =()=>{
    const {loading, setTransparentLoading, transparentLoading, loggedIn, setCurrentUser, currentUser, setLoggedIn} = UseAppContext()
    const [error, setError] = useState({status: false, msg :''})
    const [signedupSuccessful, setSignedupSuccessful] = useState(false)
    const [formValues, setFormValues] = useState({
        emailOrUsername : '',
        password : ""
    })

    //Snackbar Alert start
    const classes = useStyles();
    const {activity} = useParams() 
    
  const [open, setOpen] = React.useState(false);
  
  const handleError = (status, message) => {
    setOpen(true);
    setError({status : status, msg : message})
    setTransparentLoading(false)
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  //Snackbar Alert ends
// console.log("new signuo", signupSuccessful)
  useEffect(()=>{
    setTransparentLoading(false)
  },[])

    const setLoginValues =(value, loginData)=>{
        setCurrentUser(loginData)
        setLoggedIn(value)
        setTransparentLoading(false)
    
    }
    const setValues =(e)=>{
        const name = e.target.name
        const value = e.target.value
        setFormValues(prev => {
            return{...prev, [name] : value}
        })
    }
 
    // Enter key to submit
    const enterClicked =(e)=>{
        if(e.charCode === 13){
            submit(e)
          }
    }
    const submit = async(e)=>{
         e.preventDefault()
        setTransparentLoading(true)
        const {emailOrUsername, password} = formValues
        if(!emailOrUsername || !password){
            setError({status : true, msg : "Please enter E-mail or Username and Password"})
            setTimeout(()=>{
                setError({status : false, msg :''})
            }, 4000)
        }
            const options = {
                url: `${API}/auth/login`,
                method : "POST",
                headers : {
                    "Accept" : "application/json",
                    "Content-Type" : "application/json;cjarset=UTF-8"
                },
                data:{
                    emailOrUsername : emailOrUsername,
                    password : password
                }
            }
           
            setTimeout(()=>{
              setError({status : true, msg :"Please check your network connection"})
            },10000)
            setTimeout(()=>{
              setError({status : false, msg :""})
            },16000)
            const result = await Axios(options)
            
           
            const requestResponse = result.data.response
            if(requestResponse === 'Success'){
                const {loginData} = result.data
                setLoginValues(true, loginData)
                return window.location.href = '/'
            }else if(requestResponse === 'Fail'){
                const {message} = result.data
                handleError(true, message)
                setTimeout(()=>{
                    setError({status : false, msg :''})
                }, 4000)
            }
    }

   

//scroll to top of page
useEffect(() => {
    window.scrollTo(0, 0)
    if(activity == "signup-successful-FSGDNHFGdgoeskpagesreASFNDGFHDSAEOFVGSBFafsSDAFGIUNJimdsfgoeskpagesreASFNDGFHDSAEOFVGSBFafsndgmosagFSGDNHFGdgoeskpagesreASFNDGFHDSAEOFVGSBFafsndgmosagFSGDNHFG"){
      setSignedupSuccessful(true)
      setTimeout(() => {
        setSignedupSuccessful(false)
      }, 6000);
    }
    
  }, [])

    if(loading){
        return <div style={{width: "100%",height : "100vh", 
        display: 'grid', placeItems: "center"}}>
           <LoadingIcons.Puff       stroke="#555" strokeOpacity={.9} />
       </div>
    }

    return (
    <Grid className='login' container>
    <ParticlesComponent />

        <Grid className='login-left' item xs={12} sm={6} >
            <div className='title'>Smart Connect</div>
        </Grid>
        <Grid className='login-right' item xs={12} sm={6} >
            {
              signedupSuccessful &&
              <div className={classes.root}>
              <Alert severity="success">Signup Successfull. Please Sign-in</Alert>
            </div>
            }
            {
                error.status && <div className={classes.root}>
                <Alert severity="error">{error.msg}</Alert>
              </div>
                
            }
            {
              transparentLoading && <TransparentLoader />
            }
            <div>
                 <h3 className='page-title'>Welcome Back</h3>
                <input className='input' value ={formValues.emailOrUsername} onKeyPress={enterClicked} onChange={setValues} 
                 type='text' name='emailOrUsername' placeholder='E-mail/Username' required/>
                <input className='input' value ={formValues.password} onKeyPress={enterClicked} onChange={setValues} 
                type='password' name='password' placeholder='Password' required/>
              <div className='auth-btns'>
                <span className='auth-login-btn2' onClick={submit}>Sign in</span>
                {/* <Link to ='/signup' className='auth-login-btn1'>Sign-up</Link> */}
              </div>
              <div className='auth-alt'>New user? <Link to='/signup' className='auth-signup-btn' >Register</Link> an account</div>
            </div>
        </Grid>
    </Grid>
)}

export default Login







