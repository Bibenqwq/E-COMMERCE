import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ShoeMotion } from '../components/launch/SneakerScene';

gsap.registerPlugin(ScrollTrigger);

type LaunchScrollRefs = {
  tour: RefObject<HTMLElement | null>;
  featureStage: RefObject<HTMLElement | null>;
  featureTrack: RefObject<HTMLDivElement | null>;
  progress: RefObject<HTMLSpanElement | null>;
  runnerProgress: { current: { value: number } };
  callouts: RefObject<HTMLDivElement | null>;
  shoeMotion: { current: ShoeMotion };
};

export function useLaunchScroll({
  tour,
  featureStage,
  featureTrack,
  progress,
  runnerProgress,
  callouts,
  shoeMotion,
}: LaunchScrollRefs) {
  useEffect(() => {
    const tourElement = tour.current;
    const stage = featureStage.current;
    const track = featureTrack.current;
    const progressElement = progress.current;
    const calloutContainer = callouts.current;

    if (!tourElement || !stage || !track || !progressElement || !calloutContainer) return;

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const tourTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: tourElement,
            pin: true,
            pinType: 'transform',
            scrub: 1,
            start: 'top top',
            end: '+=2400',
            invalidateOnRefresh: true,
          },
        });

        tourTimeline
          .to(shoeMotion.current, {
            rotationY: Math.PI * 1.35,
            rotationX: 0.22,
            rotationZ: -0.1,
            cameraZ: 3.15,
            duration: 0.55,
            ease: 'none',
          }, 0)
          .to(shoeMotion.current, {
            rotationY: Math.PI * 2,
            rotationX: 0.12,
            rotationZ: -0.08,
            cameraZ: 4.5,
            duration: 0.45,
            ease: 'none',
          }, 0.55)
          .fromTo('[data-callout="0"]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.16 }, 0.08)
          .to('[data-callout="0"]', { autoAlpha: 0, y: -12, duration: 0.12 }, 0.29)
          .fromTo('[data-callout="1"]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.16 }, 0.36)
          .to('[data-callout="1"]', { autoAlpha: 0, y: -12, duration: 0.12 }, 0.61)
          .fromTo('[data-callout="2"]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.16 }, 0.68);

        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const featuresTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            pin: true,
            pinType: 'transform',
            scrub: 1,
            start: 'top top',
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
          },
        });

        featuresTimeline
          .to(track, { x: () => -distance(), ease: 'none' }, 0)
          .to(progressElement, { scaleX: 1, ease: 'none' }, 0)
          .fromTo(
            runnerProgress.current,
            { value: 0 },
            { value: 1, ease: 'none' },
            0,
          )
          .fromTo(
            '.feature-air-flow',
            { x: -110 },
            { x: 145, ease: 'none', duration: 0.22 },
            0.02,
          );

        return () => {
          tourTimeline.scrollTrigger?.kill();
          featuresTimeline.scrollTrigger?.kill();
        };
      });

      media.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.to(shoeMotion.current, {
          rotationY: Math.PI * 1.15,
          rotationX: 0.1,
          rotationZ: -0.06,
          cameraZ: 3.5,
          ease: 'none',
          scrollTrigger: {
            trigger: tourElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        });
      });
    });

    return () => context.revert();
  }, [callouts, featureStage, featureTrack, progress, runnerProgress, shoeMotion, tour]);
}
