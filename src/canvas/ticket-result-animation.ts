import type { Particles } from '@/canvas/particles';
import { getWinStars } from '@/canvas/particles/win-stars';
import { type Scene } from '@/canvas/scene';
import { Container } from 'pixi.js';

const getTicketResultAnimation = () => {
  const rectWidth = 430;
  const rectHeight = 220;

  const top = new Container();
  const bottom = new Container();
  const full = new Container();

  let particles: Particles | null = null;

  return {
    attachToScene: (scene: Scene) => {
      scene.stage.addChild(top);
      scene.stage.addChild(bottom);
      scene.stage.addChild(full);
    },

    setRenderSize: (width: number, height: number) => {
      full.x = top.x = bottom.x = width / 2 - rectWidth / 2;
      full.y = top.y = height / 2 - rectHeight / 2;
      bottom.y = height / 2 + rectHeight / 2;
    },

    setParticles: (value: Particles) => {
      particles = value;

      particles.addParticles(
        getWinStars({ x: 0, y: 0, w: rectWidth, h: 0 }, 0, 0.2),
        'starsTop',
        top
      );
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
      if (particles) {
        particles.play('startsFull');
      }
    }
  };
};

export default getTicketResultAnimation;
