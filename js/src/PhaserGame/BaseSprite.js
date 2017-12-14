import Phaser from 'phaser';

import cfg from './config'

class BaseSprite extends Phaser.Sprite {
  constructor(game, x, y, key) {
    super(game, x, y, key);

    this.checkWorldBounds = true;
    this.scale.set(cfg.spriteScale);
    this.anchor.setTo(0.5);
  }
}

export default BaseSprite;