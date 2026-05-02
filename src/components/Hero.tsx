import React, { useEffect, useRef } from 'react'

const Hero = () => {

    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(()=> {
        if(videoRef.current) {
            videoRef.current.playbackRate = 2;

            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
            playPromise.catch(() => {
            console.log('Autoplay bloqué');
      });
    }

        }
    }, [])

  return (
    <section id='hero'>
        <div>
            <h1>MacBook Pro</h1>
            <img src="/title.png" alt="MacBook" />
        </div>
        <video ref={videoRef} src="/videos/hero.mp4" autoPlay playsInline muted>Votre navigateur ne supporte pas la vidéo.</video>
        <button>Buy</button>
        <p>From $1599 to $133/mo for 12 months
        </p>
    </section>
  )
}

export default Hero