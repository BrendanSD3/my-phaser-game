import { Scene } from 'phaser';

export class ClickerGame extends Scene
{
    constructor ()
    {
        super('ClickerGame');
    }

    create ()
    {
        this.score = 0;

        this.coins = [];

        const textStyle = { fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };

        this.add.image(512, 384, 'background');

        this.scoreText = this.add.text(32, 32, 'Coins: 0', textStyle).setDepth(1);
        this.timeText = this.add.text(1024 - 32, 32, 'Time: 20', textStyle).setOrigin(1, 0).setDepth(1);
        // Add tank at bottom center
        this.tank = this.physics.add.sprite(512, 700, 'tank').setCollideWorldBounds(true);

        // Create laser group
        this.lasers = this.physics.add.group();

        // Create enemy laser group
        this.enemyLasers = this.physics.add.group();

        // Spawn enemy lasers every second
        this.time.addEvent({
            delay: 1000,
            callback: () => this.dropEnemyLaser(),
            loop: true
        });

        // Laser/coin collision
        this.physics.add.overlap(this.lasers, this.coins, (laser, coin) => {
            laser.destroy();
            this.clickCoin(coin);
        });

        // Tank/enemy laser collision
        this.physics.add.overlap(this.tank, this.enemyLasers, () => this.gameOver(), null, this);

        //  Our 10 second timer. It starts automatically when the scene is created.
        this.timer = this.time.addEvent({ delay: 20000, callback: () => this.gameOver() });

        this.physics.world.setBounds(0, -400, 1024, 768 + 310);

        for (let i = 0; i < 32; i++)
        {
            this.dropCoin();
        }

        this.input.on('gameobjectdown', (pointer, gameObject) => this.clickCoin(gameObject));

        // Add this for keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    dropCoin ()
    {
        const x = Phaser.Math.Between(128, 896);
        const y = Phaser.Math.Between(0, -400);

        const coin = this.physics.add.sprite(x, y, 'coin').play('rotate').setScale(0.5);

        coin.setVelocityX(Phaser.Math.Between(-400, 400));
        coin.setCollideWorldBounds(true);
        coin.setBounce(0.9);
        coin.setInteractive();

        this.coins.push(coin);
    }

    clickCoin (coin)
    {
        //  Disable the coin from being clicked
        coin.disableInteractive();

        //  Stop it from moving
        coin.setVelocity(0, 0);

        //  Play the 'vanish' animation
        coin.play('vanish');

        coin.once('animationcomplete-vanish', () => coin.destroy());

        //  Add 1 to the score
        this.score++;

        //  Update the score text
        this.scoreText.setText('Coins: ' + this.score);

        //  Drop a new coin
        this.dropCoin();
    }

    dropEnemyLaser ()
    {
        const x = Phaser.Math.Between(128, 896);
        const laser = this.enemyLasers.create(x, -50, 'laser');
        laser.setVelocityY(400);
        laser.setCollideWorldBounds(false);
    }

    update ()
    {
        this.timeText.setText('Time: ' + Math.ceil(this.timer.getRemainingSeconds()));
        // Tank movement
        if (this.cursors.left.isDown) {
            this.tank.setVelocityX(-300);
        } else if (this.cursors.right.isDown) {
            this.tank.setVelocityX(300);
        } else {
            this.tank.setVelocityX(0);
        }

        // Shoot laser (player)
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            const laser = this.lasers.create(this.tank.x, this.tank.y - 40, 'laser');
            laser.setVelocityY(-900);
        }
    }

    gameOver ()
    {
        this.coins.forEach((coin) => {
            if (coin.active)
            {
                coin.setVelocity(0, 0);
                coin.play('vanish');
            }
        });

        this.input.off('gameobjectdown');

        // Destroy all enemy lasers
        this.enemyLasers.clear(true, true);

        //  Save our highscore to the registry
        const highscore = this.registry.get('highscore');

        if (this.score > highscore)
        {
            this.registry.set('highscore', this.score);
            this.events.emit('newHighscore', this.score);
        }

        //  Swap to the GameOver scene after a 2 second delay
        this.time.delayedCall(2000, () => this.scene.start('GameOver'));
    }
}
