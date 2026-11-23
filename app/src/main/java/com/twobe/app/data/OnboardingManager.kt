package com.twobe.app.data

import android.content.Context
import android.content.SharedPreferences
import com.twobe.app.ui.onboarding.OnboardingStep

data class PresetAvatar(
    val id: String,
    val name: String,
    val emoji: String,
    val tag: String // "girl", "boy", "neutral"
)

val PRESET_AVATARS = listOf(
    PresetAvatar("1", "Daisy", "🌸", "girl"),
    PresetAvatar("2", "Blossom", "🎀", "girl"),
    PresetAvatar("3", "Bunny", "🐰", "neutral"),
    PresetAvatar("4", "Kitten", "🐱", "neutral"),
    PresetAvatar("5", "Bear", "🧸", "neutral"),
    PresetAvatar("6", "Sparky", "⚡", "boy"),
    PresetAvatar("7", "Fox", "🦊", "boy"),
    PresetAvatar("8", "Star", "✨", "neutral")
)

data class OnboardingData(
    val currentStep: OnboardingStep = OnboardingStep.SPLASH,
    val emailOrPhone: String = "",
    val displayName: String = "",
    val partnerNickname: String = "",
    val selectedAvatarId: String = "1",
    val generatedInviteCode: String = "2BE-8842",
    val partnerCode: String = "",
    val partnerName: String = "Sarah",
    val partnerAvatarEmoji: String = "🌸",
    val isPaired: Boolean = false,
    val isInviteExpired: Boolean = false,
    val isNetworkOffline: Boolean = false
)

class OnboardingPreferences(context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("twobe_onboarding_prefs", Context.MODE_PRIVATE)

    companion object {
        private const val KEY_STEP = "onboarding_step"
        private const val KEY_EMAIL = "user_email"
        private const val KEY_DISPLAY_NAME = "user_display_name"
        private const val KEY_PARTNER_NICKNAME = "partner_nickname"
        private const val KEY_AVATAR_ID = "avatar_id"
        private const val KEY_INVITE_CODE = "invite_code"
        private const val KEY_PARTNER_NAME = "partner_name"
        private const val KEY_IS_PAIRED = "is_paired"
    }

    fun saveStep(step: OnboardingStep) {
        prefs.edit().putString(KEY_STEP, step.name).apply()
    }

    fun getSavedStep(): OnboardingStep {
        val name = prefs.getString(KEY_STEP, OnboardingStep.SPLASH.name)
        return try {
            OnboardingStep.valueOf(name ?: OnboardingStep.SPLASH.name)
        } catch (e: Exception) {
            OnboardingStep.SPLASH
        }
    }

    fun saveProfile(displayName: String, partnerNickname: String, avatarId: String) {
        prefs.edit()
            .putString(KEY_DISPLAY_NAME, displayName)
            .putString(KEY_PARTNER_NICKNAME, partnerNickname)
            .putString(KEY_AVATAR_ID, avatarId)
            .apply()
    }

    fun getDisplayName(): String = prefs.getString(KEY_DISPLAY_NAME, "") ?: ""
    fun getPartnerNickname(): String = prefs.getString(KEY_PARTNER_NICKNAME, "") ?: ""
    fun getAvatarId(): String = prefs.getString(KEY_AVATAR_ID, "1") ?: "1"

    fun setPaired(paired: Boolean, partnerName: String = "Sarah") {
        prefs.edit()
            .putBoolean(KEY_IS_PAIRED, paired)
            .putString(KEY_PARTNER_NAME, partnerName)
            .putString(KEY_STEP, if (paired) OnboardingStep.PAIRED_COMPLETE.name else OnboardingStep.WELCOME.name)
            .apply()
    }

    fun isPaired(): Boolean = prefs.getBoolean(KEY_IS_PAIRED, false)
    fun getPartnerName(): String = prefs.getString(KEY_PARTNER_NAME, "Sarah") ?: "Sarah"

    fun clearAll() {
        prefs.edit().clear().apply()
    }
}
