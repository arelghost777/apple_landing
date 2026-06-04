import React, { useRef } from 'react';
import { performanceImages, performanceImgPositions } from '../constants';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Performance = () => {
    const sectionRef = useRef(null);

    useGSAP(() => {
        // 1. Text animation
        gsap.fromTo(
            ".content p",
            { opacity: 0, y: 24 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: '.content p',
                    start: "top bottom",
                    end: "top center",
                    scrub: true,
                    invalidateOnRefresh: true,
                },
            }
        );

        // 2. Desktop-only image timeline via gsap.matchMedia
        const mm = gsap.matchMedia();

        mm.add("(min-width: 1025px)", () => {
            const tl = gsap.timeline({
                defaults: { ease: "power1.inOut", duration: 2, overwrite: "auto" },
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
            });

            performanceImgPositions.forEach((pos) => {
                if (pos.id === 'p5') return;

                const toVars: gsap.TweenVars = { y: 0, autoAlpha: 1 };
                if (pos.left !== undefined) toVars.left = `${pos.left}%`;
                if (pos.right !== undefined) toVars.right = `${pos.right}%`;
                if (pos.bottom !== undefined) toVars.bottom = `${pos.bottom}%`;
                if ('transform' in pos && pos.transform !== undefined) {
                    toVars.transform = pos.transform;
                }

                // FIX: set intégré dans la timeline pour un cleanup propre
                tl.set(`.${pos.id}`, { y: 100, autoAlpha: 0 })
                  .to(`.${pos.id}`, toVars, 0);
            });

            return () => tl.kill();
        });

    }, { scope: sectionRef }); // Plus besoin de [isMobile] en dépendance

    return (
        <section id="performance" ref={sectionRef}>
            <h2>Next-level graphics performance. Game on.</h2>

            <div className="wrapper">
                {performanceImages.map(({ id, src }) => (
                    <img
                        key={id}
                        className={id}
                        src={src}
                        alt={`Performance ${id}`}
                    />
                ))}
            </div>

            <div className="content">
                <p>
                    Run graphics-intensive workflows with a responsiveness that keeps up with your imagination.
                    The M4 family of chips features a GPU with a second-generation hardware-accelerated ray tracing
                    engine that renders images faster, so{' '}
                    <span className="text-white">
                        gaming feels more immersive and realistic than ever.
                    </span>{' '}
                    And Dynamic caching optimize fast on-chip memory to dramatically increase average GPU utilization
                    -- driving a huge performance boost for the most demanding pro apps and games.
                </p>
            </div>
        </section>
    );
};

export default Performance;