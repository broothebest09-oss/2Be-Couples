package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.navigation.TwoBeTab
import com.twobe.app.ui.theme.TwoBeTheme

@Composable
fun TwoBeTopBar(
    currentTab: TwoBeTab,
    partnerName: String = "Sarah",
    partnerOnline: Boolean = true,
    onOpenSettings: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val view = LocalView.current

    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(56.dp)
            .padding(horizontal = spacing.medium),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        // Title according to tab specifications
        Row(verticalAlignment = Alignment.CenterVertically) {
            when (currentTab) {
                TwoBeTab.HOME -> {
                    Text(
                        text = "2Be",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary,
                        letterSpacing = (-0.5).sp
                    )
                }
                TwoBeTab.CHAT -> {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        // Partner miniature avatar indicator
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .clip(CircleShape)
                        ) {
                            LucideUserIcon(
                                tint = colors.accent,
                                filled = true,
                                size = 32.dp
                            )
                        }
                        Box(modifier = Modifier.padding(start = spacing.xxSmall))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = partnerName,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = colors.textPrimary
                            )
                            if (partnerOnline) {
                                Box(
                                    modifier = Modifier
                                        .padding(start = 6.dp)
                                        .size(8.dp)
                                        .clip(CircleShape)
                                        .clip(CircleShape)
                                ) {
                                    androidx.compose.foundation.Canvas(modifier = Modifier.size(8.dp)) {
                                        drawCircle(color = colors.success)
                                    }
                                }
                            }
                        }
                    }
                }
                TwoBeTab.US -> {
                    Text(
                        text = "Us & Memories",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )
                }
                TwoBeTab.AVATAR -> {
                    Text(
                        text = "Our Living Avatars",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )
                }
            }
        }

        // Settings accessible via gear icon in top-right of Home and Us tabs
        if (currentTab == TwoBeTab.HOME || currentTab == TwoBeTab.US) {
            Box(
                modifier = Modifier
                    .size(spacing.minTouchTarget)
                    .clip(CircleShape)
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null
                    ) {
                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                        onOpenSettings()
                    },
                contentAlignment = Alignment.Center
            ) {
                LucideSettingsIcon(
                    tint = colors.textSecondary,
                    size = 22.dp
                )
            }
        } else {
            // Spacer to keep layout balanced
            Box(modifier = Modifier.size(spacing.minTouchTarget))
        }
    }
}
