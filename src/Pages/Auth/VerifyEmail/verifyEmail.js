import { useParams } from "react-router-dom"
import Axios from 'axios'
import API from "../../../Utils/api"

const VerifyEmail = ()=>{
    const {userId, username} = useParams()

    //check if id exists

    const verifyUserEmail = async(e)=>{
        //setLoading(true)
        e.preventDefault()
            const options = {
                url: `${API}/verifyemail/${userId}/${username}`,
                method : "PATCH",
                headers : {
                    "Accept" : "application/json",
                    "Content-Type" : "application/json;cjarset=UTF-8"
                },
                
            }

            // setTimeout(()=>{
            //   setError({status : true, msg :"Please check your network connection"})
            // },10000)
            // setTimeout(()=>{
            //   setError({status : false, msg :""})
            // },16000)
            const result = await Axios(options)
            const {response, singupdData} = result.data
            // if(response === 'Success'){
            //     setCurrentUser(singupdData)
            //     // return window.location.href = '/'
            //     setAlertMsg({status : true, msg : "Please check your email to verify your account"})
                
            // }else if(response === 'Fail'){
            //     const {message} = result.data
            //     handleError(true, message)
            //     setTimeout(()=>{
            //         setError({status : false, msg :''})
            //     }, 4000)
            // }
    }
    

    return <div>
        <form>

            <button onClick={verifyUserEmail}>Email Verified</button>
        </form>
    </div>
}

export default VerifyEmail