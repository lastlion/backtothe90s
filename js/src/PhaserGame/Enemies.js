import Phaser from 'phaser';

import Enemy from './EnemySprite';

class Enemies extends Phaser.Group {
  constructor(game, name, key, outOfBoundHandler) {
    super(game, game.world, name, false, true, Phaser.Physics.ARCADE);
    
    this.nextEnemy = 0;

    for(let i =0; i < 64; i++) {
      let enemy = new Enemy(game, key)
      enemy.events.onOutOfBounds.add(outOfBoundHandler, this);
      this.add(enemy, true);

    }
  }

  release(x, y, speed, rate) {
    if (this.game.time.time < this.nextEnemy) { return; }

    this.getFirstExists(false).release(x, y, 90, speed);
    
    this.nextEnemy = this.game.time.time + rate;
  }
}

export default Enemies;