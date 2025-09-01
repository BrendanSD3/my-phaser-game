import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        //  Get the current highscore from the registry
        const score = this.registry.get('highscore');

        const textStyle = { fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };

        this.add.image(512, 384, 'background');

        this.add.text(512, 300, `Game Over\n\nHigh Score: ${score}`, textStyle).setAlign('center').setOrigin(0.5);

        const promptText = this.add.text(
            512,
            500,
            'Click or press SPACE to return to the Main Menu',
            { fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff', stroke: '#000000', strokeThickness: 8 }
        ).setOrigin(0.5);

        // Animate the text to pulse (flashing effect)
        this.tweens.add({
            targets: promptText,
            alpha: { from: 1, to: 0.2 },
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
        //space bar
        this.input.keyboard.once('keydown-SPACE', () => {

            this.scene.start('MainMenu');

        });
    }
}
