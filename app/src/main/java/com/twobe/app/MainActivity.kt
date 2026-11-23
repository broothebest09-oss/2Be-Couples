package com.twobe.app

import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.fragment.app.FragmentActivity
import com.twobe.app.data.OnboardingPreferences
import com.twobe.app.ui.components.TwoBeBottomBar
import com.twobe.app.ui.components.TwoBeTopBar
import com.twobe.app.ui.navigation.TwoBeTab
import com.twobe.app.ui.onboarding.OnboardingFlow
import com.twobe.app.ui.screens.AvatarScreen
import com.twobe.app.ui.screens.BiometricLockScreen
import com.twobe.app.ui.screens.ChatScreen
import com.twobe.app.ui.screens.HomeScreen
import com.twobe.app.ui.screens.SettingsScreen
import com.twobe.app.ui.screens.SplashScreen
import com.twobe.app.ui.screens.UsScreen
import com.twobe.app.ui.theme.ThemeMode
import com.twobe.app.ui.theme.TwoBeTheme

class MainActivity : FragmentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        setContent {
            TwoBeAppRoot()
        }
    }
}

@Composable
fun TwoBeAppRoot() {
    val context = LocalContext.current
    val prefs = remember { OnboardingPreferences(context) }

    // State holders
    var isPaired by remember { mutableStateOf(prefs.isPaired()) }
    var currentThemeMode by remember { mutableStateOf(ThemeMode.SYSTEM) }
    var biometricLockEnabled by remember { mutableStateOf(false) }
    var isAppLocked by remember { mutableStateOf(false) }
    var inSettings by remember { mutableStateOf(false) }
    var currentTab by remember { mutableStateOf(TwoBeTab.HOME) }
    var partnerName by remember { mutableStateOf(prefs.getPartnerName()) }

    TwoBeTheme(themeMode = currentThemeMode) {
        val colors = TwoBeTheme.colors

        when {
            // Unpaired flow (Onboarding 7 screens with persistence & edge cases)
            !isPaired -> {
                OnboardingFlow(
                    onPairingComplete = { connectedPartner ->
                        partnerName = connectedPartner
                        isPaired = true
                    }
                )
            }

            // Biometric lock gate if enabled
            isAppLocked && biometricLockEnabled -> {
                BiometricLockScreen(
                    onUnlock = {
                        isAppLocked = false
                    }
                )
            }

            // In Settings
            inSettings -> {
                SettingsScreen(
                    currentThemeMode = currentThemeMode,
                    onThemeModeChange = { currentThemeMode = it },
                    biometricLockEnabled = biometricLockEnabled,
                    onBiometricLockToggle = { enabled ->
                        biometricLockEnabled = enabled
                        if (!enabled) isAppLocked = false
                    },
                    onBack = { inSettings = false }
                )
            }

            // Main Paired Sanctuary Shell
            else -> {
                Scaffold(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(colors.background),
                    topBar = {
                        Box(modifier = Modifier.statusBarsPadding()) {
                            TwoBeTopBar(
                                currentTab = currentTab,
                                partnerName = partnerName,
                                partnerOnline = true,
                                onOpenSettings = { inSettings = true }
                            )
                        }
                    },
                    bottomBar = {
                        TwoBeBottomBar(
                            currentTab = currentTab,
                            onTabSelected = { currentTab = it }
                        )
                    },
                    containerColor = colors.background
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    ) {
                        AnimatedContent(
                            targetState = currentTab,
                            transitionSpec = {
                                val direction = if (targetState.ordinal > initialState.ordinal) 1 else -1
                                val slideIn = slideInHorizontally(
                                    initialOffsetX = { fullWidth -> (fullWidth * 0.12f * direction).toInt() },
                                    animationSpec = spring(
                                        dampingRatio = Spring.DampingRatioNoBouncy,
                                        stiffness = Spring.StiffnessMediumLow
                                    )
                                ) + fadeIn(animationSpec = tween(220))
                                val slideOut = slideOutHorizontally(
                                    targetOffsetX = { fullWidth -> (-fullWidth * 0.12f * direction).toInt() },
                                    animationSpec = spring(
                                        dampingRatio = Spring.DampingRatioNoBouncy,
                                        stiffness = Spring.StiffnessMediumLow
                                    )
                                ) + fadeOut(animationSpec = tween(180))
                                slideIn togetherWith slideOut
                            },
                            label = "TabContentAnimation"
                        ) { targetTab ->
                            when (targetTab) {
                                TwoBeTab.HOME -> {
                                    val userEmoji = PRESET_AVATARS.find { it.id == prefs.getAvatarId() }?.emoji ?: "🐰"
                                    HomeScreen(
                                        partnerName = partnerName,
                                        userAvatarEmoji = userEmoji,
                                        partnerAvatarEmoji = "🌸",
                                        streakDays = 15,
                                        onNavigateToAvatar = { currentTab = TwoBeTab.AVATAR },
                                        onNavigateToChat = { _ -> currentTab = TwoBeTab.CHAT },
                                        onOpenSettings = { inSettings = true }
                                    )
                                }
                                TwoBeTab.CHAT -> ChatScreen(
                                    partnerName = partnerName,
                                    partnerAvatarEmoji = "🌸",
                                    onNavigateToPartnerProfile = { currentTab = TwoBeTab.AVATAR }
                                )
                                TwoBeTab.US -> {
                                    val userEmoji = PRESET_AVATARS.find { it.id == prefs.getAvatarId() }?.emoji ?: "🐰"
                                    UsScreen(
                                        partnerName = partnerName,
                                        userName = prefs.getDisplayName().ifBlank { "Alex" },
                                        userAvatarEmoji = userEmoji,
                                        partnerAvatarEmoji = "🌸"
                                    )
                                }
                                TwoBeTab.AVATAR -> AvatarScreen(
                                    partnerName = partnerName
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
