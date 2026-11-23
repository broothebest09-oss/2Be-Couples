package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
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
import com.twobe.app.ui.theme.TwoBeTheme
import kotlinx.coroutines.launch

@Composable
fun ScratchOffMessageBubble(
    secretText: String,
    senderIsMe: Boolean,
    modifier: Modifier = Modifier
) {
    val colors = TwoBeTheme.colors
    val view = LocalView.current
    val scope = rememberCoroutineScope()

    var isRevealed by remember { mutableStateOf(false) }
    val revealScale = remember { Animatable(1f) }

    Box(
        modifier = modifier
            .width(260.dp)
            .shadow(
                elevation = 4.dp,
                shape = RoundedCornerShape(16.dp),
                ambientColor = colors.accent.copy(alpha = 0.1f)
            )
            .clip(RoundedCornerShape(16.dp))
            .background(colors.surface)
            .border(1.dp, colors.border, RoundedCornerShape(16.dp))
            .padding(12.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "SECRET SCRATCH TICKET",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = colors.accent,
                letterSpacing = 1.sp
            )

            Spacer(modifier = Modifier.height(8.dp))

            if (!isRevealed) {
                // Shimmering Metallic Foil Card
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(80.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(
                            Brush.linearGradient(
                                listOf(
                                    Color(0xFFE2D9D2),
                                    Color(0xFFF7F1EC),
                                    Color(0xFFD8CFC8),
                                    Color(0xFFF7F1EC)
                                )
                            )
                        )
                        .clickable {
                            view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                            scope.launch {
                                revealScale.animateTo(
                                    0.94f,
                                    spring(dampingRatio = Spring.DampingRatioMediumBouncy)
                                )
                                isRevealed = true
                                revealScale.animateTo(
                                    1f,
                                    spring(dampingRatio = Spring.DampingRatioMediumBouncy)
                                )
                            }
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(text = "✨", fontSize = 20.sp)
                        Text(
                            text = "Tap to scratch & reveal",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF6B585C)
                        )
                    }
                }
            } else {
                // Revealed intimate secret
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(80.dp)
                        .scale(revealScale.value)
                        .clip(RoundedCornerShape(12.dp))
                        .background(colors.primary.copy(alpha = 0.2f))
                        .border(1.dp, colors.primary.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                        .padding(12.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "“$secretText”",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary,
                        textAlign = TextAlign.Center,
                        lineHeight = 20.sp
                    )
                }
            }
        }
    }
}
