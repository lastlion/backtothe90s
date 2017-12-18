import Phaser from 'phaser';

import cfg from './config';

class BaseState extends Phaser.State {
  init() {
    this.game.renderer.renderSession.roundPixels = true;    
    this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
  }

  preload() {
    this.load.image('back', 'imgs/background_blue.jpg');
  }

  create() {
    this.background = this.add.tileSprite(0, 0, cfg.width, cfg.height, 'back');
    this.background.autoScroll(0, 100);

    const toogleFullscreen = () => {   
      if (this.scale.isFullScreen) {
        this.scale.stopFullScreen();
      } else {
        this.scale.startFullScreen(false);
      }    
    }

    this.fullscreenButton = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    this.fullscreenButton.onDown.add(toogleFullscreen, this);
  }
}

export default BaseState;