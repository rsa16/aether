"use client";

import styles from "./page.module.css"
import SplitType from "split-type"
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { sourceCodePro } from "./fonts";
import { faMagnifyingGlass, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

gsap.registerPlugin(Flip);
gsap.registerPlugin(useGSAP);

export default function Home() {
    const titleRef = useRef(null)
    const underScoreRef = useRef(null);
    const inputRef = useRef(null);

    const [loaded, setLoaded] = useState(false);
    const [displayUnderScore, setDisplayUnderScore] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);

    useGSAP(() => {
        if (inputFocused) {
            gsap.to(`.${styles.inputContainer}`, {
                width: "80%",
                ease: "expo.out",
                "--bgOpacity": 1
            });

        } else {
            gsap.to(`.${styles.inputContainer}`, {
                width: "40%",
                ease: "expo.out",
                "--bgOpacity": 0
            });
        }
    }, [inputFocused])

    useEffect(() => {
        if (loaded) {
            setTimeout(() => {
                setDisplayUnderScore(!displayUnderScore);
            }, 300);
        }
    }, [displayUnderScore]);

    useGSAP(() => {
        const title = new SplitType(titleRef.current, { types: 'chars' });

        const underScoreState = Flip.getState([underScoreRef.current, titleRef.current]);
        gsap.from(`.${styles.bgBlob}`, { 
            opacity: 0, 
            delay: 3, 
            ease: "expo.out", 
            duration: 2
        });

        gsap.from(`.${styles.footer}`, { 
            opacity: 0, 
            delay: 3.3, 
            ease: "expo.out", 
            duration: 1
        });
        
        const showInput = () => {
            setDisplayUnderScore(true);

            let underScoreState = Flip.getState([underScoreRef.current, titleRef.current]);
            gsap.set(`.${styles.inputContainer}`, { display: 'flex', opacity: 0 });

            Flip.from(underScoreState, {
                duration: 1,
                targets: [underScoreRef.current, titleRef.current],
                ease: "expo.out",
                absolute: true,
                onComplete: () => {
                    gsap.to(`.${styles.inputContainer}`, { opacity: 1 });
                    setLoaded(true);
                    setDisplayUnderScore(false);
                }
            })
        };

        const fadeUnderScore = () => {
            gsap.to(underScoreRef.current, {
                opacity: 1,
                ease: "ease.out",
                duration: 0.3,
                onComplete: showInput
            });
        };

        const moveTitle = () => {
            gsap.set(underScoreRef.current, {
                display: 'block',
            });

            underScoreRef.current.innerHTML = "_";

            Flip.from(underScoreState, {
                duration: 0.5,
                targets: [underScoreRef.current, titleRef.current],
                ease: "expo.out",
                absolute: true,
                onComplete: fadeUnderScore
            });
        };

        gsap.from(title.chars, {
            y: 200,
            opacity: 0,
            stagger: 0.05,
            duration: 0.7,
            ease: "expo.out",
            onComplete: moveTitle
        });
    });

    const hotKeyPress = (e) => {
        switch (e.key) {
            case "Enter":
                if (inputFocused)
                    inputRef.current.blur();
                else
                    inputRef.current.focus();

                break;

            case "Escape":
                inputRef.current.blur();
                break;

            default:
                break;
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", hotKeyPress);
        return () => window.removeEventListener("keydown", hotKeyPress);
    }, [inputFocused]);

    return (
        <div className={styles.background}>
            <div className={sourceCodePro.className} id={styles.title}>
                <h1 ref={titleRef}>
                    aether
                </h1>
                <span ref={underScoreRef} style={{ display: 'none', opacity: 0 }}>
                    {displayUnderScore ? "_" : '\u00A0'}
                </span>
            </div>
            <div className={styles.inputContainer} style={{ display: 'none' }}>
                <input
                    ref={inputRef}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    id={styles.inputBar}
                    type="text"
                    placeholder={`press enter to ${(inputFocused) ? "search" : "focus"}...`}>
                </input>
                <div id={styles.searchBtn}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} inverse />
                </div>
            </div>
            <div className={styles.bgBlob}></div>

            <footer className={styles.footer}>
                <div className={styles.footerCenter}>
                    <span>made by rsa16 with 💖</span>
                </div>

                <FontAwesomeIcon id={styles.settingsBtn} icon={faGear}/>
            </footer>
        </div>
    )
}