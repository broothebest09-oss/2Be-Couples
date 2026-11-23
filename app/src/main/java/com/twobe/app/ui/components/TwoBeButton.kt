package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.waitForUpOrCancellation
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.theme.ButtonCornerRadius
import com.twobe.app.ui.theme.ButtonShape
import com.twobe.app.ui.theme.DeepBerry
import com.twobe.app.ui.theme.SoftRose
import com.twobe.app.ui.theme.TwoBeTheme
import kotlinx.coroutines.launch

enum class ButtonVariant {
    PRIMARY,
    SECONDARY,
    OUTLINE,
    GHOST
}

/**
 * Tactile button with spring physics on press (scale 1.0 -> 0.94 -> 1.0) and haptic feedback.
 * Adheres to 44dp minimum touch target.
 */
@Composable
fun TwoBeButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.PRIMARY,
    enabled: Boolean = true,
    shape: Shape = ButtonShape,
    minHeight: Dp = 48.dp,
    icon: (@Composable () -> Unit)? = null
) {
    val scale = remember { Animatable(1f) }
    val scope = rememberCoroutineScope()
    val view = LocalView.current

    val colors = TwoBeTheme.colors

    val (bgBrush, textColor) = when (variant) {
        ButtonVariant.PRIMARY -> {
            Brush.horizontalGradient(
                colors = listOf(SoftRose, DeepBerry.copy(alpha = 0.85f))
            ) to Color.White
        }
        ButtonVariant.SECONDARY -> {
            Brush.linearGradient(
                colors = listOf(colors.surfaceVariant, colors.surface)
            ) to colors.textPrimary
        }
        ButtonVariant.OUTLINE -> {
            Brush.linearGradient(
                colors = listOf(Color.Transparent, Color.Transparent)
            ) to colors.accent
        }
        ButtonVariant.GHOST -> {
            Brush.linearGradient(
                colors = listOf(Color.Transparent, Color.Transparent)
            ) to colors.textSecondary
        }
    }

    Box(
        modifier = modifier
            .scale(scale.value)
            .shadow(
                elevation = if (variant == ButtonVariant.PRIMARY && enabled) 6.dp else 0.dp,
                shape = shape,
                ambientColor = DeepBerry.copy(alpha = 0.2f),
                spotColor = SoftRose.copy(alpha = 0.35f)
            )
            .clip(shape)
            .background(brush = bgBrush)
            .pointerInput(enabled) {
                if (!enabled) return@pointerInput
                while (true) {
                    awaitPointerEventScope {
                        awaitFirstDown(requireUnconsumed = false)
                        scope.launch {
                            scale.animateTo(
                                targetValue = 0.94f,
                                animationSpec = spring(
                                    dampingRatio = Spring.DampingRatioMediumBouncy,
                                    stiffness = Spring.StiffnessMediumLow
                                )
                            )
                        }
                        val up = waitForUpOrCancellation()
                        scope.launch {
                            scale.animateTo(
                                targetValue = 1f,
                                animationSpec = spring(
                                    dampingRatio = Spring.DampingRatioMediumBouncy,
                                    stiffness = Spring.StiffnessMediumLow
                                )
                            )
                        }
                        if (up != null) {
                            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                            onClick()
                        }
                    }
                }
            }
            .defaultMinSize(minHeight = minHeight, minWidth = TwoBeTheme.spacing.minTouchTarget)
            .padding(horizontal = TwoBeTheme.spacing.large, vertical = TwoBeTheme.spacing.xSmall),
        contentAlignment = Alignment.Center
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            if (icon != null) {
                icon()
                Box(modifier = Modifier.padding(start = TwoBeTheme.spacing.xxSmall))
            }
            Text(
                text = text,
                color = textColor,
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}
