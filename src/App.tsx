import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Gift, Heart, Sparkles } from 'lucide-react';

const roseGlyphs = ['🌹'];

function FallingRoses() {
  const roses = useMemo(
    () => Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: `${(i * 37) % 100}%`,
      delay: `${(i % 9) * -1.35}s`,
      duration: `${8 + (i % 7) * 1.4}s`,
      size: `${18 + (i % 5) * 5}px`,
      glyph: roseGlyphs[i % roseGlyphs.length],
    })),
    [],
  );

  return (
    <div className="rose-rain" aria-hidden="true">
      {roses.map((rose) => (
        <span
          key={rose.id}
          className="falling-rose"
          style={{
            left: rose.left,
            animationDelay: rose.delay,
            animationDuration: rose.duration,
            fontSize: rose.size,
          }}
        >
          {rose.glyph}
        </span>
      ))}
    </div>
  );
}

function FlowerBurst({ active }: { active: boolean }) {
  const petals = useMemo(
    () => Array.from({ length: 150 }, (_, i) => {
      const ring = i % 5;
      const angle = (360 / 150) * i + (ring - 2) * 2.8;
      return {
        id: i,
        angle,
        distance: 210 + ring * 95 + (i % 11) * 15,
        rotate: (i * 67) % 540,
        delay: (i % 12) * 0.012,
        size: 28 + (i % 7) * 7,
      };
    }),
    [],
  );

  const centerRoses = useMemo(
    () => Array.from({ length: 18 }, (_, i) => ({ id: i, rotate: i * 20 })),
    [],
  );

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="burst-layer"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden="true"
        >
          <motion.div
            className="burst-glow"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 6, opacity: 0 }}
            transition={{ duration: 1.25, ease: 'easeOut' }}
          />

          <div className="center-bloom">
            {centerRoses.map((rose) => (
              <motion.span
                key={rose.id}
                className="center-rose"
                initial={{ scale: 0, rotate: rose.rotate, opacity: 1 }}
                animate={{ scale: [0, 1.8, 0.4], rotate: rose.rotate + 180, opacity: [1, 1, 0] }}
                transition={{ duration: 0.9, delay: rose.id * 0.015, ease: 'easeOut' }}
              >
                🌹
              </motion.span>
            ))}
          </div>

          {petals.map((petal) => {
            const radians = (petal.angle * Math.PI) / 180;
            const x = Math.cos(radians) * petal.distance;
            const y = Math.sin(radians) * petal.distance;
            return (
              <motion.span
                key={petal.id}
                className="burst-petal"
                style={{ fontSize: petal.size }}
                initial={{ x: 0, y: 0, scale: 0.1, opacity: 1, rotate: 0 }}
                animate={{
                  x,
                  y,
                  scale: [0.1, 1.45, 1.05, 0.75],
                  opacity: [1, 1, 0.96, 0],
                  rotate: petal.rotate + 720,
                }}
                transition={{ duration: 1.9, delay: petal.delay, ease: [0.12, 0.7, 0.16, 1] }}
              >
                🌹
              </motion.span>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [accepted, setAccepted] = useState(false);
  const [burst, setBurst] = useState(false);
  const [giftOpened, setGiftOpened] = useState(false);
  const wishRef = useRef<HTMLElement | null>(null);
  const giftRef = useRef<HTMLElement | null>(null);

  const dodgeNo = () => {
    const maxX = Math.min(window.innerWidth * 0.28, 240);
    const maxY = Math.min(window.innerHeight * 0.18, 130);
    const nextX = Math.round((Math.random() * 2 - 1) * maxX);
    const nextY = Math.round((Math.random() * 2 - 1) * maxY);
    setNoPosition({ x: nextX, y: nextY });
  };

  const sayYes = () => {
    setAccepted(true);
    setBurst(true);
    setTimeout(() => setBurst(false), 1700);
    setTimeout(() => wishRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 850);
  };

  const goToGift = () => giftRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <main>
      <section className="hero section-shell">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="hero-card glass-panel">
          <motion.div
            className="eyebrow"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Heart size={18} fill="currentColor" />
            <span>One tiny question before your surprise</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Do you love me?
          </motion.h1>
          <motion.p
            className="hero-copy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            Choose carefully, my favorite person. One answer unlocks the magic. ✨
          </motion.p>

          <div className="choice-area">
            <motion.button
              className="btn btn-yes"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              onClick={sayYes}
            >
              <Heart size={20} fill="currentColor" />
              Yes, always
            </motion.button>

            <motion.button
              className="btn btn-no"
              animate={{ x: noPosition.x, y: noPosition.y }}
              transition={{ type: 'spring', stiffness: 380, damping: 18 }}
              onMouseEnter={dodgeNo}
              onPointerDown={(event) => {
                event.preventDefault();
                dodgeNo();
              }}
              onFocus={dodgeNo}
              aria-label="No — this button playfully moves away"
            >
              No
            </motion.button>
          </div>
        </div>
        <FlowerBurst active={burst} />
      </section>

      <AnimatePresence>
        {accepted && (
          <motion.section
            ref={wishRef}
            className="wish section-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <FallingRoses />
            <motion.div
              className="wish-card glass-panel"
              initial={{ y: 60, opacity: 0, scale: 0.96 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            >
              <div className="wish-corner wish-corner-tl" aria-hidden="true">🌹</div>
              <div className="wish-corner wish-corner-tr" aria-hidden="true">🌹</div>
              <div className="wish-corner wish-corner-bl" aria-hidden="true">🌹</div>
              <div className="wish-corner wish-corner-br" aria-hidden="true">🌹</div>

              <motion.div
                className="crown"
                animate={{ rotate: [0, -4, 4, 0], y: [0, -5, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.1 }}
              >
                👑
              </motion.div>

              <div className="gold-flourish top-flourish" aria-hidden="true"><span>♡</span></div>
              <span className="small-kicker">♥ &nbsp; For the girl who makes my world softer &nbsp; ♥</span>

              <motion.h2
                className="wish-title"
                data-text="Happy Anniversary, My Little Princess"
                initial={{ opacity: 0, y: 34, rotateX: 24, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.55 }}
                transition={{ duration: 1.05, type: 'spring', stiffness: 92, damping: 14 }}
              >
                Happy
                <br />
                Anniversary, My
                <br />
                Little Princess
              </motion.h2>

              <div className="gold-flourish bottom-flourish" aria-hidden="true"><span>♡</span></div>

              <p className="love-note">
                Every day with you feels warmer, brighter, and a little more magical. Thank you for the laughter,
                the tiny moments, the big dreams, and every memory we keep adding to our story. I choose you today,
                tomorrow, and in every beautiful chapter still waiting for us.
              </p>
              <div className="signature-divider" aria-hidden="true"><span>♥</span></div>
              <div className="signature">With all my love, always. ❤️</div>
              <motion.button className="btn btn-soft" whileHover={{ y: -3 }} onClick={goToGift}>
                <Gift size={20} />
                There is one more surprise
              </motion.button>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {accepted && (
          <motion.section
            ref={giftRef}
            className="gift-section section-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="gift-card glass-panel">
              <div className="gift-heading">
                <span className="small-kicker">One more thing...</span>
                <h2>Do you want a gift?</h2>
                <p>Then here it is. Tap the gift and unwrap it. 🎀</p>
              </div>

              <button
                className={`gift-box ${giftOpened ? 'opened' : ''}`}
                onClick={() => setGiftOpened(true)}
                aria-label="Open your anniversary gift"
              >
                <motion.div
                  className="gift-lid"
                  animate={giftOpened ? { y: -72, x: 22, rotate: 18, opacity: 0.9 } : { y: 0, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 140, damping: 13 }}
                >
                  <span className="ribbon ribbon-horizontal" />
                  <span className="bow">🎀</span>
                </motion.div>
                <motion.div
                  className="gift-body"
                  animate={giftOpened ? { scale: [1, 1.08, 0.98, 1] } : { scale: 1 }}
                  transition={{ duration: 0.65 }}
                >
                  <span className="ribbon ribbon-vertical" />
                  <Gift size={58} strokeWidth={1.5} />
                </motion.div>
              </button>

              <AnimatePresence>
                {giftOpened && (
                  <motion.div
                    className="banner-reveal"
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.25, duration: 0.7, type: 'spring' }}
                  >
                    <Sparkles className="sparkle-icon" size={28} />
                    <img src="/anniversary-banner.svg" alt="Happy Anniversary banner" />
                    <a className="btn btn-download" href="/anniversary-banner.svg" download="our-anniversary-banner.svg">
                      <Download size={20} />
                      Download your banner
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;
