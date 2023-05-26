import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import './signup.css'
import API from '../../../Utils/api';
import { Button, Grid} from '@material-ui/core'
import { useState, useEffect } from 'react'
import {FaExclamationCircle, FaWindowClose} from 'react-icons/fa'
import Axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
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

const Signup =()=>{
    const {loggedIn, loading,  setTransparentLoading, transparentLoading,
      setCurrentUser, currentUser} = UseAppContext()
    const [error, setError] = useState({status: false, msg :''})
    // const [alertMsg, setAlertMsg] = useState({status : false, msg : ''})
    const [formValues, setFormValues] = useState({
        firstname : "",
        lastname : "",
        username : '',
        email : '',
        password1 : "",
        password2 : "",
    })
    const navigate = useNavigate()

    //Snackbar Alert start
    const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  
  const handleError = (status, message) => {
    setOpen(true);
    setError({status : status, msg : message})
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  //Snackbar Alert ends

  const setSignupValues =(data)=>{
    setCurrentUser(data) 
    setTransparentLoading(false)
  }


  //close alert box
//   const closeAlertBox = ()=>{
//     setAlertMsg(false)
// }

    const setValues =(e)=>{
        let name = e.target.name
        let value = e.target.value
        if(name=='username'){
            value = value.replace(/\s+/g, '')
        }
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
    const signedup= "signup-successful-FSGDNHFGdgoeskpagesreASFNDGFHDSAEOFVGSBFafsSDAFGIUNJimdsfgoeskpagesreASFNDGFHDSAEOFVGSBFafsndgmosagFSGDNHFGdgoeskpagesreASFNDGFHDSAEOFVGSBFafsndgmosagFSGDNHFG"

    const submit = async(e)=>{
        e.preventDefault()
        const { firstname, lastname, username, email, password1, password2} = formValues
        if(!firstname){
          setError({status : true, msg : "Please enter Your first name"})
          setTimeout(()=>{
             return setError({status : false, msg :''})
          }, 4000)
       }else if(!lastname){
          setError({status : true, msg : "Please enter Your last name"})
          setTimeout(()=>{
              setError({status : false, msg :''})
          }, 4000)
      }else if(!username){
          setError({status : true, msg : "Please enter Your Username"})
          setTimeout(()=>{
              setError({status : false, msg :''})
          }, 4000)
      }else if(!email){
          setError({status : true, msg : "Please enter Your E-mail"})
          setTimeout(()=>{
              setError({status : false, msg :''})
          }, 4000)
      }else if(password2.length == 0 || password1.length == 0){
          setError({status : true, msg : "Please enter and comfirm your password"})
          setTimeout(()=>{
              setError({status : false, msg :''})
          }, 4000)
      } else if(password2.length < 8 || password1.length < 8){
        handleError(true, "Password Must be 8 characters long")
        setTimeout(()=>{
            setError({status : false, msg :''})
        }, 4000)
    }
        // if(!firstname || !lastname || !username || !email || !password1 || !password2){
        //   // handleError(true, "Please fill all fields")
        // } 
        else{
            if(password2 !== password1){
              handleError(true, "Password Mismatch")
              setTimeout(()=>{
                  setError({status : false, msg :''})
              }, 4000)
           }else{
          setTransparentLoading(true)
            const options = {
                url: `${API}/auth/register`,
                method : "POST",
                headers : {
                    "Accept" : "application/json",
                    "Content-Type" : "application/json;cjarset=UTF-8"
                },
                data:{
                    firstname : firstname, 
                    lastname : lastname,
                    username : username,
                    email : email,
                    password : password1
                }
            }

            setTimeout(()=>{
              setError({status : true, msg :"Please check your network connection"})
            },10000)
            setTimeout(()=>{
              setError({status : false, msg :""})
            },16000)
            const result = await Axios(options)
            const {response, singupdData} = result.data
            if(response === 'Success'){
                setSignupValues(singupdData)
                return window.location.href = `/login/${signedup}`
                // setAlertMsg({status : true, msg : "Please check your email to verify your account"})
                
            }else if(response === 'Fail'){
                const {message} = result.data
                handleError(true, message)
                setTimeout(()=>{
                    setError({status : false, msg :''})
                }, 4000)
            }

          }
        }
    }
//scroll to top of page
    useEffect(() => {
        window.scrollTo(0, 0)
        setTransparentLoading(false)
      }, [])
    
    if(loading){
        return <div style={{width: "100%",height : "100vh", 
        display: 'grid', placeItems: "center"}}>
           <LoadingIcons.Puff       stroke="#555" strokeOpacity={.9} />
       </div>
    }
  
    //particles js  
    // const particlesInit = (main) => {
    //   console.log(main);
  
    //   // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    // };
  
    // const particlesLoaded = (container) => {
    //   console.log(container);
    // };


    return (
    <Grid className='signup' container>
      <ParticlesComponent />
        <Grid className='signup-left' item xs={12} sm={6}>
            <div className='title'>Smart Connect</div>
        </Grid>
        <Grid className='signup-right' item xs={12} sm={6} >
            
            {
                error.status && <div className={classes.root}>
                <Alert severity="error">{error.msg}</Alert>
              </div>
            }
            {/* {
              alertMsg && <div className='' style={{width: "30rem", height: "10rem", 
              background: "var(--color)", color:"var(--color2)", position:"fixed", top:"5rem", left: "50%", transform : "translateX(-50%)"}}>
                <FaWindowClose size='23' className='close-useredit' onClick={closeAlertBox} />
                {alertMsg.msg}
              </div>
            } */}
            {
              transparentLoading && <TransparentLoader />
            }
            <div>
                 <h3 className='page-title'>Register</h3>
                 <input className='input' value ={formValues.firstname} onKeyPress={enterClicked}  onChange={setValues} type='text' name='firstname' placeholder='Firstname'/>
                 <input className='input' value ={formValues.lastname} onKeyPress={enterClicked}  onChange={setValues} type='text' name='lastname' placeholder='Lastname'/>
                <input className='input' value ={formValues.username} onKeyPress={enterClicked}  onChange={setValues} type='text' name='username' placeholder='Username'/>
                <input className='input' value ={formValues.email} onKeyPress={enterClicked}  onChange={setValues} type='email' name='email' placeholder='E-Mail'/>
                <input className='input' value ={formValues.password1} onKeyPress={enterClicked}  onChange={setValues} type='password' name='password1' placeholder='Password'/>
                <input className='input' value ={formValues.password2} onKeyPress={enterClicked}  onChange={setValues} type='password' name='password2' placeholder='Comfirm Password'/>
                {/* <Button className='btn'  onClick={submit}>Sign up</Button> */}
              <div className='auth-btns'>
                <span className='auth-signup-btn2' onClick={submit}>Sign up</span>
                {/* <Link to ='/login' className='auth-signup-btn1'>Login</Link> */}
              </div>
              <div className='auth-alt'>Already have an account? <br/><Link to='/login' className='auth-signup-btn' >Sign in</Link></div>
            </div>
        </Grid>
    </Grid>
)}

export default Signup