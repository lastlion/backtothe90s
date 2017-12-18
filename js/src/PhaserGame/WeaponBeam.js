import Weapon from './Weapon';

class WeaponBeam extends  Weapon {
  constructor(game, name, key, sound) {
    super(game, name, key, sound);
    this.bulletSpeed = 1000;
    this.fireRate = 15;
  }

  fire(source) {
    if (this.game.time.time < this.nextFire) { return; }

    super.fire();

    let x = source.x;
    let y = source.y - 20;

    this.getFirstExists(false).fire(x, y, 270, this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;
  }
}

export default WeaponBeam;