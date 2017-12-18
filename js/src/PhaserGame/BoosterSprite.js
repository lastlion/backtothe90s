import BaseSprite from './BaseSprite';

class BoosterSprite extends BaseSprite {
  constructor(game, key) {
    super(game, 0, 0, key);

    this.outOfBoundsKill = true;
    this.exists = false;
    this.scale.set(1);
  }

  release(x, y, angle, speed) {
    this.reset(x, y);

    this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);
  }
}

export default BoosterSprite;