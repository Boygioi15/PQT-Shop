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

export function SignUpPage_Init({returnLink,loginLink,nextLink}){
    const [identifier, setIdentifier] = useState("");
    const [enabled, setEnabled] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        if(identifier.trim() === ""){
            setEnabled(false);
            return;
        }
        if(validator.isEmail(identifier)){
            setEnabled(true);
            return;
        }
        if(phoneRegex.test(identifier)){
            setEnabled(true);
            return;
        }
        setEnabled(false);
    }, [identifier]);
    const handleSubmit = () => {
        console.log(nextLink)
        if(validator.isEmail(identifier)){
            navigate(nextLink+"Email")
        }else if(phoneRegex.test(identifier)){
            navigate(nextLink+"Phone")
        }
    }
    return(
        <form className="AuthForm">
            <FaArrowLeft onClick={()=>navigate(returnLink)} className="returnIcon big-icon interactive-icon"/>
            <p className="formTitle">Đăng ký</p>
            <div className="upper">
                <LabeledInput label="Email/SĐT" inputText={identifier} setInputText={setIdentifier} />
                <button onClick={handleSubmit}className="confirmButton" disabled={!enabled}>Tiếp tục</button>
                <NavLink className="NavLink" to={loginLink} >Bạn đã có tài khoản? Đăng nhập</NavLink>
            </div>
            <Divider />
            <div className="Social-Media-Group">    
                <SocialMediaLinkbutton image={logoFacebook} text="Tiếp tục với Facebook"/>
                <SocialMediaLinkbutton image={logoGoogle} text="Tiếp tục với Google"/>
            </div>
        </form>
    )
}

export function SignUpPage_Verify({returnLink,nextLink}){
    const navigate = useNavigate()
    const { method } = useParams();
    const [code, setCode] = useState("");
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        if(code.trim()===""){
            setEnabled(false)
            return;
        }
        if(code.length!==6){
            setEnabled(false)
            return;
        }
        setEnabled(true)
    }, [code]);
    const handleSubmit = () => {
        if(code.trim()===""){
            return;
        }
        if(code.length!==6){
            return;
        }
        navigate(nextLink)
    }
    return(
        <form className="AuthForm">
            <FaArrowLeft onClick={()=>navigate(returnLink)} className="returnIcon big-icon interactive-icon"/>
            <p className="formTitle">Nhập mã code qua {method}</p>
            <div className="upper">
                <LabeledInput label="Code" inputText={code} setInputText={setCode} />
                <button onClick={handleSubmit}className="confirmButton" disabled={!enabled}>Xác minh</button>
                <NavLink className="NavLink" >Bạn chưa nhận được mã code, thử lại?</NavLink>
            </div>
        </form>
    )
}
export function SignUpPage_VerifySucessful({nextLink}){
    const handleSubmit = () => {
        navigate(nextLink)
    }
    return(
        <form className="AuthForm">
            <p className="formTitle">Xác minh thành công {method}</p>
            <img src={signUpSucess}/>
            <div className="upper">
                <button onClick={handleSubmit} className="confirmButton" >Tiếp tục</button>
            </div>
        </form>
    )
}
