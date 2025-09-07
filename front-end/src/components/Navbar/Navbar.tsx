import {SearchButton} from '@/components/Navbar/SearchButton';
import Logo from "@/components/Logo/Logo";
import Menu from "@/components/Navbar/Menu";
import CartIndicator from "@/components/Cart/CartIndicator";
import ProfileBtn from "@/components/Navbar/ProfileBtn";

async function Navbar() {

    return (
        <>
            <div className="header px-10 rounded-b shadow">
                <a className="menu-icon" href="#">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h8m-8 6h16"
                        />
                    </svg>
                </a>


                <Logo/>

                <Menu />

                <div className="header-icons">
                    <SearchButton/>

                    <ProfileBtn/>



                    <div>

                        <CartIndicator />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;