package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.waitForUpOrCancellation
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.theme.LocalTwoBeColors

/**
 * 1. Button Press Animation:
 * Scales down to 0.95 on pointer down, springs back on release with light tactile haptic.
 */
fun Modifier.pressScaleEffect(
    targetScale: Float = 0.95f,
    onClick: (() -> Unit)? = null
): Modifier = composed {
    val scale = remember { Animatable(1f) }
    val view = LocalView.current

    this
        .scale(scale.value)
        .pointerInput(Unit) {
            awaitPointerEventScope {
                while (true) {
                    awaitFirstDown(requireUnconsumed = false)
                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                    scale.animateTo(
                        targetValue = targetScale,
                        animationSpec = spring(
                            dampingRatio = Spring.DampingRatioMediumBouncy,
                            stiffness = Spring.StiffnessHigh
                        )
                    )
                    val up = waitForUpOrCancellation()
                    scale.animateTo(
                        targetValue = 1f,
                        animationSpec = spring(
                            dampingRatio = Spring.DampingRatioMediumBouncy,
                            stiffness = Spring.StiffnessMedium
                        )
                    )
                    if (up != null && onClick != null) {
                        onClick()
                    }
                }
            }
        }
}

/**
 * 2. Error State Shake Animation:
 * Shakes horizontally when trigger is true
 */
fun Modifier.shakeEffect(trigger: Boolean): Modifier = composed {
    val shakeOffset = remember { Animatable(0f) }

    LaunchedEffect(trigger) {
        if (trigger) {
            for (i in 0..4) {
                shakeOffset.animateTo(12f, tween(30, easing = LinearEasing))
                shakeOffset.animateTo(-12f, tween(30, easing = LinearEasing))
            }
            shakeOffset.animateTo(0f, tween(30, easing = LinearEasing))
        }
    }

    this.graphicsLayer {
        translationX = shakeOffset.value
    }
}

/**
 * 3. Pull to Refresh Custom Animation:
 * Romantic pulsing heart instead of standard spinner
 */
@Composable
fun PullToRefreshHeartIndicator(
    isRefreshing: Boolean,
    modifier: Modifier = Modifier
) {
    val colors = LocalTwoBeColors.current
    val infiniteTransition = rememberInfiniteTransition(label = "heart_pulse")
    
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 0.85f,
        targetValue = 1.25f,
        animationSpec = infiniteRepeatable(
            animation = tween(600, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse_scale"
    )

    val glowAlpha by infiniteTransition.animateFloat(
        initialValue = 0.2f,
        targetValue = 0.6f,
        animationSpec = infiniteRepeatable(
            animation = tween(600, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "glow_alpha"
    )

    if (isRefreshing) {
        Box(
            modifier = modifier
                .fillMaxWidth()
                .padding(vertical = 16.dp),
            contentAlignment = Alignment.Center
        ) {
            // Radiant glow
            Box(
                modifier = Modifier
                    .size(54.dp)
                    .scale(pulseScale)
                    .background(colors.primary.copy(alpha = glowAlpha), CircleShape)
            )

            // Pulsing Heart Icon
            Box(
                modifier = Modifier
                    .size(42.dp)
                    .scale(pulseScale),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "💖", fontSize = 24.sp)
            }
        }
    }
}
