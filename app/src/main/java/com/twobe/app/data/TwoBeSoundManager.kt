package com.twobe.app.data

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlin.math.sin

/**
 * 2Be Romantic Sound Effects Engine:
 * Generates tactile auditory feedback on Android without requiring external mp3 assets.
 * Respects settings toggle: all sounds can be muted.
 */
object TwoBeSoundManager {
    var isSoundEnabled: Boolean = true
    private val scope = CoroutineScope(Dispatchers.Default)

    /**
     * 1. Message send: soft pop
     */
    fun playMessageSend() {
        if (!isSoundEnabled) return
        scope.launch {
            playTone(startFreq = 480.0, endFreq = 720.0, durationMs = 80, amplitude = 0.35f)
        }
    }

    /**
     * 2. Message receive: gentle chime
     */
    fun playMessageReceive() {
        if (!isSoundEnabled) return
        scope.launch {
            playChime(notes = listOf(523.25, 659.25, 783.99))
        }
    }

    /**
     * 3. Kiss sent: kiss sound
     */
    fun playKissSent() {
        if (!isSoundEnabled) return
        scope.launch {
            playTone(startFreq = 650.0, endFreq = 1350.0, durationMs = 120, amplitude = 0.4f)
        }
    }

    /**
     * 4. Hug sent: warm whoosh sound
     */
    fun playHugWhoosh() {
        if (!isSoundEnabled) return
        scope.launch {
            playTone(startFreq = 220.0, endFreq = 440.0, durationMs = 280, amplitude = 0.25f)
        }
    }

    /**
     * 5. Scratch-off: metallic foil scratching sound
     */
    fun playScratchOff() {
        if (!isSoundEnabled) return
        scope.launch {
            playNoiseBurst(durationMs = 90, amplitude = 0.2f)
        }
    }

    /**
     * 6. Locked letter opened: envelope unsealing sound
     */
    fun playLetterOpened() {
        if (!isSoundEnabled) return
        scope.launch {
            playChime(notes = listOf(440.0, 554.37, 659.25, 880.0))
        }
    }

    /**
     * 7. Gratitude note added: glass jar clink sound
     */
    fun playGratitudeClink() {
        if (!isSoundEnabled) return
        scope.launch {
            playTone(startFreq = 1200.0, endFreq = 1800.0, durationMs = 100, amplitude = 0.3f)
        }
    }

    /**
     * 8. Milestone reached: celebration sound
     */
    fun playMilestoneCelebration() {
        if (!isSoundEnabled) return
        scope.launch {
            playChime(notes = listOf(523.25, 659.25, 783.99, 1046.50, 1318.51))
        }
    }

    // Helper: Dynamic Tone Synthesizer
    private fun playTone(startFreq: Double, endFreq: Double, durationMs: Int, amplitude: Float) {
        try {
            val sampleRate = 44100
            val numSamples = (durationMs * sampleRate) / 1000
            val buffer = ShortArray(numSamples)

            for (i in 0 until numSamples) {
                val progress = i.toDouble() / numSamples
                val currentFreq = startFreq + (endFreq - startFreq) * progress
                val time = i.toDouble() / sampleRate
                // Window envelope for soft attack and release
                val envelope = sin(Math.PI * progress)
                val sample = (sin(2.0 * Math.PI * currentFreq * time) * amplitude * envelope * Short.MAX_VALUE).toInt()
                buffer[i] = sample.coerceIn(Short.MIN_VALUE.toInt(), Short.MAX_VALUE.toInt()).toShort()
            }

            val audioTrack = AudioTrack.Builder()
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .setUsage(AudioAttributes.USAGE_ASSISTANCE_SONIFICATION)
                        .build()
                )
                .setAudioFormat(
                    AudioFormat.Builder()
                        .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                        .setSampleRate(sampleRate)
                        .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                        .build()
                )
                .setBufferSizeInBytes(buffer.size * 2)
                .setTransferMode(AudioTrack.MODE_STATIC)
                .build()

            audioTrack.write(buffer, 0, buffer.size)
            audioTrack.play()
            Thread.sleep(durationMs.toLong() + 50)
            audioTrack.release()
        } catch (_: Exception) {}
    }

    // Helper: Ethereal Chime Chord Synthesizer
    private fun playChime(notes: List<Double>) {
        try {
            val sampleRate = 44100
            val durationMs = 350
            val numSamples = (durationMs * sampleRate) / 1000
            val buffer = ShortArray(numSamples)

            notes.forEachIndexed { noteIndex, freq ->
                val delaySamples = (noteIndex * 40 * sampleRate) / 1000
                for (i in delaySamples until numSamples) {
                    val progress = (i - delaySamples).toDouble() / (numSamples - delaySamples)
                    val time = (i - delaySamples).toDouble() / sampleRate
                    val envelope = (1.0 - progress) * (1.0 - progress) // Exponential decay
                    val sample = (sin(2.0 * Math.PI * freq * time) * 0.18 * envelope * Short.MAX_VALUE).toInt()
                    val existing = buffer[i].toInt()
                    buffer[i] = (existing + sample).coerceIn(Short.MIN_VALUE.toInt(), Short.MAX_VALUE.toInt()).toShort()
                }
            }

            val audioTrack = AudioTrack.Builder()
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .setUsage(AudioAttributes.USAGE_ASSISTANCE_SONIFICATION)
                        .build()
                )
                .setAudioFormat(
                    AudioFormat.Builder()
                        .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                        .setSampleRate(sampleRate)
                        .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                        .build()
                )
                .setBufferSizeInBytes(buffer.size * 2)
                .setTransferMode(AudioTrack.MODE_STATIC)
                .build()

            audioTrack.write(buffer, 0, buffer.size)
            audioTrack.play()
            Thread.sleep(durationMs.toLong() + 50)
            audioTrack.release()
        } catch (_: Exception) {}
    }

    // Helper: Friction/Scratch Noise Generator
    private fun playNoiseBurst(durationMs: Int, amplitude: Float) {
        try {
            val sampleRate = 44100
            val numSamples = (durationMs * sampleRate) / 1000
            val buffer = ShortArray(numSamples)
            val random = java.util.Random()

            for (i in 0 until numSamples) {
                val progress = i.toDouble() / numSamples
                val envelope = sin(Math.PI * progress)
                val whiteNoise = (random.nextDouble() * 2.0 - 1.0)
                buffer[i] = (whiteNoise * amplitude * envelope * Short.MAX_VALUE).toInt().toShort()
            }

            val audioTrack = AudioTrack.Builder()
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .setUsage(AudioAttributes.USAGE_ASSISTANCE_SONIFICATION)
                        .build()
                )
                .setAudioFormat(
                    AudioFormat.Builder()
                        .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                        .setSampleRate(sampleRate)
                        .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                        .build()
                )
                .setBufferSizeInBytes(buffer.size * 2)
                .setTransferMode(AudioTrack.MODE_STATIC)
                .build()

            audioTrack.write(buffer, 0, buffer.size)
            audioTrack.play()
            Thread.sleep(durationMs.toLong() + 30)
            audioTrack.release()
        } catch (_: Exception) {}
    }
}
