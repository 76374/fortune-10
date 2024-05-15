type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export const getWinStars = (rect: Rect, rotation: number, duration: number) => ({
  lifetime: { min: 4, max: 4 },
  frequency: 0.002,
  emitterLifetime: duration,
  maxParticles: 1000,
  addAtBack: false,
  pos: { x: 0, y: 0 },
  behaviors: [
    {
      type: 'moveAcceleration',
      config: {
        accel: { x: 0, y: 1000 },
        minStart: 500,
        maxStart: 600,
        rotate: true,
        maxSpeed: 0,
      },
    },
    {
      type: 'scale',
      config: {
        scale: {
          list: [
            { time: 0, value: 0.5 },
            { time: 1, value: 1.2 },
          ],
        },
        minMult: 0.5,
      },
    },
    {
      type: 'color',
      config: {
        color: {
          list: [
            { time: 0, value: '#ffcf40' },
            { time: 1, value: '#ffffff' },
          ],
        },
      },
    },
    {
      type: 'rotationStatic',
      config: { min: -130 + rotation, max: -50 + rotation },
    },
    {
      type: 'textureRandom',
      config: {
        textures: ['assets/img/star.png'],
      },
    },
    {
      type: 'spawnShape',
      config: {
        type: 'rect',
        data: rect,
      },
    },
  ],
});
