import React, {useEffect, useState} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import LoadingIcons from 'react-loading-icons'
import './loader.css'
import { ParticlesComponent } from '../';
import { Grid } from '@material-ui/core';


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
  }));
  


const TransparentLoader = ()=>{
    const [error, setError] = useState({status: false, msg :''})

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
   
   


    //  useEffect(()=>{
    //     const timeout1 = setTimeout(()=>{
    //         setError({status : true, msg :"Please check your network connection"})
    //     },10000)
    //     const timeout2 = setTimeout(()=>{
    //         setError({status : false, msg :""})
    //     },16000)
    //     return ()=>clearTimeout(timeout1)
    //  },[])

    //  //particles js
    //  const particlesInit = (main) => {
    //   console.log(main);
  
    //   // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    // };
  
    // const particlesLoaded = (container) => {
    //   // console.log(container);
    // };


    return <>
     {/* <ParticlesComponent /> */}
     <Grid container style={{width: "100vw",height : "100vh", position:"fixed", left: "0", 
    background:"none",  margin:"0", padding:"2rem", zIndex:"0",
     placeContent: "center", placeItems:"center"}}>
         <Grid item sm={6}></Grid>
         <Grid item sm={6} style={{width:"25rem", height:"17rem", background:"rgba(30,35,100,0.6)",
        borderRadius:"0.6rem",display: 'grid', margin:"0", placeContent: "center", placeItems:"center"}}>
            <LoadingIcons.Puff  stroke="var(--color3)" strokeOpacity={.9} />
         </Grid>
   </Grid>
    {/* <div style={{width: "100vw",height : "100vh", position:"fixed", left: "0", 
    background:"none",  display: 'grid', margin:"0",
     placeContent: "center", placeItems:"center"}}>

         <div style={{width:"25rem", height:"17rem", background:"rgba(30,35,100,0.6)",
        borderRadius:"1rem",display: 'grid', margin:"0", placeContent: "center", placeItems:"center"}}>
            <LoadingIcons.Puff  stroke="var(--color3)" strokeOpacity={.9} />
         </div>
   </div> */}
   </>
}

export default TransparentLoader