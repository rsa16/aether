"use client";

import styles from "./page.module.css"
import SplitType from "split-type"
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { sourceCodePro } from "./fonts";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

gsap.registerPlugin(Flip);
gsap.registerPlugin(useGSAP);

export default function Home() {
    const containerRef = useRef(null);
    const titleRef = useRef(null)
    const underScoreRef = useRef(null);

    const [loaded, setLoaded] = useState(false);
    const [displayUnderScore, setDisplayUnderScore] = useState(false);

    useEffect(() => {
        if (loaded) {
            setTimeout(() => {
                setDisplayUnderScore(!displayUnderScore);
            }, 500);
        }
    }, [displayUnderScore]);

    useGSAP(() => {
        const title = new SplitType(titleRef.current, { types: 'chars' });

        const underScoreState = Flip.getState([underScoreRef.current, titleRef.current]);
        
        const showInput = () => {
            setDisplayUnderScore(true);
            
            let underScoreState = Flip.getState([underScoreRef.current, titleRef.current]);
            gsap.set(`.${styles.inputContainer}`, { display: 'flex', opacity: 0 });
            gsap.set(underScoreRef.current, { opacity: 1 });

            const flipAnim = Flip.from(underScoreState, {
                duration: 1,
                targets: [underScoreRef.current, titleRef.current],
                ease: "expo.out",
                absolute: true
            });

            flipAnim.to(`.${styles.inputContainer}`, { opacity: 1 })
        };

        const fadeUnderScore = () => {
            showInput();
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
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className={styles.background}>
            <div className={sourceCodePro.className} id={styles.title}>
                <h1 ref={titleRef}>
                    aether
                </h1>
                <span ref={underScoreRef} style={{ display: 'none', opacity: 0 }}>
                    {displayUnderScore ? "_" : '\u00A0'}
                </span>
            </div>
            <div className={styles.inputContainer} style={{ display: 'none' }}>
                <input id={styles.inputBar} type="text" placeholder="press enter to search..."></input>
                <div id={styles.searchBtn}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} inverse/>
                </div>
            </div>
        </div>
    )
}