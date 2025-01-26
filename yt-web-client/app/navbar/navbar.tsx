'use client';
import Image from "next/image";
import Link from "next/link"; // allows us to interact with the router without having to refresh the page
import styles from "./navbar.module.css";
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";

// this is a react server component, components will render on the server then displayed in browser
export default function Navbar() {
    // initialise initial user state
    const [user, setUser] = useState<User | null>(null); // setUser is a function that changes the state of user
    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user); // onAuthStateChangedHelper returns a function that unsubscribes the user, which is setUser in this case
        });

        return () => unsubscribe();
    });

    return (
        <nav className={styles.nav}>
            <Link href="/">
                {/* react element, we can just put a / because by default it will look for images inside the public directory */}
                <Image width={90} height={20} src="/youtube-logo.svg" alt="YouTube Logo"/>
            </Link>
            <SignIn user={user}/>
        </nav>
    );
}