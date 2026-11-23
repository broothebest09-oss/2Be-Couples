package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.theme.DeepBerry
import com.twobe.app.ui.theme.SoftRose
import com.twobe.app.ui.theme.TwoBeTheme
import kotlinx.coroutines.delay

enum class AffectionType(val title: String, val emoji: String, val subtitle: String) {
    KISS("Kiss Delivered!", "💋", "Your partner feels the warmth right now"),
    HUG("Warm Hug Sent!", "🤗", "Wrapping them in comfort from afar")
}

@Composable
fun AffectionSyncOverlay(
    type: AffectionType?,
    onDismiss: () -> Unit
) {
    if (type == null) return

    val view = LocalView.current
    val scale = remember { Animatable(0.5f) }

    LaunchedEffect(type) {
        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
        scale.animateTo(
            targetValue = 1f,
            animationSpec = spring(
                dampingRatio = Spring.DampingRatioMediumBouncy,
                stiffness = Spring.StiffnessMediumLow
            )
        )
        delay(1400L)
        onDismiss()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.45f))
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null
            ) { onDismiss() },
        contentAlignment = Alignment.Center
    ) {
        CelebrationEffects()

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier
                .scale(scale.value)
                .padding(32.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(110.dp)
                    .shadow(
                        elevation = 20.dp,
                        shape = CircleShape,
                        ambientColor = DeepBerry.copy(alpha = 0.3f),
                        spotColor = SoftRose.copy(alpha = 0.5f)
                    )
                    .clip(CircleShape)
                    .background(
                        Brush.linearGradient(
                            if (type == AffectionType.KISS) {
                                listOf(Color(0xFFFF8DA1), Color(0xFFD6336C))
                            } else {
                                listOf(Color(0xFFC084FC), Color(0xFF7E22CE))
                            }
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(text = type.emoji, fontSize = 52.sp)
            }

            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = type.title,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )

            Text(
                text = type.subtitle,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = Color.White.copy(alpha = 0.85f),
                modifier = Modifier.padding(top = 6.dp)
            )
        }
    }
}
