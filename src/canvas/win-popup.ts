import type { Particles } from '@/canvas/particles';
import { getWinStars } from '@/canvas/particles/win-stars';
import { type Scene } from '@/canvas/scene';
import { gsap } from 'gsap';
import { Container, Graphics, Text } from 'pixi.js';

const winStyle = {
  fontFamily: 'sans-serif',
  fontWeight: 1000,
  fontSize: 180,
  align: 'center',
  // fill: '#ffcf40',
  fill: [0xffbf00, 16764736, 16768115, 0xffbf00],
  stroke: 0x3c096c,
  strokeThickness: 5,
  dropShadowBlur: 20,
  dropShadowColor: 0xffffff,
  dropShadow: true,
};

const showDuration = 1;

const getWinPopup = () => {
  const popup = new Container();

  const textContainer = new Container();
  popup.addChild(textContainer);

  const winText = new Text('WIN', winStyle);
  textContainer.addChild(winText);

  const amountText = new Text('2€', winStyle);
  amountText.y = 180;
  textContainer.addChild(amountText);

  const mask = new Graphics();
  textContainer.mask = mask;

  const particleContainers = [new Container(), new Container()];
  popup.addChild(...particleContainers);

  let particles: Particles | null = null;

  return {
    attachToScene: (scene: Scene) => {
      scene.stage.addChild(popup);
    },

    setRenderWidth: (width: boolean) => {
      winText.x = width / 2 - winText.width / 2;
      amountText.x = width / 2 - amountText.width / 2;
    },

    setParticles: (value: Particles) => {
      particles = value;
      const rect = { x: 0, y: 0, w: 0, h: 300 };
      particles.addParticles(
        getWinStars(rect, -90, showDuration),
        'popupStarsLeft',
        particleContainers[0]
      );
      particles.addParticles(
        getWinStars(rect, 90, showDuration),
        'popupStarsRight',
        particleContainers[1]
      );
    },

    show: () => {
      popup.visible = true;
      gsap.to(
        {},
        {
          duration: showDuration,
          onUpdate() {
            const width = winText.width * this.ratio;
            const x = winText.x + winText.width / 2 - width / 2;
            mask.clear().beginFill(0).drawRect(x, 0, width, 500);

            particleContainers[0].x = x + 10;
            particleContainers[1].x = x + width - 10;
          },
        }
      );
      if (particles) {
        particles.play('popupStarsLeft');
        particles.play('popupStarsRight');
      }
    },

    hide: () => {
      popup.visible = false;
      mask.clear();
    }
  };
};

export default getWinPopup;
