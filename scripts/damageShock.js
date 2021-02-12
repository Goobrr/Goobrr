const shock = extend(LightningBulletType, {
    length: 250,
    lightningColor: Color.white,
    damage: 750,
    lightningDamage: 750
})

const damageShock = extend(BasicBulletType, {
    lifetime: 30,
    speed: 0.001,
    hitEffect: Fx.none,
    despawnEffect: Fx.none,
    hittable: false,
    collides: false,
    keepVelocity: false,
    shootEffect: Fx.none,
    smokeEffect: Fx.none,

    draw(b){},
    init(b){
        if(!b)return;
        b.data = 0
    },
    update(b){
        // Time.delta where
        this.super$update(b)
        Angles.circleVectors(8 + (40 * b.fin()), 640 * b.fin(), (x, y) => {
            x = b.x + x
            y = b.y + y
            let angle = Angles.angle(b.x, b.y, x, y) - 180
            shock.create(b.owner, Team.derelict, x, y, angle)
        });
    }
})

module.exports = {
    damageShock: damageShock
}
