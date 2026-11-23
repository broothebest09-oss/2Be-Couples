package com.twobe.app.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.keyframes
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.RoundRect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.screens.GratitudeNote
import com.twobe.app.ui.screens.PASTEL_NOTE_COLORS
import com.twobe.app.ui.theme.DeepBerry
import com.twobe.app.ui.theme.SoftRose
import com.twobe.app.ui.theme.TwoBeTheme
import kotlin.math.sin
import kotlin.random.Random

data class VisualPaperNote(
    val xFraction: Float, // 0.15f to 0.85f
    val yFraction: Float, // depends on fill level
    val rotation: Float,
    val color: Color
)

@Composable
fun GratitudeJarVisual(
    notesCount: Int,
    isShaking: Boolean = false,
    isDroppingNote: Boolean = false,
    onManualShakeClick: () -> Unit = {}
) {
    val colors = TwoBeTheme.colors

    // Fill fraction: 0% to 100% (100+ notes is full)
    val fillFraction = (notesCount / 100f).coerceIn(0f, 1f)

    // Jar liquid / ambient color based on fullness:
    // empty = clear, 25% = light pink, 50% = pink, 75% = rose, 100% = deep rose with sparkles
    val jarTint = when {
        fillFraction <= 0.05f -> Color.Transparent
        fillFraction <= 0.25f -> Color(0xFFFFECEF).copy(alpha = 0.5f)
        fillFraction <= 0.50f -> Color(0xFFFFD1DC).copy(alpha = 0.65f)
        fillFraction <= 0.75f -> SoftRose.copy(alpha = 0.75f)
        else -> DeepBerry.copy(alpha = 0.8f)
    }

    // Shake animation
    val shakeOffset = remember { Animatable(0f) }
    LaunchedEffect(isShaking) {
        if (isShaking) {
            shakeOffset.animateTo(
                targetValue = 0f,
                animationSpec = keyframes {
                    durationMillis = 500
                    0f at 0
                    -16f at 50
                    16f at 120
                    -14f at 190
                    14f at 260
                    -8f at 340
                    8f at 420
                    0f at 500
                }
            )
        }
    }

    // Flying note animation entering into jar
    val dropProgress = remember { Animatable(0f) }
    LaunchedEffect(isDroppingNote) {
        if (isDroppingNote) {
            dropProgress.snapTo(0f)
            dropProgress.animateTo(
                targetValue = 1f,
                animationSpec = spring(
                    dampingRatio = Spring.DampingRatioMediumBouncy,
                    stiffness = Spring.StiffnessLow
                )
            )
        }
    }

    // Sparkles animation when jar reaches 100%
    val sparkleTransition = rememberInfiniteTransition(label = "sparkles")
    val sparklePulse by sparkleTransition.animateFloat(
        initialValue = 0.7f,
        targetValue = 1.3f,
        animationSpec = infiniteRepeatable(
            animation = tween(800, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "sparklePulse"
    )

    // Precomputed note positions inside jar so they look organic
    val visualNotes = remember(notesCount) {
        val countToDisplay = (notesCount.coerceIn(0, 30))
        val random = Random(42) // consistent seed
        List(countToDisplay) { index ->
            val yNorm = (index.toFloat() / 30f) * fillFraction
            VisualPaperNote(
                xFraction = 0.20f + random.nextFloat() * 0.60f,
                yFraction = (1f - yNorm).coerceIn(0.2f, 0.90f),
                rotation = -40f + random.nextFloat() * 80f,
                color = Color(PASTEL_NOTE_COLORS[random.nextInt(PASTEL_NOTE_COLORS.size)])
            )
        }
    }

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp)
    ) {
        // Above Jar: Note count
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(bottom = 12.dp)
        ) {
            Text(
                text = "$notesCount notes of gratitude",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = colors.accent
            )
            if (notesCount >= 100) {
                Text(
                    text = " ✨",
                    fontSize = 18.sp,
                    modifier = Modifier.scale(sparklePulse)
                )
            }
        }

        // Jar Illustration (200px tall)
        Box(
            modifier = Modifier
                .offset { IntOffset(x = shakeOffset.value.toInt(), y = 0) }
                .width(160.dp)
                .height(200.dp),
            contentAlignment = Alignment.Center
        ) {
            // Glass Shadow on surface
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .size(width = 130.dp, height = 16.dp)
                    .shadow(
                        elevation = 12.dp,
                        shape = CircleShape,
                        ambientColor = DeepBerry.copy(alpha = 0.25f),
                        spotColor = SoftRose.copy(alpha = 0.35f)
                    )
                    .background(Color.Transparent)
            )

            // Jar Body Canvas (Glass reflections, fill gradient, and outline)
            Canvas(modifier = Modifier.fillMaxSize()) {
                val w = size.width
                val h = size.height

                // Jar Neck Dimensions
                val neckWidth = w * 0.60f
                val neckHeight = h * 0.12f
                val neckLeft = (w - neckWidth) / 2f

                // Jar Body Dimensions
                val bodyWidth = w * 0.88f
                val bodyHeight = h * 0.80f
                val bodyLeft = (w - bodyWidth) / 2f
                val bodyTop = h * 0.15f

                // 1. Fill Level Background
                if (fillFraction > 0.02f) {
                    val fillHeight = bodyHeight * fillFraction
                    val fillTop = (bodyTop + bodyHeight) - fillHeight

                    val fillPath = Path().apply {
                        addRoundRect(
                            RoundRect(
                                rect = Rect(
                                    left = bodyLeft + 4.dp.toPx(),
                                    top = fillTop,
                                    right = bodyLeft + bodyWidth - 4.dp.toPx(),
                                    bottom = bodyTop + bodyHeight - 4.dp.toPx()
                                ),
                                cornerRadius = CornerRadius(22.dp.toPx())
                            )
                        )
                    }
                    drawPath(
                        path = fillPath,
                        brush = Brush.verticalGradient(
                            listOf(jarTint.copy(alpha = 0.45f), jarTint)
                        )
                    )
                }

                // 2. Glass Outline (Body)
                val jarBodyPath = Path().apply {
                    addRoundRect(
                        RoundRect(
                            rect = Rect(
                                left = bodyLeft,
                                top = bodyTop,
                                right = bodyLeft + bodyWidth,
                                bottom = bodyTop + bodyHeight
                            ),
                            cornerRadius = CornerRadius(24.dp.toPx())
                        )
                    )
                }
                drawPath(
                    path = jarBodyPath,
                    color = Color.White.copy(alpha = 0.85f),
                    style = Stroke(width = 3.dp.toPx(), cap = StrokeCap.Round)
                )

                // 3. Cork / Lid on Top
                val corkPath = Path().apply {
                    addRoundRect(
                        RoundRect(
                            rect = Rect(
                                left = neckLeft + 4.dp.toPx(),
                                top = 2.dp.toPx(),
                                right = neckLeft + neckWidth - 4.dp.toPx(),
                                bottom = neckHeight
                            ),
                            cornerRadius = CornerRadius(6.dp.toPx())
                        )
                    )
                }
                drawPath(
                    path = corkPath,
                    color = Color(0xFFD4A373), // Warm wood cork
                    style = androidx.compose.ui.graphics.drawscope.Fill
                )
                drawPath(
                    path = corkPath,
                    color = Color(0xFFA67C52),
                    style = Stroke(width = 1.5.dp.toPx())
                )

                // Neck Rim
                drawRoundRect(
                    color = Color.White.copy(alpha = 0.9f),
                    topLeft = Offset(neckLeft, neckHeight - 4.dp.toPx()),
                    size = Size(neckWidth, 8.dp.toPx()),
                    cornerRadius = CornerRadius(4.dp.toPx()),
                    style = Stroke(width = 2.dp.toPx())
                )

                // 4. Subtle Glass Reflection (Left Curved Glare)
                val glarePath = Path().apply {
                    moveTo(bodyLeft + 14.dp.toPx(), bodyTop + 16.dp.toPx())
                    cubicTo(
                        bodyLeft + 12.dp.toPx(), bodyTop + bodyHeight * 0.4f,
                        bodyLeft + 12.dp.toPx(), bodyTop + bodyHeight * 0.7f,
                        bodyLeft + 18.dp.toPx(), bodyTop + bodyHeight - 18.dp.toPx()
                    )
                }
                drawPath(
                    path = glarePath,
                    color = Color.White.copy(alpha = 0.55f),
                    style = Stroke(width = 4.dp.toPx(), cap = StrokeCap.Round)
                )
            }

            // Visible Folded Paper Notes inside Jar
            visualNotes.forEach { note ->
                Box(
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .offset {
                            IntOffset(
                                x = (note.xFraction * 160.dp.toPx()).toInt(),
                                y = (note.yFraction * 200.dp.toPx()).toInt()
                            )
                        }
                        .size(width = 22.dp, height = 14.dp)
                        .rotate(note.rotation)
                        .shadow(1.dp, RoundedCornerShape(2.dp))
                        .clip(RoundedCornerShape(2.dp))
                        .background(note.color)
                        .border(0.5.dp, Color.Black.copy(alpha = 0.1f), RoundedCornerShape(2.dp))
                )
            }

            // Dropping Note Animation (Arc flying into top of jar)
            if (isDroppingNote) {
                val p = dropProgress.value
                val dropY = (1f - p) * -80.dp.value + p * 80.dp.value
                val dropX = sin(p * 3.14f) * 25.dp.value
                val dropRot = p * 180f

                Box(
                    modifier = Modifier
                        .offset(x = dropX.dp, y = dropY.dp)
                        .size(width = 24.dp, height = 16.dp)
                        .rotate(dropRot)
                        .scale(1f - (p * 0.3f))
                        .shadow(4.dp, RoundedCornerShape(2.dp))
                        .clip(RoundedCornerShape(2.dp))
                        .background(Color(0xFFFFD1DC))
                )
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Below Jar: "Shake your phone to read a random note"
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .clip(RoundedCornerShape(999.dp))
                .background(colors.surfaceVariant)
                .clickable { onManualShakeClick() }
                .padding(horizontal = 14.dp, vertical = 6.dp)
        ) {
            Text(text = "📳", fontSize = 14.sp)
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = "Shake phone (or tap here) to draw a note",
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                color = colors.textSecondary
            )
        }
    }
}
