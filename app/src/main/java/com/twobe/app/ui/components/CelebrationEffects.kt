package com.twobe.app.ui.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Fill
import com.twobe.app.ui.theme.DeepBerry
import com.twobe.app.ui.theme.SoftRose
import com.twobe.app.ui.theme.SuccessGreen
import com.twobe.app.ui.theme.WarmCream
import kotlin.random.Random

data class FloatingParticle(
    val initialX: Float, // 0f to 1f
    val speed: Float,
    val size: Float,
    val color: Color,
    val isHeart: Boolean,
    val swayPhase: Float
)

@Composable
fun CelebrationEffects(
    modifier: Modifier = Modifier
) {
    val particles = remember {
        val colors = listOf(SoftRose, DeepBerry, SuccessGreen, Color(0xFFFFD166), Color(0xFFEF476F))
        List(30) {
            FloatingParticle(
                initialX = Random.nextFloat(),
                speed = 0.5f + Random.nextFloat() * 0.8f,
                size = 12f + Random.nextFloat() * 18f,
                color = colors[Random.nextInt(colors.size)],
                isHeart = Random.nextBoolean(),
                swayPhase = Random.nextFloat() * 6.28f
            )
        }
    }

    val transition = rememberInfiniteTransition(label = "celebration")
    val progress = transition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 3500, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "particleProgress"
    )

    Canvas(modifier = modifier.fillMaxSize()) {
        val canvasWidth = size.width
        val canvasHeight = size.height

        particles.forEach { p ->
            val totalProgress = (progress.value * p.speed) % 1f
            val y = canvasHeight * (1f - totalProgress)
            val sway = kotlin.math.sin(totalProgress * 6.28f + p.swayPhase) * 35f
            val x = (p.initialX * canvasWidth + sway).coerceIn(0f, canvasWidth)
            val alpha = (1f - totalProgress).coerceIn(0.2f, 1f)

            if (p.isHeart) {
                // Draw mini heart
                val heartPath = Path().apply {
                    val s = p.size
                    moveTo(x, y + s * 0.35f)
                    cubicTo(x - s * 0.5f, y, x - s * 0.5f, y - s * 0.5f, x, y - s * 0.2f)
                    cubicTo(x + s * 0.5f, y - s * 0.5f, x + s * 0.5f, y, x, y + s * 0.35f)
                    close()
                }
                drawPath(heartPath, color = p.color.copy(alpha = alpha), style = Fill)
            } else {
                // Confetti particle
                drawCircle(
                    color = p.color.copy(alpha = alpha),
                    radius = p.size * 0.3f,
                    center = Offset(x, y)
                )
            }
        }
    }
}
