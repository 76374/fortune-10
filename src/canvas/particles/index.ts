import type { EmitterConfigV3 } from '@pixi/particle-emitter';
import * as particles from '@pixi/particle-emitter';
import { Container, Loader, Renderer } from 'pixi.js';

// const loadResources = (onComplete: () => void) => {
//   const loader = Loader.shared;
//   if (loader.resources['star']) {
//     onComplete();
//   } else {
//     loader.add('star', '/img/star.png');
//     loader.load(onComplete);
//   }
// };

const getParticles = (canvas: HTMLCanvasElement) => {
  const stage = new Container();
  const renderer = new Renderer({
    backgroundAlpha: 0,
    width: canvas.width,
    height: canvas.height,
    view: canvas,
  });
  const emitters = new Map<String, particles.Emitter>();

  // loadResources(() => {});

  let elapsed = 0;
  let updateId = 0;
  const update = () => {
    const now = Date.now();
    updateId = requestAnimationFrame(update);
    emitters.forEach((emitter) => emitter.update((now - elapsed) * 0.001));
    elapsed = now;
    renderer.render(stage);
  };

  const setEnabled = (value: boolean) => {
    if (value && !updateId) {
      elapsed = Date.now();
      update();
    } else if (!value && updateId) {
      cancelAnimationFrame(updateId);
      updateId = 0;
    }
  };

  return {
    addParticles: (config: EmitterConfigV3, id: string) => {
      const textures: string[] | undefined = config.behaviors.find(
        (b) => b.type === 'textureRandom'
      )?.config.textures;
      if (textures) {
        textures.forEach((tex) => {
          const loader = Loader.shared;
          if (!loader.resources[tex]) {
            loader.add(tex).load();
          }
        })
      }

      const emitter = new particles.Emitter(stage, config);
      emitter.emit = false;
      emitters.set(id, emitter);
    },

    play(id: string) {
      setEnabled(true);
      const emitter = emitters.get(id);
      emitter && (emitter.emit = true);
    },

    destroy: () => {
      cancelAnimationFrame(updateId);
      emitters.forEach((emitter) => emitter.destroy());
      renderer.destroy();
      stage.destroy();
    },
  };
};

export default getParticles;
