package com.twobe.app.ui.onboarding.screens

import android.view.HapticFeedbackConstants
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.components.ButtonVariant
import com.twobe.app.ui.components.LucideHeartIcon
import com.twobe.app.ui.components.LucideMessageIcon
import com.twobe.app.ui.components.TwoBeButton
import com.twobe.app.ui.components.TwoBeCard
import com.twobe.app.ui.theme.DeepBerry
import com.twobe.app.ui.theme.SoftRose
import com.twobe.app.ui.theme.TwoBeTheme

data class FeatureItem(
    val title: String,
    val description: String,
    val iconType: String // "chat", "memories", "moments"
)

@Composable
fun WelcomeScreen(
    onGetStarted: () -> Unit,
    onLoginClick: () -> Unit
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val view = LocalView.current

    val features = listOf(
        FeatureItem("Private chats", "End-to-end encrypted messaging, voice notes & secret kisses", "chat"),
        FeatureItem("Shared memories", "Milestone timeline, shared albums & time capsules", "memories"),
        FeatureItem("Intimate moments", "Cycle tracking, daily check-ins & couple bucket list", "moments")
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        colors.gradientStart,
                        colors.background,
                        colors.gradientEnd
                    )
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = spacing.large, vertical = spacing.xLarge),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                // Heart Icon
                Box(
                    modifier = Modifier
                        .size(72.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.linearGradient(listOf(SoftRose, DeepBerry.copy(alpha = 0.85f)))
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    LucideHeartIcon(tint = androidx.compose.ui.graphics.Color.White, filled = true, size = 36.dp)
                }

                Spacer(modifier = Modifier.height(spacing.medium))

                Text(
                    text = "A private world for just the two of you",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                    color = colors.textPrimary,
                    textAlign = TextAlign.Center,
                    lineHeight = 34.sp
                )

                Text(
                    text = "2Be is your intimate space to connect, share, and grow together",
                    fontSize = 15.sp,
                    color = colors.textSecondary,
                    textAlign = TextAlign.Center,
                    lineHeight = 22.sp,
                    modifier = Modifier.padding(top = spacing.small)
                )

                Spacer(modifier = Modifier.height(spacing.large))

                // Three feature highlights with icons
                features.forEach { feature ->
                    TwoBeCard(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = spacing.xxSmall),
                        elevation = 2.dp
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(44.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(colors.primary.copy(alpha = 0.2f)),
                                contentAlignment = Alignment.Center
                            ) {
                                when (feature.iconType) {
                                    "chat" -> LucideMessageIcon(tint = colors.accent, filled = true, size = 22.dp)
                                    "memories" -> Text(text = "📸", fontSize = 20.sp)
                                    else -> LucideHeartIcon(tint = colors.accent, filled = true, size = 22.dp)
                                }
                            }

                            Column(modifier = Modifier.padding(start = spacing.small)) {
                                Text(
                                    text = feature.title,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = colors.textPrimary
                                )
                                Text(
                                    text = feature.description,
                                    fontSize = 12.sp,
                                    color = colors.textSecondary,
                                    modifier = Modifier.padding(top = 2.dp)
                                )
                            }
                        }
                    }
                }
            }

            // Bottom Buttons
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = spacing.large),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                TwoBeButton(
                    text = "Get Started",
                    onClick = onGetStarted,
                    modifier = Modifier.fillMaxWidth(),
                    variant = ButtonVariant.PRIMARY
                )

                Spacer(modifier = Modifier.height(spacing.small))

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .clickable {
                            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                            onLoginClick()
                        }
                        .padding(horizontal = spacing.medium, vertical = spacing.xxSmall)
                ) {
                    Text(
                        text = "Already have an account? Log in",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium,
                        color = colors.accent
                    )
                }
            }
        }
    }
}
