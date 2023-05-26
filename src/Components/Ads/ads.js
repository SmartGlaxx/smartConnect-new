import { addsData, addsData2 } from "./adsData"
import './ads.css'
import { useEffect, useState } from "react";
import { UseAppContext } from "../../Contexts/app-context";

const Ads =()=>{
    const {currentUserParsed} = UseAppContext()
    const [item1, setItem1] = useState({})
    const [item2, setItem2] = useState({})
    const [item3, setItem3] = useState({})

//generate random advert1
    useEffect(()=>{
        const randomNum = (parseInt)((Math.random() * 14) + 1, 10);
         addsData.map(item => {
            if(item.id == randomNum){
                setItem1(item)
            }
        })
        
    },[currentUserParsed])

    //generate random number for advert 2
    useEffect(()=>{
        const randomNum = (parseInt)((Math.random() * 14) + 1, 10);
         addsData2.map(item => {
            if(item.id == randomNum){
                setItem2(item)
            }
        })
        
    },[currentUserParsed])

    useEffect(()=>{
        const randomNum = (parseInt)((Math.random() * 14) + 1, 10);
         addsData2.map(item => {
            if(item.id == randomNum){
                setItem3(item)
            }
        })
        
    },[currentUserParsed])

    const {id : randomId1, name : randomName1, img : randomImg1, desc : randomDesc1} = item1
    const {id : randomId2, name : randomName2, img : randomImg2, desc : randomDesc2} = item2
    const {id : randomId3, name : randomName3, img : randomImg3, desc : randomDesc3} = item3
let count  = 0
    return<div className="ad-container" >
        <div className="">
            <div className=" ad-item">
                <img src={randomImg1} alt={randomName1} className="ad-img-1"/>
            <div className="ad-img-1-after"></div>
            </div>
            <h3 className="sponsored ad-item">Sponsored</h3>
            <div className="ad-item">
                <div style={{display:"flex"}}>
                    <img src={randomImg2} alt={randomName2} className="ad-img-2 sm-items"/>
                    <h5 className="desc">{randomDesc2}</h5>
                </div>
            </div>
            <div className="ad-item">
                <div style={{display:"flex"}}>
                    <img src={randomImg3} alt={randomName3} className="ad-img-2 sm-items"/>
                    <h5 className="desc">{randomDesc3}</h5>
                </div>
            </div>
        </div>
    </div>
}


export default Ads