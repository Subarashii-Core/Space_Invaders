class SoundEffects{
    constructor(){
        this.shootSound = [
            new Audio("src/assets/audio/shoot.mp3"),
            new Audio("src/assets/audio/shoot.mp3"),
            new Audio("src/assets/audio/shoot.mp3"),
            new Audio("src/assets/audio/shoot.mp3"),
            new Audio("src/assets/audio/shoot.mp3"),
        ]

        this.hitSound = [
            new Audio("src/assets/audio/hit.mp3"),
            new Audio("src/assets/audio/hit.mp3"),
            new Audio("src/assets/audio/hit.mp3"),
            new Audio("src/assets/audio/hit.mp3"),
            new Audio("src/assets/audio/hit.mp3"),
        ]

        this.explosionSound = new Audio("src/assets/audio/explosion.mp3")
        this.nextLevelSound = new Audio("src/assets/audio/next_level.mp3")

        this.currentShootSound = 0
        this.currentHitSound = 0

        this.adjustVolumes();
    }

    playExplosionSound(){
        this.explosionSound.play();
    }

    playNextLevelSound(){
        this.nextLevelSound.play();
    }

    playShootSound(){
        this.shootSound[this.currentShootSound].currentTime = 0;
        this.shootSound[this.currentShootSound].play()
        this.currentHitSound = (this.currentShootSound +1) % this.shootSound.length
    }

    playHitSound(){
        this.hitSound[this.currentShootSound].currentTime = 0;
        this.hitSound[this.currentShootSound].play()
        this.currentHitSound = (this.currenthitSound +1) % this.hitSound.length
    }

    adjustVolumes(){
        this.hitSound.forEach(sound => sound.volume = 0.2)
        this.shootSound.forEach(sound => sound.volume = 0.5)
        this.explosionSound.volume = 0.2
        this.nextLevelSound.volume = 0.4
    }
}

export default SoundEffects