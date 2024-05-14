import type { Scene } from '@/canvas/scene';
import type { EmitterConfigV3 } from '@pixi/particle-emitter';
import * as particles from '@pixi/particle-emitter';
import { Container, Loader } from 'pixi.js';

export type Particles = ReturnType<typeof getParticles>;

const getParticles = () => {
  const emitters = new Map<String, particles.Emitter>();
  let loadId = 0;

  return {
    addParticles: (config: EmitterConfigV3, id: string, container: Container) => {
      const textures: string[] | undefined = config.behaviors.find(
        (b) => b.type === 'textureRandom'
      )?.config.textures;
      if (textures) {
        textures.forEach((tex) => {
          const loader = Loader.shared;
          if (!loader.resources[tex]) {
            loader.add(tex);
            if (!loadId) {
              requestAnimationFrame(() => {
                loader.load();
                loadId = 0;
              });
            }
          }
        });
      }

      const emitter = new particles.Emitter(container, config);
      emitter.emit = false;
      emitters.set(id, emitter);
    },

    play(id: string) {
      const emitter = emitters.get(id);
      emitter && (emitter.emit = true);
    },

    destroy: () => {
      emitters.forEach((emitter) => emitter.destroy());
    },

    attachToScene: (scene: Scene) => {
      scene.updated.add((delta) => emitters.forEach((emitter) => emitter.update(delta)));
    },
  };
};

export default getParticles;
