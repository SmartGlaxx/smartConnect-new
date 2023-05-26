import "./search.css"
import FuzzySearch from 'fuzzy-search'; // Or: var FuzzySearch = require('fuzzy-search');
import { UseAppContext } from '../../Contexts/app-context';
import ProfileImage from '../../assets/profile.jpg'
import { Link } from "react-router-dom";

const Search = ()=>{
    const {allUsers, setSearchTermValue, searchTermValue} = UseAppContext()
    const searchTermValueToLowerCase =  searchTermValue.toLowerCase()
   const foundUsers = allUsers.filter(user =>{
       if(user.firstname){
           return user.firstname.toLowerCase().startsWith(searchTermValueToLowerCase) || user.lastname.toLowerCase().startsWith(searchTermValueToLowerCase) || user.username.startsWith(searchTermValueToLowerCase)  

       }
   })


  return <div >
      { foundUsers.length > 0 ? foundUsers.map(user =>{
            
            const {_id, firstname, lastname, username, profilePicture} = user
            return<Link to={`/userprofile/${_id}/${username}`} className="profile-link"
             onClick={()=>setSearchTermValue('')} key={_id}>
                <div className="search-result"> 
                <div className="search-item-box">
                    <img src={profilePicture ? profilePicture : ProfileImage} className='search-img'/>
                    <div className="search-results">{firstname && lastname && `${firstname} ${lastname}`}</div>
                </div>
                </div>
            </Link>
        }) : <div>No users match your search</div>
      }
  </div>
}




export default Search