import React, { useEffect, useRef, useState } from 'react';
import './styles/Cursor.css';

const Cursor = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setHidden(false);
      
      // Instantly move the center dot
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const onMouseLeave = () => {
      setHidden(true);
    };

    const onMouseEnter = () => {
      setHidden(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth lerp animation for the outer ring
    const ringFrame = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(ringFrame);
    };
    const animId = requestAnimationFrame(ringFrame);

    // Check for elements with hover data attribute
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [role="button"], .pod-card, .ns-tab, .step-node, .certification-card, .project-card, .contact-input'
      );
      
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => setHovered(true));
        el.addEventListener('mouseleave', () => setHovered(false));
      });
    };

    addHoverListeners();

    // Re-bind listeners when content shifts
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div 
        ref={ringRef} 
        className={`cursor-ring ${hovered ? 'hovered' : ''} ${hidden ? 'hidden' : ''}`}
      />
      <div 
        ref={dotRef} 
        className={`cursor-dot ${hidden ? 'hidden' : ''}`}
      />
    </>
  );
};

export default Cursor;
