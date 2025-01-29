// use when the component requires client-side features like useState, useEffect or when the client needs to interact with the DOM
'use client'; // tells next.js that this component should be rendered on the client-side
import Image from "next/image";
import Link from "next/link"; // allows us to interact with the router without having to refresh the page
import styles from "./navbar.module.css";
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import Upload from "./upload";

// this is a react server component, components will render on the server then displayed in browser
// react compoent is simply a function that returns a part of the UI of a web application
export default function Navbar() {
    // initialise initial user state
    // setUser is a state setter functiont that we can use to update the state (user)
    const [user, setUser] = useState<User | null>(null); 
    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user); // returns a user object or null, call setUser to update state
            // react automatically re-render the component when setUser is called with the new value
        });
        
        // clean up
        // onAuthStateChangeHelper returns an unsubscribe function, which STOPS listening to auth state changes
        // this is called when the component unmounts (i.e. when we move to another page and this is no longer in the DOM)
        return () => unsubscribe();
    }, []); // this is the dependency array, useEffect will rerun if one of the dependencies has changed since the last render
            // since the array is empty, the effect will only run once when the component mounts and will not run again after

    return (
        <nav className={styles.nav}>
            <Link href="/">
            <Image width={90} height={20}
                src="/youtube-logo.svg" alt="YouTube Logo"/>
            </Link>
            { 
            user && <Upload />
            }
            <SignIn user={user} />
        </nav>
        );
}