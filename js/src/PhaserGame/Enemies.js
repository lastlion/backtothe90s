import Phaser from 'phaser';

import Enemy from './EnemySprite';

class Enemies extends Phaser.Group {
  constructor(game, name, key) {
    super(game, game.world, name, false, true, Phaser.Physics.ARCADE);
    
    this.nextEnemy = 0;

    for(let i =0; i < 64; i++) {
      this.add(new Enemy(game, key), true);
    }
  }

  release(x, y, speed, rate) {
    if (this.game.time.time < this.nextEnemy) { return; }

    this.getFirstExists(false).release(x, y, 90, speed);
    
    this.nextEnemy = this.game.time.time + rate;
  }
}

export default Enemies;