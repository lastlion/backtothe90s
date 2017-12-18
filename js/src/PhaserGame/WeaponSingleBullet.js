import Weapon from './Weapon';

class WeaponSingleBullet extends  Weapon {
  fire(source) {
    if (this.game.time.time < this.nextFire) { return; }

    super.fire();

    let x = source.x;
    let y = source.y - 20;

    this.getFirstExists(false).fire(x, y, 270, this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;
  }
}

export default WeaponSingleBullet;