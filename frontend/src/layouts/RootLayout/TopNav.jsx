import { IsNotEmpty, IsString } from "class-validator";
import { useState, useEffect } from "react";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosArrowDown,
} from "react-icons/io";
import {
  FaRegUser,
  FaRegHeart,
  FaShoppingCart,
  FaSearch,
} from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

import axios from "axios";
import "./style.css";
import { useNavigate } from "react-router-dom";
export default function TopNav() {
  return (
    <div>
      <EventBanner />
      <Shortcut />
    </div>
  );
}

function EventBanner() {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const showPreviousEvent = () => {
    if (currentIndex == 0) {
      setCurrentIndex(events.length - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };
  const showNextEvent = () => {
    if (currentIndex == events.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };
  useEffect(() => {
    // Function to fetch events from the backend
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/event");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [events]);
  //console.log(events.length)
  return (
    <>
      {events.length > 0 ? (
        <div className="TopNav_EventBanner">
          <IoIosArrowBack
            onClick={showPreviousEvent}
            className="big-icon interactive-icon"
          />

          <div className="TopNav_EventBanner">
            <p className="EventBanner_Description">
              {events[currentIndex].description}
            </p>
            <button className="EventBanner_Button">Xem ngay</button>
          </div>
          <IoIosArrowForward
            onClick={showNextEvent}
            className="big-icon interactive-icon"
          />
        </div>
      ) : (
        <div className="TopNav_EventBanner">
          <p className="EventBanner_Description1">
            Hiện tại đang không có chương trình sự kiện nào
          </p>
        </div>
      )}
    </>
  );
}
function Shortcut() {
  const navigate = useNavigate();
  return (
    <div className="TopNav_Shortcut">
      <div className="Shortcut_left">
        <span className="Shortcut_Homepage">PQTSport</span>
        <NormalCategoryShortcut label="Tất cả" />
        <DropdownCategoryShortcut label="Giày" />
        <DropdownCategoryShortcut label="Dép" />
        <NormalCategoryShortcut label="Nam" />
        <NormalCategoryShortcut label="Nữ" />
      </div>
      <div className="Shortcut_right">
        <QuickSearchBar />
        <IconShortcut
          initIcon={<FaShoppingCart className="ShortcutIcon" />}
          number={5}
        />
        <IconShortcut
          initIcon={<FaRegUser className="ShortcutIcon" />}
          action={() => navigate("/auth/sign-up")}
        />
        <IconShortcut
          initIcon={<FaRegHeart className="ShortcutIcon" />}
          number={3}
        />
      </div>
    </div>
  );
}
function Shortcut() {
  return (
    <div className="TopNav_Shortcut">
      <div className="Shortcut_left">
        <span className="Shortcut_Homepage">PQTSport</span>
        <NormalCategoryShortcut label="Tất cả" />
        <DropdownCategoryShortcut label="Giày" />
        <DropdownCategoryShortcut label="Dép" />
        <NormalCategoryShortcut label="Nam" />
        <NormalCategoryShortcut label="Nữ" />
      </div>
      <div className="Shortcut_right">
        <QuickSearchBar />
        <IconShortcut
          initIcon={<FaShoppingCart className="ShortcutIcon" />}
          number={5}
        />
        <IconShortcut initIcon={<FaRegUser className="ShortcutIcon" />} />
        <IconShortcut
          initIcon={<FaRegHeart className="ShortcutIcon" />}
          number={3}
        />
      </div>
    </div>
  );
}
function IconShortcut({ initIcon, number, action }) {
  return (
    <div onClick={action} className="Shortcut_Icon onHover">
      {initIcon}
      {number && number > 0 && <div>{number}</div>}
    </div>
  );
}
