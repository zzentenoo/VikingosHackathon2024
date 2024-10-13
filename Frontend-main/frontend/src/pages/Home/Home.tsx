import {LogButton} from "../../components";
import {ROUTES} from "../../routes";
import {useNavigate} from "react-router-dom";


function Home() {
    const navigate = useNavigate();
    return (
        <div className="pt-40 md:pt-10 flex flex-col text-center items-center font-rubik space-y-5 min-h-screen">
            <img src="/pal_icon.png" alt="FinPal img" className="w-1/2 max-w-xs h-auto" draggable="false"/>
            <h1 className="text-5xl">FINPAL</h1>
            <h2 className="text-gray-400 text-sm text ">Tu acompañante financiero personal</h2>
            <LogButton children={"SIGN UP"} color={"bg-[#FF0000] text-2xl text-white"} onClick={()=> navigate(ROUTES.SIGNUP)}/>
            <LogButton children={"LOG IN"} color={"bg-gray-400 text-2xl text-white"} onClick={()=> navigate(ROUTES.LOGIN)}/>
        </div>
    );
}

export default Home;