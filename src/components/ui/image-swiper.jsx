import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * ImageSwiper — Komponen kartu yang bisa diswipe kiri/kanan
 *
 * Props:
 *   images      {string}  — URL gambar dipisah koma
 *   cardWidth   {number}  — lebar kartu dalam px (default 256)
 *   cardHeight  {number}  — tinggi kartu dalam px (default 352)
 *   className   {string}  — class tambahan untuk wrapper
 */
export function ImageSwiper({
  images,
  cardWidth = 256,
  cardHeight = 352,
  className = '',
}) {
  const cardStackRef = useRef(null);
  const isSwiping = useRef(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const animationFrameId = useRef(null);

  const imageList = images
    .split(',')
    .map((img) => img.trim())
    .filter((img) => img);

  const [cardOrder, setCardOrder] = useState(() =>
    Array.from({ length: imageList.length }, (_, i) => i),
  );

  const getDurationFromCSS = useCallback((variableName, element) => {
    const targetElement = element || document.documentElement;
    const value = getComputedStyle(targetElement)
      ?.getPropertyValue(variableName)
      ?.trim();
    if (!value) return 0;
    if (value.endsWith('ms')) return parseFloat(value);
    if (value.endsWith('s')) return parseFloat(value) * 1000;
    return parseFloat(value) || 0;
  }, []);

  const getCards = useCallback(() => {
    if (!cardStackRef.current) return [];
    return [...cardStackRef.current.querySelectorAll('.image-card')];
  }, []);

  const getActiveCard = useCallback(() => {
    const cards = getCards();
    return cards[0] || null;
  }, [getCards]);

  const updatePositions = useCallback(() => {
    const cards = getCards();
    cards.forEach((card, i) => {
      card.style.setProperty('--i', (i + 1).toString());
      card.style.setProperty('--swipe-x', '0px');
      card.style.setProperty('--swipe-rotate', '0deg');
      card.style.opacity = '1';
    });
  }, [getCards]);

  const applySwipeStyles = useCallback(
    (deltaX) => {
      const card = getActiveCard();
      if (!card) return;
      card.style.setProperty('--swipe-x', `${deltaX}px`);
      card.style.setProperty('--swipe-rotate', `${deltaX * 0.2}deg`);
      card.style.opacity = (
        1 - Math.min(Math.abs(deltaX) / 100, 1) * 0.75
      ).toString();
    },
    [getActiveCard],
  );

  const handleEnd = useCallback(() => {
    if (!isSwiping.current) return;
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    const deltaX = currentX.current - startX.current;
    const threshold = 50;
    const duration = getDurationFromCSS(
      '--card-swap-duration',
      cardStackRef.current,
    );
    const card = getActiveCard();

    if (card) {
      card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;

      if (Math.abs(deltaX) > threshold) {
        const direction = Math.sign(deltaX);
        card.style.setProperty('--swipe-x', `${direction * 300}px`);
        card.style.setProperty('--swipe-rotate', `${direction * 20}deg`);

        setTimeout(() => {
          if (getActiveCard() === card) {
            card.style.setProperty(
              '--swipe-rotate',
              `${-direction * 20}deg`,
            );
          }
        }, duration * 0.5);

        setTimeout(() => {
          setCardOrder((prev) => {
            if (prev.length === 0) return [];
            return [...prev.slice(1), prev[0]];
          });
        }, duration);
      } else {
        applySwipeStyles(0);
      }
    }

    isSwiping.current = false;
    startX.current = 0;
    currentX.current = 0;
  }, [getDurationFromCSS, getActiveCard, applySwipeStyles]);

  const handleStart = useCallback(
    (clientX) => {
      if (isSwiping.current) return;
      isSwiping.current = true;
      startX.current = clientX;
      currentX.current = clientX;
      const card = getActiveCard();
      if (card) card.style.transition = 'none';
    },
    [getActiveCard],
  );

  const handleMove = useCallback(
    (clientX) => {
      if (!isSwiping.current) return;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      animationFrameId.current = requestAnimationFrame(() => {
        currentX.current = clientX;
        const deltaX = currentX.current - startX.current;
        applySwipeStyles(deltaX);
        if (Math.abs(deltaX) > 50) {
          handleEnd();
        }
      });
    },
    [applySwipeStyles, handleEnd],
  );

  useEffect(() => {
    const cardStackElement = cardStackRef.current;
    if (!cardStackElement) return;

    const handlePointerDown = (e) => handleStart(e.clientX);
    const handlePointerMove = (e) => handleMove(e.clientX);
    const handlePointerUp = () => handleEnd();

    cardStackElement.addEventListener('pointerdown', handlePointerDown);
    cardStackElement.addEventListener('pointermove', handlePointerMove);
    cardStackElement.addEventListener('pointerup', handlePointerUp);

    return () => {
      cardStackElement.removeEventListener('pointerdown', handlePointerDown);
      cardStackElement.removeEventListener('pointermove', handlePointerMove);
      cardStackElement.removeEventListener('pointerup', handlePointerUp);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [handleStart, handleMove, handleEnd]);

  useEffect(() => {
    updatePositions();
  }, [cardOrder, updatePositions]);

  return (
    <section
      className={`relative grid place-content-center select-none ${className}`}
      ref={cardStackRef}
      style={{
        width: cardWidth + 32,
        height: cardHeight + 32,
        touchAction: 'none',
        transformStyle: 'preserve-3d',
        '--card-perspective': '700px',
        '--card-z-offset': '12px',
        '--card-y-offset': '7px',
        '--card-max-z-index': imageList.length.toString(),
        '--card-swap-duration': '0.3s',
      }}
    >
      {cardOrder.map((originalIndex, displayIndex) => (
        <article
          key={`${imageList[originalIndex]}-${originalIndex}`}
          className="image-card absolute cursor-grab active:cursor-grabbing
                     place-self-center border border-white/10 rounded-2xl
                     shadow-2xl overflow-hidden will-change-transform"
          style={{
            '--i': (displayIndex + 1).toString(),
            zIndex: imageList.length - displayIndex,
            width: cardWidth,
            height: cardHeight,
            transform: `perspective(var(--card-perspective))
                       translateZ(calc(-1 * var(--card-z-offset) * var(--i)))
                       translateY(calc(var(--card-y-offset) * var(--i)))
                       translateX(var(--swipe-x, 0px))
                       rotateY(var(--swipe-rotate, 0deg))`,
          }}
        >
          <img
            src={imageList[originalIndex]}
            alt={`Gym image ${originalIndex + 1}`}
            className="w-full h-full object-cover select-none pointer-events-none"
            draggable={false}
          />
          {/* Overlay gradient tipis untuk estetika */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </article>
      ))}
    </section>
  );
}

export default ImageSwiper;
