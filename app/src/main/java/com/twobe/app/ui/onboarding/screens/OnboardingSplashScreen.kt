package com.twobe.app.ui.onboarding.screens

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.components.LucideHeartIcon
import com.twobe.app.ui.theme.DeepBerry
import com.twobe.app.ui.theme.SoftRose
import com.twobe.app.ui.theme.TwoBeTheme
import com.twobe.app.ui.theme.WarmCream
import kotlinx.coroutines.delay

@Composable
fun OnboardingSplashScreen(
    onTimeout: () -> Unit
) {
    val scale = remember { Animatable(1f) }

    LaunchedEffect(Unit) {
        scale.animateTo(
            targetValue = 1.08f,
            animationSpec = infiniteRepeatable(
                animation = tween(750, easing = FastOutSlowInEasing),
                repeatMode = RepeatMode.Reverse
            )
        )
    }

    LaunchedEffect(Unit) {
        delay(1500L) // 1.5s auto advance
        onTimeout()
    }

    val colors = TwoBeTheme.colors

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        SoftRose.copy(alpha = 0.5f),
                        WarmCream,
                        colors.background
                    )
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .size(108.dp)
                    .scale(scale.value)
                    .shadow(
                        elevation = 20.dp,
                        shape = CircleShape,
                        ambientColor = DeepBerry.copy(alpha = 0.25f),
                        spotColor = SoftRose.copy(alpha = 0.45f)
                    )
                    .clip(CircleShape)
                    .background(
                        Brush.linearGradient(
                            listOf(SoftRose, DeepBerry.copy(alpha = 0.9f))
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                LucideHeartIcon(
                    tint = Color.White,
                    filled = true,
                    size = 52.dp
                )
            }

            Text(
                text = "2Be",
                fontSize = 42.sp,
                fontWeight = FontWeight.Bold,
                color = colors.textPrimary,
                letterSpacing = (-1).sp,
                modifier = Modifier.padding(top = 24.dp)
            )

            Text(
                text = "The Private World for Two",
                fontSize = 15.sp,
                fontWeight = FontWeight.Medium,
                color = colors.textSecondary,
                modifier = Modifier.padding(top = 8.dp)
            )
        }
    }
}
