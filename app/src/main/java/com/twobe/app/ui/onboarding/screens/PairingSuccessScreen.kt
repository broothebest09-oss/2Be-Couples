package com.twobe.app.ui.onboarding.screens

import android.view.HapticFeedbackConstants
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.components.ButtonVariant
import com.twobe.app.ui.components.CelebrationEffects
import com.twobe.app.ui.components.LucideHeartIcon
import com.twobe.app.ui.components.TwoBeButton
import com.twobe.app.ui.theme.DeepBerry
import com.twobe.app.ui.theme.SoftRose
import com.twobe.app.ui.theme.TwoBeTheme
import com.twobe.app.ui.theme.WarmCream

@Composable
fun PairingSuccessScreen(
    partnerName: String = "Sarah",
    userAvatarEmoji: String = "🐰",
    partnerAvatarEmoji: String = "🌸",
    onStartJourney: () -> Unit
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val view = LocalView.current

    val avatarScale = remember { Animatable(0.4f) }
    val glowAlpha = remember { Animatable(0f) }

    LaunchedEffect(Unit) {
        view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
        glowAlpha.animateTo(
            targetValue = 1f,
            animationSpec = spring(stiffness = Spring.StiffnessLow)
        )
        avatarScale.animateTo(
            targetValue = 1f,
            animationSpec = spring(
                dampingRatio = Spring.DampingRatioMediumBouncy,
                stiffness = Spring.StiffnessLow
            )
        )
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        SoftRose.copy(alpha = 0.45f),
                        WarmCream,
                        colors.background
                    )
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        // Magical floating hearts and celebratory particles
        CelebrationEffects()

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = spacing.large, vertical = spacing.xxLarge),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Spacer(modifier = Modifier.height(spacing.medium))

            // Connected Avatars with Glowing Heart Aura
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.scale(avatarScale.value)
            ) {
                // Glow badge
                Box(
                    modifier = Modifier
                        .size(140.dp)
                        .shadow(
                            elevation = 28.dp,
                            shape = CircleShape,
                            ambientColor = DeepBerry.copy(alpha = 0.35f),
                            spotColor = SoftRose.copy(alpha = 0.6f)
                        )
                        .clip(CircleShape)
                        .background(
                            Brush.linearGradient(
                                listOf(SoftRose, DeepBerry.copy(alpha = 0.95f))
                            )
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Text(text = userAvatarEmoji, fontSize = 34.sp)
                        Box(
                            modifier = Modifier
                                .padding(horizontal = 6.dp)
                                .size(28.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            LucideHeartIcon(tint = Color.White, filled = true, size = 26.dp)
                        }
                        Text(text = partnerAvatarEmoji, fontSize = 34.sp)
                    }
                }

                Spacer(modifier = Modifier.height(spacing.xLarge))

                Text(
                    text = "You're connected with $partnerName!",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                    color = colors.textPrimary,
                    textAlign = TextAlign.Center,
                    lineHeight = 34.sp
                )

                Text(
                    text = "Your private world is ready. Everything between you is end-to-end encrypted and belongs to only you two.",
                    fontSize = 15.sp,
                    color = colors.textSecondary,
                    textAlign = TextAlign.Center,
                    lineHeight = 22.sp,
                    modifier = Modifier.padding(top = spacing.small, start = 12.dp, end = 12.dp)
                )
            }

            // Big Start Journey CTA Button
            TwoBeButton(
                text = "Start your journey",
                onClick = {
                    view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                    onStartJourney()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = spacing.medium),
                variant = ButtonVariant.PRIMARY
            )
        }
    }
}
