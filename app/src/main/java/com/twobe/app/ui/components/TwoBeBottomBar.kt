package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.navigation.TwoBeTab
import com.twobe.app.ui.theme.TwoBeTheme

@Composable
fun TwoBeBottomBar(
    currentTab: TwoBeTab,
    onTabSelected: (TwoBeTab) -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val view = LocalView.current

    Box(
        modifier = modifier
            .fillMaxWidth()
            .shadow(
                elevation = 16.dp,
                shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
                ambientColor = colors.accent.copy(alpha = 0.08f),
                spotColor = colors.primary.copy(alpha = 0.2f)
            )
            .clip(RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp))
            .background(colors.surface)
            .navigationBarsPadding()
            .height(68.dp)
            .padding(horizontal = spacing.medium),
        contentAlignment = Alignment.Center
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            TwoBeTab.values().forEach { tab ->
                val isSelected = currentTab == tab

                // Spring physics for icon scale and color
                val iconScale by animateFloatAsState(
                    targetValue = if (isSelected) 1.12f else 1.0f,
                    animationSpec = spring(
                        dampingRatio = Spring.DampingRatioMediumBouncy,
                        stiffness = Spring.StiffnessMediumLow
                    ),
                    label = "tabScale"
                )

                val tintColor by animateColorAsState(
                    targetValue = if (isSelected) colors.accent else colors.textSecondary,
                    animationSpec = spring(stiffness = Spring.StiffnessLow),
                    label = "tabColor"
                )

                Column(
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null
                        ) {
                            if (!isSelected) {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                onTabSelected(tab)
                            }
                        }
                        .padding(horizontal = spacing.small, vertical = 6.dp)
                        .scale(iconScale),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Box(modifier = Modifier.size(26.dp), contentAlignment = Alignment.Center) {
                        when (tab) {
                            TwoBeTab.HOME -> LucideHomeIcon(
                                tint = tintColor,
                                filled = isSelected,
                                size = 24.dp
                            )
                            TwoBeTab.CHAT -> LucideMessageIcon(
                                tint = tintColor,
                                filled = isSelected,
                                size = 24.dp
                            )
                            TwoBeTab.US -> LucideHeartIcon(
                                tint = tintColor,
                                filled = isSelected,
                                size = 24.dp
                            )
                            TwoBeTab.AVATAR -> LucideUserIcon(
                                tint = tintColor,
                                filled = isSelected,
                                size = 24.dp
                            )
                        }
                    }

                    Text(
                        text = tab.title,
                        fontSize = 11.sp,
                        fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal,
                        color = tintColor,
                        modifier = Modifier.padding(top = 2.dp)
                    )
                }
            }
        }
    }
}
