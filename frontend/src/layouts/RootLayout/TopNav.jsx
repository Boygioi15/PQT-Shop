import {IsNotEmpty, IsString} from 'class-validator'
import { useState, useEffect } from 'react';
import { IoIosArrowBack,IoIosArrowForward  } from "react-icons/io";

import axios from 'axios'
import './style.css'
export default function TopNav(){
    return (
        <div>
            <EventBanner />
            <Shortcut />
            <CategoryShortcut/>
        </div>
    )
}

function EventBanner(){
    const [events, setEvents] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const showPreviousEvent = () => {
        if(currentIndex==0){
            setCurrentIndex(events.length-1);
        }else{
            setCurrentIndex(currentIndex-1);
        }
    }
    const showNextEvent = () => {
        if(currentIndex==events.length-1){
            setCurrentIndex(0);
        }else{
            setCurrentIndex(currentIndex+1);
        }
    }
    useEffect(() => {
        // Function to fetch events from the backend
        const fetchEvents = async () => {
          try {
            const response = await axios.get('http://localhost:8000/api/event');
            setEvents(response.data); // Assigning the fetched list of events to the state
          } catch (error) {
            console.error('Error fetching events:', error);
          }
        };
    
        fetchEvents();
      }, []); 
      console.log(events.length)
      return (
        <>
            {events.length > 0 ? (
                <div className="TopNav"> 
                    <IoIosArrowBack onClick = {showPreviousEvent} className='big-icon interactive-icon'/>

                    <div className="TopNav_EventBanner">
                        <p className="EventBanner_Description">{events[currentIndex].description}</p>
                        <button className="EventBanner_Button">
                        Xem ngay
                        </button>
                    </div>
                    <IoIosArrowForward onClick = {showNextEvent} className='big-icon interactive-icon'/>
                </div>
            )
            :
            (
                <div className="TopNav">
                    <p className="EventBanner_Description1">Hiện tại đang không có chương trình sự kiện nào</p>
                </div> 
            )}
        </>
      )
}
function Shortcut(){

}
function CategoryShortcut(){

}