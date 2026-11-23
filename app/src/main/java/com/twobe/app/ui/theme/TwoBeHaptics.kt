package com.twobe.app.ui.theme

import android.content.Context
import android.os.Build
import android.os.CombinedVibration
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.view.HapticFeedbackConstants
import android.view.View

/**
 * Unified Haptic Feedback Engine for 2Be:
 * Provides calibrated romantic and tactile sensations across low-end and high-end Android devices.
 */
object TwoBeHaptics {

    /**
     * Light haptic on button press, pill tap, and minor interactions
     */
    fun lightTap(view: View?) {
        view?.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
    }

    /**
     * Medium haptic on message send and input commits
     */
    fun mediumTap(view: View?) {
        view?.performHapticFeedback(HapticFeedbackConstants.VIRTUAL_KEY)
    }

    /**
     * Strong haptic on kiss/hug synchronization success and letter sealing
     */
    fun strongImpact(view: View?, context: Context? = null) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && context != null) {
            val vibrator = getVibrator(context)
            if (vibrator != null && vibrator.hasVibrator()) {
                val effect = VibrationEffect.createWaveform(
                    longArrayOf(0, 120, 80, 240),
                    intArrayOf(0, 180, 0, 255),
                    -1
                )
                vibrator.vibrate(effect)
                return
            }
        }
        view?.performHapticFeedback(HapticFeedbackConstants.LONG_PRESS)
    }

    /**
     * Success haptic on milestone reached and unlock completed
     */
    fun milestoneBurst(view: View?, context: Context? = null) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && context != null) {
            val vibrator = getVibrator(context)
            if (vibrator != null && vibrator.hasVibrator()) {
                val effect = VibrationEffect.createWaveform(
                    longArrayOf(0, 80, 60, 100, 60, 180),
                    intArrayOf(0, 160, 0, 200, 0, 255),
                    -1
                )
                vibrator.vibrate(effect)
                return
            }
        }
        view?.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
    }

    /**
     * Warning haptic on error, invalid PIN, or boundary reached
     */
    fun warningError(view: View?) {
        view?.performHapticFeedback(HapticFeedbackConstants.REJECT)
    }

    /**
     * Selection haptic on picker changes (calendar, time picker, category wheel)
     */
    fun selectionChange(view: View?) {
        view?.performHapticFeedback(HapticFeedbackConstants.CLOCK_TICK)
    }

    private fun getVibrator(context: Context): Vibrator? {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val manager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
            manager?.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
        }
    }
}
