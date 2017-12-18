import 'pixi';
import 'p2';
import Phaser from "phaser";

import Game from './GameState';
import GameOver from './GameOverState';
import StartGame from './StartGameState';

class PhaserGame extends Phaser.Game {
  constructor(width, height) {
    super(width, height, Phaser.CANVAS, document.querySelector('.game-container'), null);
    this.state.add('Game', Game, false);
    this.state.add('GameOver', GameOver, false);
    this.state.add('StartGame', StartGame, false);

    this.state.start('StartGame');
  }
}

export default PhaserGame;