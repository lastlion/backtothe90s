import BaseSprite from './BaseSprite';

class BulletSprite extends BaseSprite {
  constructor(game, key) {
    super(game, 0, 0, key)

    this.outOfBoundsKill = true;
    this.exists = false;
  }

  fire(x, y, angle, speed, gx, gy) {
    gx = gx || 0;
    gy = gy || 0;

    this.reset(x, y);

    this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);

    this.angle = angle;

    this.body.gravity.set(gx, gy)
  }
}

export default BulletSprite;