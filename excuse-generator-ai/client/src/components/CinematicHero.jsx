import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '../lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  .film-grain {
    position: absolute; inset: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 50; opacity: 0.05; mix-blend-mode: overlay;
    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-theme {
    background-size: 60px 60px;
    background-image: 
      linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  .text-3d-matte {
    color: #e3e7fc;
    text-shadow: 0 10px 30px rgba(227,231,252,0.2), 0 2px 4px rgba(227,231,252,0.1);
    padding: 0.1em 0;
  }

  .text-silver-matte {
    background: linear-gradient(180deg, #e3e7fc 0%, rgba(165,170,190,0.6) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transform: translateZ(0);
    filter: drop-shadow(0px 10px 20px rgba(227,231,252,0.15)) drop-shadow(0px 2px 4px rgba(227,231,252,0.1));
    padding: 0.1em 0;
    margin-top: -0.1em;
  }

  .text-card-silver-matte {
    background: linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transform: translateZ(0);
    filter: drop-shadow(0px 12px 24px rgba(0,0,0,0.8)) drop-shadow(0px 4px 8px rgba(0,0,0,0.6));
  }

  .premium-depth-card {
    background: linear-gradient(145deg, #1a1040 0%, #080e1c 100%);
    box-shadow: 
      0 40px 100px -20px rgba(0,0,0,0.9),
      0 20px 40px -20px rgba(0,0,0,0.8),
      inset 0 1px 2px rgba(214,146,255,0.15),
      inset 0 -2px 4px rgba(0,0,0,0.8);
    border: 1px solid rgba(214,146,255,0.08);
    position: relative;
  }

  .card-sheen {
    position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
    background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(214,146,255,0.06) 0%, transparent 40%);
    mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  .iphone-bezel {
    background-color: #111;
    box-shadow: 
      inset 0 0 0 2px #52525B, inset 0 0 0 7px #000, 
      0 40px 80px -15px rgba(0,0,0,0.9), 0 15px 25px -5px rgba(0,0,0,0.7);
    transform-style: preserve-3d;
  }

  .hardware-btn {
    background: linear-gradient(90deg, #404040 0%, #171717 100%);
    box-shadow: -2px 0 5px rgba(0,0,0,0.8), inset -1px 0 1px rgba(255,255,255,0.15), inset 1px 0 2px rgba(0,0,0,0.8);
    border-left: 1px solid rgba(255,255,255,0.05);
  }

  .screen-glare {
    background: linear-gradient(110deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 45%);
  }

  .widget-depth {
    background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
    box-shadow: 0 10px 20px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.05), inset 0 -1px 1px rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.03);
  }

  .floating-ui-badge {
    background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 100%);
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    box-shadow: 0 0 0 1px rgba(214,146,255,0.15), 0 25px 50px -12px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -1px 1px rgba(0,0,0,0.5);
    padding: 0.75rem 2.5rem 0.75rem 1rem !important;
  }

  .cta-btn-primary {
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
    color: #000000;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.8), 0 10px 30px -10px rgba(214,146,255,0.5), inset 0 2px 2px rgba(255,255,255,1);
  }
  .cta-btn-primary:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 0 1px rgba(255,255,255,1), 0 20px 40px -10px rgba(214,146,255,0.7), inset 0 2px 4px rgba(255,255,255,1);
  }

  .cta-btn-secondary {
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    background: rgba(255,255,255,0.05);
    color: #ffffff;
    border: 1px solid rgba(255,255,255,0.2);
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  .cta-btn-secondary:hover {
    transform: translateY(-4px);
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.3);
    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.2);
  }

  .progress-ring {
    transform: rotate(-90deg);
    transform-origin: center;
    stroke-dasharray: 402;
    stroke-dashoffset: 402;
    stroke-linecap: round;
  }
`;

/**
 * CinematicHero — GSAP-powered cinematic landing section for Excuse Generator AI.
 */
export default function CinematicHero({ className }) {
  const containerRef = useRef(null);
  const mainCardRef = useRef(null);
  const mockupRef = useRef(null);
  const requestRef = useRef(0);

  // Mouse-driven 3D tilt on the card
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.scrollY > window.innerHeight * 2) return;
      cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          mainCardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          mainCardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to(mockupRef.current, { rotationY: xVal * 12, rotationX: -yVal * 12, ease: 'power3.out', duration: 1.2 });
        }
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => { window.removeEventListener('mousemove', handleMouseMove); cancelAnimationFrame(requestRef.current); };
  }, []);

  // Cinematic GSAP scroll timeline
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const ctx = gsap.context(() => {
      gsap.set('.text-track', { autoAlpha: 0, y: 60, scale: 0.85, filter: 'blur(20px)', rotationX: -20 });
      gsap.set('.text-days', { autoAlpha: 1, clipPath: 'inset(-10% 100% -10% 0%)' });
      gsap.set('.main-card', { y: window.innerHeight + 200, autoAlpha: 1 });
      gsap.set(['.card-left-text', '.card-right-text', '.mockup-scroll-wrapper', '.floating-badge', '.phone-widget'], { autoAlpha: 0 });
      gsap.set('.cta-wrapper', { autoAlpha: 0, scale: 0.8, filter: 'blur(30px)' });

      const introTl = gsap.timeline({ delay: 0.3 });
      introTl
        .to('.text-track', { duration: 1.8, autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', rotationX: 0, ease: 'expo.out' })
        .to('.text-days', { duration: 1.4, clipPath: 'inset(-10% 0% -10% 0%)', ease: 'power4.inOut' }, '-=1.0');

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=7000',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      scrollTl
        .to(['.hero-text-wrapper', '.bg-grid-theme'], { scale: 1.15, filter: 'blur(20px)', opacity: 0.2, ease: 'power2.inOut', duration: 2 }, 0)
        .to('.main-card', { y: 0, ease: 'power3.inOut', duration: 2 }, 0)
        .to('.main-card', { width: '100%', height: '100%', borderRadius: '0px', ease: 'power3.inOut', duration: 1.5 })
        .fromTo('.mockup-scroll-wrapper',
          { y: 300, z: -500, rotationX: 50, rotationY: -30, autoAlpha: 0, scale: 0.6 },
          { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: 'expo.out', duration: 2.5 }, '-=0.8'
        )
        .fromTo('.phone-widget', { y: 40, autoAlpha: 0, scale: 0.95 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: 'back.out(1.2)', duration: 1.5 }, '-=1.5')
        .to('.progress-ring', { strokeDashoffset: 60, duration: 2, ease: 'power3.inOut' }, '-=1.2')
        .to('.counter-val', { innerHTML: 99, snap: { innerHTML: 1 }, duration: 2, ease: 'expo.out' }, '-=2.0')
        .fromTo('.floating-badge', { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: 'back.out(1.5)', duration: 1.5, stagger: 0.2 }, '-=2.0')
        .fromTo('.card-left-text', { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: 'power4.out', duration: 1.5 }, '-=1.5')
        .fromTo('.card-right-text', { x: 50, autoAlpha: 0, scale: 0.8 }, { x: 0, autoAlpha: 1, scale: 1, ease: 'expo.out', duration: 1.5 }, '<')
        .to({}, { duration: 2.5 })
        .set('.hero-text-wrapper', { autoAlpha: 0 })
        .set('.cta-wrapper', { autoAlpha: 1 })
        .to({}, { duration: 1.5 })
        .to(['.mockup-scroll-wrapper', '.floating-badge', '.card-left-text', '.card-right-text'], {
          scale: 0.9, y: -40, z: -200, autoAlpha: 0, ease: 'power3.in', duration: 1.2, stagger: 0.05,
        })
        .to('.main-card', {
          width: isMobile ? '92vw' : '85vw',
          height: isMobile ? '92vh' : '85vh',
          borderRadius: isMobile ? '32px' : '40px',
          ease: 'expo.inOut', duration: 1.8,
        }, 'pullback')
        .to('.cta-wrapper', { scale: 1, filter: 'blur(0px)', ease: 'expo.inOut', duration: 1.8 }, 'pullback')
        .to('.main-card', { y: -window.innerHeight - 300, ease: 'power3.in', duration: 1.5 });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('relative w-screen h-screen overflow-hidden flex items-center justify-center font-sans antialiased', className)}
      style={{ perspective: '1500px', background: '#080e1c' }}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-50" aria-hidden="true" />

      {/* Hero Text */}
      <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 will-change-transform">
        <h1 className="text-track gsap-reveal text-3d-matte text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tight mb-2">
          Never be speechless,
        </h1>
        <h1 className="text-days gsap-reveal text-silver-matte text-5xl md:text-7xl lg:text-[6rem] font-extrabold tracking-tighter">
          ever again.
        </h1>
      </div>

      {/* CTA Section */}
      {/* CTA Section */}
      <div className="cta-wrapper absolute inset-0 z-10 flex flex-col items-center justify-center text-center w-full px-6 gsap-reveal pointer-events-auto will-change-transform">
        <h2 className="text-5xl md:text-7xl lg:text-[7.5rem] font-black mb-8 tracking-tighter text-silver-matte leading-[0.95]">
          Get your <br className="md:hidden" />excuse.
        </h2>
        <p className="text-xl md:text-2xl lg:text-[1.75rem] mb-14 max-w-3xl mx-auto font-medium leading-[1.6]" style={{ color: 'rgba(214,146,255,0.8)' }}>
          Join thousands of creative minds using AI-powered excuses. Choose from 5 cinematic modes and never repeat yourself.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-center justify-center mt-4">
          <a href="#generator" className="cta-btn-primary flex items-center justify-center gap-3 px-10 h-16 rounded-full group no-underline w-full sm:w-auto">
            <span className="text-lg font-bold tracking-tight">Try It Now</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
          <a href="#" className="cta-btn-secondary flex items-center justify-center gap-3 px-10 h-16 rounded-full group no-underline w-full sm:w-auto">
            <span className="text-lg font-bold tracking-tight text-gray-300 group-hover:text-white transition-colors">See Examples</span>
          </a>
        </div>
      </div>

      {/* Foreground: The Deep Card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: '1500px' }}>
        <div
          ref={mainCardRef}
          className="main-card premium-depth-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[92vw] md:w-[85vw] h-[92vh] md:h-[85vh] rounded-[32px] md:rounded-[40px]"
        >
          <div className="card-sheen" aria-hidden="true" />

          <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-12 flex flex-col justify-evenly lg:grid lg:grid-cols-3 items-center lg:gap-8 z-10 py-6 lg:py-0">

            {/* Right: Brand */}
            <div className="card-right-text gsap-reveal order-1 lg:order-3 flex justify-center lg:justify-end z-20 w-full lg:pr-8">
              <h2 className="text-6xl md:text-[6rem] lg:text-[8.5rem] font-black uppercase tracking-tighter text-card-silver-matte">
                Excuse
              </h2>
            </div>

            {/* Center: Phone Mockup */}
            <div className="mockup-scroll-wrapper order-2 relative w-full h-[380px] lg:h-[600px] flex items-center justify-center z-10" style={{ perspective: '1000px' }}>
              <div className="relative w-full h-full flex items-center justify-center transform scale-[0.65] md:scale-85 lg:scale-100">
                <div
                  ref={mockupRef}
                  className="relative w-[280px] h-[580px] rounded-[3rem] iphone-bezel flex flex-col will-change-transform"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Hardware Buttons */}
                  <div className="absolute top-[120px] -left-[3px] w-[3px] h-[25px] hardware-btn rounded-l-md z-0" />
                  <div className="absolute top-[160px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0" />
                  <div className="absolute top-[220px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0" />
                  <div className="absolute top-[170px] -right-[3px] w-[3px] h-[70px] hardware-btn rounded-r-md z-0" style={{ transform: 'scaleX(-1)' }} />

                  {/* Screen */}
                  <div className="absolute inset-[7px] rounded-[2.5rem] overflow-hidden text-white z-10" style={{ background: '#050914', boxShadow: 'inset 0 0 15px rgba(0,0,0,1)' }}>
                    <div className="absolute inset-0 screen-glare z-40 pointer-events-none" />
                    {/* Dynamic Island */}
                    <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-50 flex items-center justify-end px-3" style={{ boxShadow: 'inset 0 -1px 2px rgba(255,255,255,0.1)' }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" style={{ boxShadow: '0 0 8px rgba(34,197,94,0.8)' }} />
                    </div>

                    {/* App UI */}
                    <div className="relative w-full h-full px-6 flex flex-col items-center" style={{ paddingTop: '45px' }}>
                      {/* Header */}
                      <div className="w-full flex justify-between items-center mb-8">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-400 tracking-wider mb-0.5">AI POWERED</span>
                          <span className="text-xl font-extrabold tracking-tight text-white leading-none">Excuse Lab</span>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: '#e3e7fc' }}>
                          JS
                        </div>
                      </div>

                      {/* Counter Ring */}
                      <div className="relative w-[150px] h-[150px] flex items-center justify-center mb-8">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 176 176">
                          <circle cx="88" cy="88" r="68" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="16" />
                          <circle className="progress-ring" cx="88" cy="88" r="68" fill="none" stroke="#d692ff" strokeWidth="16" strokeLinecap="round" strokeDasharray="427" strokeDashoffset="42" />
                        </svg>
                        <div className="text-center z-10 flex flex-col items-center mt-2">
                          <span className="text-4xl font-black tracking-tighter text-white leading-none counter-val">0</span>
                          <span className="text-[8px] uppercase tracking-[0.15em] font-extrabold mt-1" style={{ color: 'rgba(214,146,255,0.6)' }}>EXCUSES MADE</span>
                        </div>
                      </div>

                      {/* Mode Cards */}
                      <div className="w-full space-y-3">
                        <div className="phone-widget widget-depth rounded-2xl p-3 flex items-center">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center mr-4 border" style={{ background: 'linear-gradient(to bottom right, rgba(214,146,255,0.15), rgba(175,37,254,0.05))', borderColor: 'rgba(214,146,255,0.2)' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d692ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                          </div>
                          <div className="flex-1">
                            <div className="h-2 w-24 rounded-full mb-2 bg-gray-300" />
                            <div className="h-1.5 w-16 rounded-full bg-gray-600" />
                          </div>
                        </div>

                        <div className="phone-widget widget-depth rounded-2xl p-3 flex items-center">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center mr-4 border" style={{ background: 'linear-gradient(to bottom right, rgba(0,238,252,0.15), rgba(0,222,236,0.05))', borderColor: 'rgba(0,238,252,0.2)' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00eefc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                          </div>
                          <div className="flex-1">
                            <div className="h-2 w-20 rounded-full mb-2 bg-gray-300" />
                            <div className="h-1.5 w-14 rounded-full bg-gray-600" />
                          </div>
                        </div>
                      </div>

                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[120px] h-[4px] rounded-full" style={{ background: 'rgba(255,255,255,0.2)', boxShadow: '0 1px 2px rgba(0,0,0,0.5)' }} />
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <div className="floating-badge absolute flex top-6 lg:top-12 left-[-15px] lg:left-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl items-center gap-3 lg:gap-4 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center border" style={{ background: 'linear-gradient(to bottom, rgba(214,146,255,0.2), rgba(175,37,254,0.1))', borderColor: 'rgba(214,146,255,0.3)' }}>
                    <span className="text-base lg:text-xl">💡</span>
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold tracking-tight">5 AI Modes</p>
                    <p className="text-[10px] lg:text-xs font-medium" style={{ color: 'rgba(214,146,255,0.5)' }}>Normal to Savage</p>
                  </div>
                </div>

                <div className="floating-badge absolute flex bottom-12 lg:bottom-20 right-[-15px] lg:right-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl items-center gap-3 lg:gap-4 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center border" style={{ background: 'linear-gradient(to bottom, rgba(0,238,252,0.2), rgba(0,222,236,0.1))', borderColor: 'rgba(0,238,252,0.3)' }}>
                    <span className="text-base lg:text-lg">🧠</span>
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold tracking-tight">Context Aware</p>
                    <p className="text-[10px] lg:text-xs font-medium" style={{ color: 'rgba(0,238,252,0.5)' }}>Never repeats</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Left: Tagline */}
            <div className="card-left-text gsap-reveal order-3 lg:order-1 flex flex-col justify-center text-center lg:text-left z-20 w-full lg:max-w-xl px-4 lg:px-12 lg:-mt-10">
              <h2 className="text-white text-5xl md:text-6xl lg:text-[5.5rem] font-black tracking-tighter leading-[0.95]">
                AI-powered<br className="hidden lg:block" /> creativity.
              </h2>
              <p className="hidden md:block text-lg md:text-xl lg:text-[1.65rem] font-medium leading-[1.4] mx-auto lg:mx-0" style={{ color: '#d1c4ed', marginTop: '20px' }}>
                <span className="text-white font-bold">Excuse Generator AI</span> crafts unique, context-aware excuses across 5 cinematic modes — from professional to savage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
