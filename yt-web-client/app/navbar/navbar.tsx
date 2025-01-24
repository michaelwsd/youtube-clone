import Image from "next/image";
import Link from "next/link"; // allows us to interact with the router without having to refresh the page
import styles from "./navbar.module.css";

// this is a react server component, components will render on the server then displayed in browser
export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <Link href="/">
                {/* react element, we can just put a / because by default it will look for images inside the public directory */}
                <Image width={90} height={20} src="/youtube-logo.svg" alt="YouTube Logo"/>
            </Link>
        </nav>
    );
}