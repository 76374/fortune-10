import type { Particles } from '@/canvas/particles';
import { getWinStars } from '@/canvas/particles/win-stars';
import { type Scene } from '@/canvas/scene';
import { gsap } from 'gsap';
import { Container, Graphics, Text, TextStyle, type TextStyleFontWeight } from 'pixi.js';

const winStyle: Partial<TextStyle> = {
  fontFamily: 'sans-serif',
  fontWeight: '1000' as TextStyleFontWeight,
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
  amountText.x = textContainer.width / 2 - amountText.width / 2;
  amountText.y = 180;
  textContainer.addChild(amountText);

  const mask = new Graphics();
  textContainer.addChild(mask);
  textContainer.mask = mask;

  const particleContainers = [new Container(), new Container()];
  popup.addChild(...particleContainers);

  let particles: Particles | null = null;

  return {
    attachToScene: (scene: Scene) => {
      scene.stage.addChild(popup);
    },

    setRenderSize: (width: number, height: number) => {
      textContainer.x = width / 2 - textContainer.width / 2;
      textContainer.y = height / 2 - textContainer.height / 2;
      particleContainers[0].y = particleContainers[1].y = textContainer.y;
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
            const width = textContainer.width * this.ratio;
            const x = textContainer.width / 2 - width / 2;
            mask.clear().beginFill(0).drawRect(x, 0, width, 500);

            particleContainers[0].x = textContainer.x + x + 10;
            particleContainers[1].x = textContainer.x + x + width - 10;
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
