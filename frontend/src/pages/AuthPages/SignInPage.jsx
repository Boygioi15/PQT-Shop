import { useState, useEffect } from "react";
import validator from "validator";

import { Divider, LabeledInput, SocialMediaLinkbutton } from "./local-reuse-comp";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
 
import logoFacebook from "../../assets/logoFacebook.png";
import logoGoogle from "../../assets/logoGoogle.png";
import logoPhone from "../../assets/logoPhone.png";
import signUpSucess from "../../assets/signUpSuccess.png";

import { FaArrowLeft } from "react-icons/fa";

import './style.css'
const phoneRegex = /^\d{10}$/;

export function SignInPage_Email({signUpLink,phoneLink,homePageLink}){
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [enabled, setEnabled] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        if(account.trim() === "" || password.trim() === "" ){
            setEnabled(false);
            return;
        }
    }, [account,password]);
    const handleSubmit = () => {
        //send request to be to check credential
    }
    return(
        <form className="AuthForm">
            <FaArrowLeft onClick={()=>navigate(homePageLink)} className="returnIcon big-icon interactive-icon"/>
            <p className="formTitle">Đăng nhập</p>
            <div className="upper">
                <LabeledInput label="Email/SĐT" inputText={account} setInputText={setAccount} />
                <LabeledInput label="Mật khẩu" inputText={password} setInputText={setPassword} secureTextEntry={true}/>
                <button onClick={handleSubmit}className="confirmButton" disabled={!enabled}>Đăng nhập</button>
                <NavLink className="NavLink" to={signUpLink} >Bạn chưa có tài khoản? Đăng kí</NavLink>
            </div>
            <Divider />
            <div className="Social-Media-Group">    
                <SocialMediaLinkbutton image={logoFacebook} text="Tiếp tục với Facebook"/>
                <SocialMediaLinkbutton image={logoGoogle} text="Tiếp tục với Google"/>
                <SocialMediaLinkbutton image={logoPhone} text="Tiếp tục với SMS"/>
            </div>
        </form>
    )
}


