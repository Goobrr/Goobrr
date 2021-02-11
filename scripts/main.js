var pinColor = Color.white

const pinHit = new Effect(15, e => {
    Draw.color(pinColor)
    Draw.alpha(1 - e.finpow())
    Lines.stroke(15 * (1 - e.finpow()));
    Lines.circle(e.x, e.y, 100 * e.finpow());

    Draw.alpha(1)
    Angles.randLenVectors(e.id, 5, e.fin()*100, (x, y) => {
        let angle = Mathf.angle(x, y)
        Drawf.tri(e.x + x, e.y + y, 4, 40 * e.fout(), angle )
        Drawf.tri(e.x + x, e.y + y, 4, 5 * e.fout(), angle - 180 )
    });
})

const pinShoot = new Effect(30, e => {
    Draw.color(pinColor)
    Draw.alpha(e.fin());
    Drawf.tri(e.x, e.y, 4, 25, e.rotation);
    Drawf.tri(e.x, e.y, 4, 4, (e.rotation - 180));
});

const pinBullet = extend(MissileBulletType, {
    damage: 8500,
    lifetime: 60,
    speed: 18,
    homingPower: 0.3,
    homingRange: 200,
    shootEffect: pinShoot,
    hitEffect: pinHit,
    despawnEffect: pinHit,
    smokeEffect: Fx.none,
    trailEffect: Fx.none,
    draw(b){
        Draw.alpha(0.75);
        b.data.draw(Color.valueOf("FFFFFFAA"), 2);

        Draw.alpha(1);
        Draw.color(pinColor)
        Drawf.tri(b.x, b.y, 4, 25, b.rotation());
        Drawf.tri(b.x, b.y, 4, 4, (b.rotation() - 180));
    },
    update(b){
        this.super$update(b);
        b.data.update(b.x, b.y);
    },
    init(b){
        if(!b)return;
        b.data = new Trail(10);
    }
});

const pinWeapon = extend(Weapon, {
    reload: 10,
    mirror: true,
    alternate: true,
    x: 20,
    bullet: pinBullet,
    firstShotDelay: 30,
    shootSound: Sounds.missile
})



const goob = extend(UnitType, "goober", {
    health: 120,
    speed: 2,
    hitSize: 5,
    drawCell: false,

    localizedName: "Goober",
    update(unit){
        this.super$update(unit);
        unit.heal();
    }
})

goob.constructor = () => extend(MechUnit, {
    destroy(){
        print("no");
        this.maxHealth = 120;
        this.health = this.maxHealth;
        this.dead = false;
        this.heal()
    },
    remove(){
        print("no");
        this.maxHealth = 120;
        this.health = this.maxHealth;
        this.dead = false;
        this.heal()
    }
})

var pinWeapon2 = pinWeapon.copy()
pinWeapon2.x = 15;
pinWeapon2.y = -20;
pinWeapon2.reload = 30;

var pinWeapon3 = pinWeapon.copy()
pinWeapon3.x = 17.5;
pinWeapon3.y = -10;
pinWeapon3.reload = 20;

goob.weapons.add(pinWeapon, pinWeapon2, pinWeapon3)

