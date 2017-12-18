import BaseSprite from './BaseSprite';

class EnemySprite extends BaseSprite {
  constructor(game, key) {
    super(game, 0, 0, key);

    this.outOfBoundsKill = true;
    this.exists = false;
  }

  release(x, y, angle, speed) {
    this.reset(x, y);
    
    this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);
  }
}

export default EnemySprite;