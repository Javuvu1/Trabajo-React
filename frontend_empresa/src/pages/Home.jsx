import { Outlet } from "react-router-dom"; // ✅ Correcto
import Menu from "../components/Menu";  

function Home(){
    return (
        <>
            <Menu/>
            <Outlet />
        </>
    );
}
export default Home;