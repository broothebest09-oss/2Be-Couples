package com.twobe.app.ui.onboarding

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.data.OnboardingPreferences
import com.twobe.app.data.PRESET_AVATARS
import com.twobe.app.ui.onboarding.screens.CreateProfileScreen
import com.twobe.app.ui.onboarding.screens.OnboardingSplashScreen
import com.twobe.app.ui.onboarding.screens.PairingConfirmScreen
import com.twobe.app.ui.onboarding.screens.PairingInviteScreen
import com.twobe.app.ui.onboarding.screens.PairingSuccessScreen
import com.twobe.app.ui.onboarding.screens.SignUpScreen
import com.twobe.app.ui.onboarding.screens.WelcomeScreen
import com.twobe.app.ui.theme.TwoBeTheme

@Composable
fun OnboardingFlow(
    onPairingComplete: (partnerName: String) -> Unit
) {
    val context = LocalContext.current
    val prefs = remember { OnboardingPreferences(context) }
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing

    // Edge case: If user already paired, skip onboarding immediately
    if (prefs.isPaired()) {
        LaunchedEffect(Unit) {
            onPairingComplete(prefs.getPartnerName())
        }
        return
    }

    // State loaded from cache/preferences to support "resume from last step on next launch"
    var currentStep by remember { mutableStateOf(prefs.getSavedStep()) }
    var email by remember { mutableStateOf("") }
    var displayName by remember { mutableStateOf(prefs.getDisplayName()) }
    var partnerNickname by remember { mutableStateOf(prefs.getPartnerNickname()) }
    var selectedAvatarId by remember { mutableStateOf(prefs.getAvatarId()) }
    var generatedInviteCode by remember { mutableStateOf("2BE-8842") }
    var partnerName by remember { mutableStateOf(prefs.getPartnerName()) }
    var isInviteExpired by remember { mutableStateOf(false) }
    var isNetworkOffline by remember { mutableStateOf(false) }

    fun updateStep(step: OnboardingStep) {
        currentStep = step
        prefs.saveStep(step)
    }

    val userAvatarEmoji = PRESET_AVATARS.find { it.id == selectedAvatarId }?.emoji ?: "🐰"

    Column(modifier = Modifier.fillMaxSize()) {
        // Network Offline Warning banner if offline
        if (isNetworkOffline) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(colors.accent)
                    .padding(horizontal = spacing.medium, vertical = spacing.xxSmall)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "⚡ Offline Mode: Cached state loaded.",
                        color = Color.White,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium,
                        modifier = Modifier.weight(1f)
                    )
                    Text(
                        text = "Retry",
                        color = Color.White,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier
                            .clip(RoundedCornerShape(4.dp))
                            .clickable { isNetworkOffline = false }
                            .padding(4.dp)
                    )
                }
            }
        }

        Box(modifier = Modifier.fillMaxSize()) {
            AnimatedContent(
                targetState = currentStep,
                transitionSpec = {
                    fadeIn(
                        animationSpec = spring(
                            dampingRatio = Spring.DampingRatioNoBouncy,
                            stiffness = Spring.StiffnessMediumLow
                        )
                    ) togetherWith fadeOut(
                        animationSpec = spring(
                            dampingRatio = Spring.DampingRatioNoBouncy,
                            stiffness = Spring.StiffnessMediumLow
                        )
                    )
                },
                label = "OnboardingTransitions"
            ) { step ->
                when (step) {
                    OnboardingStep.SPLASH -> {
                        OnboardingSplashScreen(
                            onTimeout = {
                                updateStep(OnboardingStep.WELCOME)
                            }
                        )
                    }

                    OnboardingStep.WELCOME -> {
                        WelcomeScreen(
                            onGetStarted = {
                                updateStep(OnboardingStep.SIGN_UP)
                            },
                            onLoginClick = {
                                updateStep(OnboardingStep.SIGN_UP)
                            }
                        )
                    }

                    OnboardingStep.SIGN_UP -> {
                        SignUpScreen(
                            initialEmail = email,
                            onVerified = { verifiedEmail ->
                                email = verifiedEmail
                                updateStep(OnboardingStep.CREATE_PROFILE)
                            },
                            onBack = {
                                updateStep(OnboardingStep.WELCOME)
                            }
                        )
                    }

                    OnboardingStep.CREATE_PROFILE -> {
                        CreateProfileScreen(
                            initialDisplayName = displayName,
                            initialPartnerNickname = partnerNickname,
                            initialAvatarId = selectedAvatarId,
                            onContinue = { name, nickname, avatarId ->
                                displayName = name
                                partnerNickname = nickname
                                selectedAvatarId = avatarId
                                prefs.saveProfile(name, nickname, avatarId)
                                updateStep(OnboardingStep.PAIRING_INVITE)
                            },
                            onBack = {
                                updateStep(OnboardingStep.SIGN_UP)
                            }
                        )
                    }

                    OnboardingStep.PAIRING_INVITE -> {
                        PairingInviteScreen(
                            generatedCode = generatedInviteCode,
                            partnerNickname = if (partnerNickname.isNotEmpty()) partnerNickname else "Partner",
                            isInviteExpired = isInviteExpired,
                            onPartnerCodeEntered = { code ->
                                partnerName = "Sarah"
                                updateStep(OnboardingStep.PAIRING_CONFIRM)
                            },
                            onPartnerJoinedSimulated = {
                                partnerName = "Sarah"
                                updateStep(OnboardingStep.PAIRING_CONFIRM)
                            },
                            onResendInvite = {
                                isInviteExpired = false
                                generatedInviteCode = "2BE-${(1000..9999).random()}"
                            },
                            onBack = {
                                updateStep(OnboardingStep.CREATE_PROFILE)
                            }
                        )
                    }

                    OnboardingStep.PAIRING_CONFIRM -> {
                        PairingConfirmScreen(
                            partnerName = partnerName,
                            partnerAvatarEmoji = "🌸",
                            onConfirmed = {
                                updateStep(OnboardingStep.PAIRING_SUCCESS)
                            },
                            onBack = {
                                updateStep(OnboardingStep.PAIRING_INVITE)
                            }
                        )
                    }

                    OnboardingStep.PAIRING_SUCCESS -> {
                        PairingSuccessScreen(
                            partnerName = partnerName,
                            userAvatarEmoji = userAvatarEmoji,
                            partnerAvatarEmoji = "🌸",
                            onStartJourney = {
                                prefs.setPaired(true, partnerName)
                                updateStep(OnboardingStep.PAIRED_COMPLETE)
                                onPairingComplete(partnerName)
                            }
                        )
                    }

                    OnboardingStep.PAIRED_COMPLETE -> {
                        // Handled by onPairingComplete
                    }
                }
            }
        }
    }
}
