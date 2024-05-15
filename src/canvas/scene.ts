import { Container, Renderer } from 'pixi.js';

export type Scene = ReturnType<typeof getScene>;

type Callback<T1 = void> = (arg: T1) => void;

const getSignal = <T1 = void>() => {
  let callbacks: Callback<T1>[] = [];

  return {
    add: (callback: Callback<T1>) => {
      callbacks.push(callback);
    },

    emit: (arg: T1) => callbacks.forEach((cb) => cb(arg)),

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
