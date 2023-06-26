import FadeIn from '../../../../audio/fade/FadeIn.js';
import FadeOut from '../../../../audio/fade/FadeOut.js';

const RemoveItem = Phaser.Utils.Array.Remove;

export default {

    getSoundEffects2() {
        return this.soundEffects2;
    },

    getLastSoundEffect2() {
        return this.soundEffects2[this.soundEffects2.length - 1];
    },

    playSoundEffect2(key) {
        var music = this.sound.add(key, {
            mute: this.soundEffects2Mute,
            volume: this.soundEffects2Volume
        });

        this.soundEffects2.push(music);

        music
            .once('complete', function () {
                music.destroy();

                // SoundManager has been destroyed
                if (!this.sound) {
                    return;
                }
                RemoveItem(this.soundEffects2, music);
            }, this)
            .once('destroy', function () {
                // SoundManager has been destroyed
                if (!this.sound) {
                    return;
                }
                RemoveItem(this.soundEffects2, music);
            }, this)
            .play();

        return this;
    },

    stopAllSoundEffects2() {
        for (var i = this.soundEffects.length - 1; i >= 0; i--) {
            var soundEffect = this.soundEffects[i];
            soundEffect.stop();
            soundEffect.destroy();
        }

        return this;
    },

    fadeInSoundEffect2(time) {
        var soundEffect = this.getLastSoundEffect2();
        if (soundEffect) {
            FadeIn(soundEffect, time, this.soundEffects2Volume, 0);
        }

        return this;
    },

    fadeOutSoundEffect2(time, isStopped) {
        var soundEffect = this.getLastSoundEffect2();
        if (soundEffect) {
            FadeOut(soundEffect, time, isStopped);
        }

        return this;
    },

    fadeOutAllSoundEffects2(time, isStopped) {
        for (var i = this.soundEffects2.length - 1; i >= 0; i--) {
            FadeOut(this.soundEffects2[i], time, isStopped);
        }

        return this;
    },

    setSoundEffect2Mute(mute, lastSoundEffect) {
        if (mute === undefined) {
            mute = true;
        }
        if (lastSoundEffect === undefined) {
            lastSoundEffect = false;
        }

        if (lastSoundEffect) {
            // Set volume of last sound effect
            var soundEffect = this.getLastSoundEffect2();
            if (soundEffect) {
                soundEffect.setMute(mute);
            }

        } else {
            // Set volume of all sound effects
            this.soundEffects2Mute = mute;
        }

        return this;
    },

    setSoundEffect2Volume(volume, lastSoundEffect) {
        if (lastSoundEffect === undefined) {
            lastSoundEffect = false;
        }

        if (lastSoundEffect) {
            // Set volume of last sound effect
            var soundEffect = this.getLastSoundEffect2();
            if (soundEffect) {
                soundEffect.setVolume(volume);
            }

        } else {
            // Set volume of all sound effects
            this.soundEffects2Volume = volume;
        }

        return this;
    },
}