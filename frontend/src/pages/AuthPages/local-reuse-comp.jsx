import './style.css'

export function LabeledInput({ label, inputText, setInputText, secureTextEntry }) {
    return (
      <div className="RC_LabeledInput">
        <p>{label}</p>
        <input 
          type={secureTextEntry?"password":"text"}
          value={inputText} 
          onChange={(e) => setInputText(e.target.value)} 
        />
      </div>
    );
}
export function Divider(){
    return (
        <div className="RC_Divider">
            <line />
            <p>OR</p>
            <line />
        </div>
    )
}
export function SocialMediaLinkbutton({image,text,linkTo}){
    return(
        <button className="RC_SocialMediaLinkbutton">
            <img src={image}/>
            <p>{text}</p>
        </button>
    )
}