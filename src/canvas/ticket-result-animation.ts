import type { Particles } from '@/canvas/particles';
import { getWinStars } from '@/canvas/particles/win-stars';
import { Container } from 'pixi.js';

const getTicketResultAnimation = (container: Container, particles: Particles) => {
  const rectWidth = 430;
  const rectHeight = 220;

  const top = new Container();
  container.addChild(top);

  const bottom = new Container();
  container.addChild(bottom);

  const full = new Container();
  container.addChild(full);

  particles.addParticles(getWinStars({ x: 0, y: 0, w: rectWidth, h: 0 }, 0, 0.2), 'starsTop', top);
  particles.addParticles(
    getWinStars({ x: 0, y: 0, w: rectWidth, h: 0 }, 180, 0.2),
    'starsBottom',
    bottom
  );
  particles.addParticles(
    getWinStars({ x: 0, y: 0, w: 0, h: rectHeight }, -90, 0.2),
    'starsLeft',
    top
  );
  particles.addParticles(
    getWinStars({ x: rectWidth, y: 0, w: 0, h: rectHeight }, 90, 0.2),
    'starsRight',
    top
  );

  particles.addParticles(
    getWinStars({ x: 0, y: 0, w: rectWidth, h: rectHeight }, 0, 0.02),
    'startsFull',
    full
  );

  return {
    setRenderSize: (width: number, height: number) => {
      full.x = top.x = bottom.x = width / 2 - rectWidth / 2;
      full.y = top.y = height / 2 - rectHeight / 2;
      bottom.y = height / 2 + rectHeight / 2;
    },

    playWin: () => {
      if (particles) {
        particles.play('starsTop');
        particles.play('starsBottom');
        particles.play('starsLeft');
        particles.play('starsRight');
      }
    },

    playLose: () => {
      particles.play('startsFull');
    },
  };
};

export default getTicketResultAnimation;
