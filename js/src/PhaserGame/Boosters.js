import Phaser from 'phaser';

import Booster from './BoosterSprite';

class Boosters extends Phaser.Group {
  constructor(game, name, key) {
    super(game, game.world, name, false, true, Phaser.Physics.ARCADE);
    
    this.nextEnemy = 0;
    this.enemyRate = 10000;

    for(let i =0; i < 64; i++) {
      this.add(new Booster(game, key), true);
    }
  }

  release(source, speed) {
    if (this.game.time.time < this.nextEnemy) { return; }

    this.getFirstExists(false).release(source.x, source.y, 90, speed);

    this.nextEnemy = this.game.time.time + this.enemyRate;
  }
}

export default Boosters;