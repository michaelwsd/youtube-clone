'use client';
import { Fragment } from "react"; // Fragment avoids unnecessary wrappers
import { signInWithGoogle, signOut } from "../firebase/firebase";
import styles from "./sign-in.module.css";
import { User } from "firebase/auth";

interface SignInProps {
    user: User | null;
}

// takes in a user which would be a user object or null, render the page accordingly
export default function SignIn({ user }: SignInProps) {
    return (
        <Fragment>
            {
                user ? (
                    <button className={styles.signin} onClick={signOut}>
                        Sign Out
                    </button>
                ) : (
                    <button className={styles.signin} onClick={signInWithGoogle}>
                        Sign In
                    </button>
                )
            }
        </Fragment>
    )
}
