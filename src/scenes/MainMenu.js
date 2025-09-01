import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        //  Get the current highscore from the registry
        const score = this.registry.get('highscore');

        const textStyle = { fontFamily: 'Arial Black', fontSize: 38, color: '#dcd8d8ff', stroke: '#000000', strokeThickness: 10 };

        this.add.image(512, 384, 'background');

        const logo = this.add.image(512, -270, 'logo');

        this.tweens.add({
            targets: logo,
            y: 270,
            duration: 1000,
            ease: 'Bounce'
        });

        this.add.text(32, 32, `High Score: ${score}`, textStyle);

        const instructions = [
            'How many coins can you',
            'click in 20 seconds?',
            '',
            'Click space or mouse to Start!'
        ]

        this.add.text(512, 550, instructions, textStyle).setAlign('center').setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('ClickerGame');

        });
          // Start game on spacebar press
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('ClickerGame');
        }); 
    }
}
