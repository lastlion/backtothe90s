import Phaser from 'phaser';

import Bullet from './BulletSprite';

class Weapon extends Phaser.Group {
  constructor(game, name, key, sound) {
    super(game, game.world, name, false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 200;
    this.sound = sound;

    for(let i = 0; i < 64; i++) {
      this.add(new Bullet(game, key), true);
    }

    return this;
  }

  fire() {
    this.sound.play();
  }
}

export default Weapon;