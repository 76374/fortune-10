import { Container, Renderer } from 'pixi.js';

export type Scene = ReturnType<typeof getScene>;

type Callback<T = void> = (arg: T) => void;

const getSignal = <T = void>() => {
  let callbacks: Callback<T>[] = [];

  return {
    add: (callback: Callback<T>) => {
      callbacks.push(callback);
    },

    emit: (arg: T) => callbacks.forEach((cb) => cb(arg)),

    removeAll: () => {
      callbacks = [];
    },
  };
};

const getScene = () => {
  const stage = new Container();
  let renderer: Renderer | null = null;

  const updated = getSignal<number>();

  let elapsed = 0;
  let updateId = 0;
  const update = () => {
    const now = Date.now();
    updateId = requestAnimationFrame(update);
    updated.emit((now - elapsed) * 0.001)
    elapsed = now;
    if (renderer) {
      renderer.render(stage);
    }
  };

  const stop = () => {
    if (updateId) {
      cancelAnimationFrame(updateId);
      updateId = 0;
    }
  }

  return {
    stage,
    updated,

    setCanvas: (canvas: HTMLCanvasElement) => {
      renderer = new Renderer({
        backgroundAlpha: 0,
        width: canvas.width,
        height: canvas.height,
        view: canvas,
      })
    },

    start: () => {
      if (!updateId) {
        elapsed = Date.now();
        update();
      }
    },
    stop,

    resize: (width: number, height: number) => {
      renderer?.resize(width, height);
    },

    destroy: () => {
      stop();
      updated.removeAll();
      renderer?.destroy();
      renderer = null;
      stage.destroy();
    }
  };
}

export default getScene;
