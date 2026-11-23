package com.twobe.app.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.screens.*
import com.twobe.app.ui.theme.LocalTwoBeColors
import kotlin.math.sin

@Composable
fun LivingAvatar3DView(
    config: AvatarConfig,
    state: AvatarState = AvatarState.ONLINE,
    size: Dp = 200.dp,
    showStateBadge: Boolean = true,
    modifier: Modifier = Modifier
) {
    val colors = LocalTwoBeColors.current

    // Infinite animation drivers
    val infiniteTransition = rememberInfiniteTransition(label = "AvatarLivingAnimation")

    // Idle breathing float
    val floatY by infiniteTransition.animateFloat(
        initialValue = if (state == AvatarState.OFFLINE) 0f else -3f,
        targetValue = if (state == AvatarState.OFFLINE) 0f else 3f,
        animationSpec = infiniteRepeatable(
            animation = tween(1600, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "FloatY"
    )

    // Happy bounce
    val happyBounce by infiniteTransition.animateFloat(
        initialValue = if (state == AvatarState.HAPPY) -6f else 0f,
        targetValue = if (state == AvatarState.HAPPY) 4f else 0f,
        animationSpec = infiniteRepeatable(
            animation = tween(600, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "HappyBounce"
    )

    // Sparkle scale
    val sparkleScale by infiniteTransition.animateFloat(
        initialValue = 0.7f,
        targetValue = 1.3f,
        animationSpec = infiniteRepeatable(
            animation = tween(800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "SparkleScale"
    )

    // Zzz float up
    val zzzOffset by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = -24f,
        animationSpec = infiniteRepeatable(
            animation = tween(2200, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "ZzzOffset"
    )

    // Rain drop offset
    val rainDropY by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 30f,
        animationSpec = infiniteRepeatable(
            animation = tween(900, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "RainDropY"
    )

    // Typing phone shake
    val phoneTypingRotate by infiniteTransition.animateFloat(
        initialValue = if (state == AvatarState.TYPING) -2f else 0f,
        targetValue = if (state == AvatarState.TYPING) 2f else 0f,
        animationSpec = infiniteRepeatable(
            animation = tween(200, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "PhoneTyping"
    )

    // Lookups from Catalog
    val skinTone = AvatarDesignCatalog.skinTones.find { it.id == config.skinToneId }?.color ?: Color(0xFFFFDFC4)
    val hairColor = AvatarDesignCatalog.hairColors.find { it.id == config.hairColorId }?.color ?: Color(0xFF2C1D11)
    val eyeColor = AvatarDesignCatalog.eyeColors.find { it.id == config.eyeColorId }?.color ?: Color(0xFF5A3825)
    val shirtItem = AvatarDesignCatalog.shirts.find { it.id == config.shirtId } ?: AvatarDesignCatalog.shirts[0]
    val pantsItem = AvatarDesignCatalog.pants.find { it.id == config.pantsId } ?: AvatarDesignCatalog.pants[0]
    val shoesItem = AvatarDesignCatalog.shoes.find { it.id == config.shoesId } ?: AvatarDesignCatalog.shoes[0]
    val hatItem = AvatarDesignCatalog.hats.find { it.id == config.hatId }
    val glassesItem = AvatarDesignCatalog.glasses.find { it.id == config.glassesId }
    val jewelryItem = AvatarDesignCatalog.jewelry.find { it.id == config.jewelryId }

    val baseAlpha = if (state == AvatarState.OFFLINE) 0.5f else 1f
    val tiltAngle = if (state == AvatarState.SLEEPING) 12f else 0f

    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(size)
                .alpha(baseAlpha),
            contentAlignment = Alignment.Center
        ) {
            // Ambient Backdrop 3D Glow
            Box(
                modifier = Modifier
                    .size(size * 0.88f)
                    .clip(CircleShape)
                    .background(
                        Brush.radialGradient(
                            colors = listOf(
                                when (state) {
                                    AvatarState.HAPPY -> colors.primary.copy(alpha = 0.35f)
                                    AvatarState.SLEEPING -> Color(0xFF8B5CF6).copy(alpha = 0.25f)
                                    AvatarState.SAD -> Color(0xFF64748B).copy(alpha = 0.2f)
                                    AvatarState.TYPING -> colors.accent.copy(alpha = 0.25f)
                                    AvatarState.OFFLINE -> Color.Transparent
                                    else -> colors.surfaceVariant.copy(alpha = 0.7f)
                                },
                                Color.Transparent
                            )
                        )
                    )
            )

            // Dynamic 3D Platform Pedestal Shadow
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 8.dp)
                    .width(size * 0.65f)
                    .height(14.dp)
                    .scale(if (state == AvatarState.HAPPY) 0.9f else 1f)
                    .background(
                        Brush.radialGradient(
                            colors = listOf(
                                Color(0xFF2D1F24).copy(alpha = if (state == AvatarState.OFFLINE) 0.1f else 0.25f),
                                Color.Transparent
                            )
                        ),
                        shape = CircleShape
                    )
            )

            // Character Body with State Animations
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .offset(y = (floatY + happyBounce).dp)
                    .rotate(tiltAngle)
                    .rotate(phoneTypingRotate),
                contentAlignment = Alignment.Center
            ) {
                // Layered Canvas 3D Avatar Rendering
                Canvas(modifier = Modifier.fillMaxSize()) {
                    val w = this.size.width
                    val h = this.size.height

                    // Center reference points
                    val centerX = w / 2f
                    val headCenterY = h * 0.35f
                    val headRadius = w * 0.24f

                    // 1. Draw Body Type variations
                    val bodyWidth = when (config.bodyType) {
                        BodyType.SLIM -> w * 0.30f
                        BodyType.AVERAGE -> w * 0.36f
                        BodyType.ATHLETIC -> w * 0.42f
                    }
                    val bodyTop = headCenterY + headRadius * 0.65f
                    val bodyHeight = h * 0.32f

                    // 2. Draw Pants & Legs
                    val pantsTop = bodyTop + bodyHeight * 0.55f
                    val legWidth = bodyWidth * 0.42f
                    val legHeight = h * 0.22f

                    // Left leg
                    drawRoundRect(
                        color = pantsItem.primaryColor,
                        topLeft = Offset(centerX - bodyWidth * 0.48f, pantsTop),
                        size = Size(legWidth, legHeight),
                        cornerRadius = CornerRadius(12f, 12f)
                    )
                    // Right leg
                    drawRoundRect(
                        color = pantsItem.primaryColor,
                        topLeft = Offset(centerX + bodyWidth * 0.06f, pantsTop),
                        size = Size(legWidth, legHeight),
                        cornerRadius = CornerRadius(12f, 12f)
                    )

                    // 3. Draw Shoes
                    val shoeY = pantsTop + legHeight - 4f
                    val shoeWidth = legWidth * 1.15f
                    val shoeHeight = 16f
                    // Left shoe
                    drawRoundRect(
                        color = shoesItem.primaryColor,
                        topLeft = Offset(centerX - bodyWidth * 0.52f, shoeY),
                        size = Size(shoeWidth, shoeHeight),
                        cornerRadius = CornerRadius(8f, 8f)
                    )
                    // Right shoe
                    drawRoundRect(
                        color = shoesItem.primaryColor,
                        topLeft = Offset(centerX + bodyWidth * 0.04f, shoeY),
                        size = Size(shoeWidth, shoeHeight),
                        cornerRadius = CornerRadius(8f, 8f)
                    )

                    // 4. Draw Torso / Shirt with 3D gradient shading
                    drawRoundRect(
                        brush = Brush.linearGradient(
                            colors = listOf(shirtItem.primaryColor, shirtItem.primaryColor.copy(alpha = 0.85f)),
                            start = Offset(centerX - bodyWidth / 2f, bodyTop),
                            end = Offset(centerX + bodyWidth / 2f, bodyTop + bodyHeight)
                        ),
                        topLeft = Offset(centerX - bodyWidth / 2f, bodyTop),
                        size = Size(bodyWidth, bodyHeight),
                        cornerRadius = CornerRadius(22f, 22f)
                    )

                    // 5. Arms & Hands
                    val armWidth = bodyWidth * 0.22f
                    val armHeight = bodyHeight * 0.8f
                    // Left arm
                    drawRoundRect(
                        color = shirtItem.primaryColor.copy(alpha = 0.95f),
                        topLeft = Offset(centerX - bodyWidth / 2f - armWidth * 0.85f, bodyTop + 4f),
                        size = Size(armWidth, armHeight),
                        cornerRadius = CornerRadius(10f, 10f)
                    )
                    // Left hand (skin)
                    drawCircle(
                        color = skinTone,
                        radius = armWidth * 0.55f,
                        center = Offset(centerX - bodyWidth / 2f - armWidth * 0.35f, bodyTop + armHeight + 4f)
                    )

                    // Right arm & hand
                    if (state == AvatarState.TYPING) {
                        // Lifted typing arm holding phone
                        drawRoundRect(
                            color = shirtItem.primaryColor.copy(alpha = 0.95f),
                            topLeft = Offset(centerX + 6f, bodyTop + 14f),
                            size = Size(bodyWidth * 0.36f, armWidth),
                            cornerRadius = CornerRadius(10f, 10f)
                        )
                        // Phone rectangle
                        drawRoundRect(
                            color = Color(0xFF1E293B),
                            topLeft = Offset(centerX + bodyWidth * 0.28f, bodyTop + 6f),
                            size = Size(18f, 28f),
                            cornerRadius = CornerRadius(4f, 4f)
                        )
                        // Phone screen glowing
                        drawRoundRect(
                            color = Color(0xFF67E8F9),
                            topLeft = Offset(centerX + bodyWidth * 0.28f + 2f, bodyTop + 8f),
                            size = Size(14f, 24f),
                            cornerRadius = CornerRadius(2f, 2f)
                        )
                    } else {
                        // Normal right arm
                        drawRoundRect(
                            color = shirtItem.primaryColor.copy(alpha = 0.95f),
                            topLeft = Offset(centerX + bodyWidth / 2f - armWidth * 0.15f, bodyTop + 4f),
                            size = Size(armWidth, armHeight),
                            cornerRadius = CornerRadius(10f, 10f)
                        )
                        drawCircle(
                            color = skinTone,
                            radius = armWidth * 0.55f,
                            center = Offset(centerX + bodyWidth / 2f + armWidth * 0.35f, bodyTop + armHeight + 4f)
                        )
                    }

                    // 6. Neck
                    drawRoundRect(
                        color = skinTone,
                        topLeft = Offset(centerX - 10f, headCenterY + headRadius * 0.6f),
                        size = Size(20f, 16f),
                        cornerRadius = CornerRadius(6f, 6f)
                    )

                    // 7. Head (Skin Tone with 3D Radial Highlight)
                    drawCircle(
                        brush = Brush.radialGradient(
                            colors = listOf(
                                skinTone,
                                skinTone.copy(red = (skinTone.red * 0.9f).coerceIn(0f, 1f))
                            ),
                            center = Offset(centerX - 6f, headCenterY - 8f),
                            radius = headRadius
                        ),
                        radius = headRadius,
                        center = Offset(centerX, headCenterY)
                    )

                    // 8. Hair Back / Top based on Style
                    drawHair(
                        styleId = config.hairStyleId,
                        color = hairColor,
                        centerX = centerX,
                        headCenterY = headCenterY,
                        headRadius = headRadius
                    )

                    // 9. Rosy Cheeks
                    val cheekRadius = headRadius * 0.16f
                    val cheekY = headCenterY + headRadius * 0.22f
                    drawCircle(
                        color = Color(0xFFFF8DA1).copy(alpha = if (state == AvatarState.HAPPY) 0.55f else 0.35f),
                        radius = cheekRadius,
                        center = Offset(centerX - headRadius * 0.52f, cheekY)
                    )
                    drawCircle(
                        color = Color(0xFFFF8DA1).copy(alpha = if (state == AvatarState.HAPPY) 0.55f else 0.35f),
                        radius = cheekRadius,
                        center = Offset(centerX + headRadius * 0.52f, cheekY)
                    )

                    // 10. Eyes & Expression
                    val eyeRadius = headRadius * 0.12f
                    val eyeY = headCenterY + headRadius * 0.05f
                    val eyeSpacing = headRadius * 0.38f

                    if (state == AvatarState.SLEEPING) {
                        // Closed sleeping eyes (- - arc)
                        drawArc(
                            color = Color(0xFF2C1D11),
                            startAngle = 0f,
                            sweepAngle = 180f,
                            useCenter = false,
                            topLeft = Offset(centerX - eyeSpacing - 6f, eyeY - 2f),
                            size = Size(14f, 8f),
                            style = Stroke(width = 2.5f)
                        )
                        drawArc(
                            color = Color(0xFF2C1D11),
                            startAngle = 0f,
                            sweepAngle = 180f,
                            useCenter = false,
                            topLeft = Offset(centerX + eyeSpacing - 8f, eyeY - 2f),
                            size = Size(14f, 8f),
                            style = Stroke(width = 2.5f)
                        )
                    } else if (state == AvatarState.HAPPY || config.expression == FacialExpression.HAPPY) {
                        // Happy curved eyes (^ ^)
                        drawArc(
                            color = Color(0xFF2C1D11),
                            startAngle = 180f,
                            sweepAngle = 180f,
                            useCenter = false,
                            topLeft = Offset(centerX - eyeSpacing - 6f, eyeY - 6f),
                            size = Size(14f, 9f),
                            style = Stroke(width = 3f)
                        )
                        drawArc(
                            color = Color(0xFF2C1D11),
                            startAngle = 180f,
                            sweepAngle = 180f,
                            useCenter = false,
                            topLeft = Offset(centerX + eyeSpacing - 8f, eyeY - 6f),
                            size = Size(14f, 9f),
                            style = Stroke(width = 3f)
                        )
                    } else {
                        // Open Eyes with pupil & eye color
                        // Left eye white
                        drawCircle(
                            color = Color.White,
                            radius = eyeRadius,
                            center = Offset(centerX - eyeSpacing, eyeY)
                        )
                        // Left eye color
                        drawCircle(
                            color = eyeColor,
                            radius = eyeRadius * 0.7f,
                            center = Offset(centerX - eyeSpacing, eyeY)
                        )
                        // Left eye pupil & light catch
                        drawCircle(
                            color = Color.Black,
                            radius = eyeRadius * 0.4f,
                            center = Offset(centerX - eyeSpacing, eyeY)
                        )
                        drawCircle(
                            color = Color.White,
                            radius = eyeRadius * 0.2f,
                            center = Offset(centerX - eyeSpacing - 2f, eyeY - 2f)
                        )

                        // Right eye white
                        drawCircle(
                            color = Color.White,
                            radius = eyeRadius,
                            center = Offset(centerX + eyeSpacing, eyeY)
                        )
                        // Right eye color
                        drawCircle(
                            color = eyeColor,
                            radius = eyeRadius * 0.7f,
                            center = Offset(centerX + eyeSpacing, eyeY)
                        )
                        // Right eye pupil & light catch
                        drawCircle(
                            color = Color.Black,
                            radius = eyeRadius * 0.4f,
                            center = Offset(centerX + eyeSpacing, eyeY)
                        )
                        drawCircle(
                            color = Color.White,
                            radius = eyeRadius * 0.2f,
                            center = Offset(centerX + eyeSpacing - 2f, eyeY - 2f)
                        )
                    }

                    // 11. Mouth
                    val mouthY = headCenterY + headRadius * 0.38f
                    when {
                        state == AvatarState.SAD || config.expression == FacialExpression.SAD -> {
                            // Downward sad curve
                            drawArc(
                                color = Color(0xFF6B4336),
                                startAngle = 180f,
                                sweepAngle = 180f,
                                useCenter = false,
                                topLeft = Offset(centerX - 9f, mouthY),
                                size = Size(18f, 10f),
                                style = Stroke(width = 2.5f)
                            )
                        }
                        state == AvatarState.HAPPY || config.expression == FacialExpression.HAPPY -> {
                            // Open cheerful smile
                            drawArc(
                                color = Color(0xFFE11D48),
                                startAngle = 0f,
                                sweepAngle = 180f,
                                useCenter = true,
                                topLeft = Offset(centerX - 10f, mouthY - 3f),
                                size = Size(20f, 14f)
                            )
                        }
                        config.expression == FacialExpression.SURPRISED -> {
                            // Small 'o' mouth
                            drawCircle(
                                color = Color(0xFF6B4336),
                                radius = 5f,
                                center = Offset(centerX, mouthY + 2f)
                            )
                        }
                        else -> {
                            // Gentle neutral smile
                            drawArc(
                                color = Color(0xFF6B4336),
                                startAngle = 0f,
                                sweepAngle = 180f,
                                useCenter = false,
                                topLeft = Offset(centerX - 7f, mouthY - 2f),
                                size = Size(14f, 8f),
                                style = Stroke(width = 2.5f)
                            )
                        }
                    }

                    // 12. Glasses Accessory
                    if (glassesItem != null && glassesItem.id != "glasses_none") {
                        val glassRadius = eyeRadius * 1.5f
                        val glassY = eyeY - 1f
                        when (glassesItem.id) {
                            "glasses_sunglasses" -> {
                                drawCircle(Color(0xFF1E293B), radius = glassRadius, center = Offset(centerX - eyeSpacing, glassY))
                                drawCircle(Color(0xFF1E293B), radius = glassRadius, center = Offset(centerX + eyeSpacing, glassY))
                            }
                            else -> {
                                drawCircle(
                                    color = Color(0xFF334155),
                                    radius = glassRadius,
                                    center = Offset(centerX - eyeSpacing, glassY),
                                    style = Stroke(width = 2.5f)
                                )
                                drawCircle(
                                    color = Color(0xFF334155),
                                    radius = glassRadius,
                                    center = Offset(centerX + eyeSpacing, glassY),
                                    style = Stroke(width = 2.5f)
                                )
                            }
                        }
                        // Bridge
                        drawLine(
                            color = Color(0xFF334155),
                            start = Offset(centerX - eyeSpacing + glassRadius, glassY),
                            end = Offset(centerX + eyeSpacing - glassRadius, glassY),
                            strokeWidth = 2.5f
                        )
                    }

                    // 13. Jewelry / Heart Necklace
                    if (jewelryItem != null && jewelryItem.id != "jewelry_none") {
                        drawCircle(
                            color = Color(0xFFF59E0B),
                            radius = 4f,
                            center = Offset(centerX, bodyTop + 10f)
                        )
                    }

                    // 14. Hat Accessory
                    if (hatItem != null && hatItem.id != "hat_none") {
                        val hatTop = headCenterY - headRadius * 1.05f
                        when (hatItem.id) {
                            "hat_beanie" -> {
                                drawArc(
                                    color = Color(0xFF9B4D6F),
                                    startAngle = 180f,
                                    sweepAngle = 180f,
                                    useCenter = true,
                                    topLeft = Offset(centerX - headRadius * 0.95f, hatTop),
                                    size = Size(headRadius * 1.9f, headRadius * 1.1f)
                                )
                            }
                            "hat_catears" -> {
                                // Left ear
                                drawPath(
                                    path = Path().apply {
                                        moveTo(centerX - headRadius * 0.8f, headCenterY - headRadius * 0.5f)
                                        lineTo(centerX - headRadius * 0.5f, headCenterY - headRadius * 1.25f)
                                        lineTo(centerX - headRadius * 0.2f, headCenterY - headRadius * 0.7f)
                                        close()
                                    },
                                    color = Color(0xFFE8A5B9)
                                )
                                // Right ear
                                drawPath(
                                    path = Path().apply {
                                        moveTo(centerX + headRadius * 0.2f, headCenterY - headRadius * 0.7f)
                                        lineTo(centerX + headRadius * 0.5f, headCenterY - headRadius * 1.25f)
                                        lineTo(centerX + headRadius * 0.8f, headCenterY - headRadius * 0.5f)
                                        close()
                                    },
                                    color = Color(0xFFE8A5B9)
                                )
                            }
                            else -> {
                                // Cap / Beret dome
                                drawRoundRect(
                                    color = Color(0xFF64748B),
                                    topLeft = Offset(centerX - headRadius * 0.95f, hatTop + 10f),
                                    size = Size(headRadius * 1.9f, 24f),
                                    cornerRadius = CornerRadius(12f, 12f)
                                )
                            }
                        }
                    }
                }
            }

            // ==========================================
            // PARTICLES & STATE EFFECTS OVERLAY
            // ==========================================

            // 1. HAPPY SPARKLING PARTICLES ✨
            if (state == AvatarState.HAPPY) {
                Box(
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .padding(top = 16.dp, start = 16.dp)
                        .scale(sparkleScale)
                ) {
                    Text(text = "✨", fontSize = 22.sp)
                }
                Box(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(top = 10.dp, end = 20.dp)
                        .scale(1.4f - sparkleScale * 0.3f)
                ) {
                    Text(text = "💖", fontSize = 18.sp)
                }
                Box(
                    modifier = Modifier
                        .align(Alignment.CenterEnd)
                        .padding(end = 12.dp)
                        .scale(sparkleScale * 0.9f)
                ) {
                    Text(text = "✨", fontSize = 20.sp)
                }
            }

            // 2. SLEEPING FLOATING "Zzz" 💤
            if (state == AvatarState.SLEEPING) {
                Column(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(end = 24.dp, top = 8.dp)
                        .offset(y = zzzOffset.dp),
                    horizontalAlignment = Alignment.End
                ) {
                    Text(
                        text = "Z",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF8B5CF6)
                    )
                    Text(
                        text = "z",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFA78BFA)
                    )
                    Text(
                        text = "z",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFC4B5FD)
                    )
                }
            }

            // 3. SAD RAIN CLOUD 🌧️
            if (state == AvatarState.SAD) {
                Column(
                    modifier = Modifier
                        .align(Alignment.TopCenter)
                        .padding(top = 2.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(text = "🌧️", fontSize = 34.sp)
                    // Falling droplets
                    Row(
                        modifier = Modifier.offset(y = rainDropY.dp),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Text(text = "💧", fontSize = 10.sp)
                        Text(text = "💧", fontSize = 10.sp)
                    }
                }
            }

            // 4. TYPING BUBBLE 💬
            if (state == AvatarState.TYPING) {
                Box(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(end = 16.dp, top = 20.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(colors.surface)
                        .border(1.dp, colors.accent.copy(alpha = 0.3f), RoundedCornerShape(12.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "typing • • •",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = colors.accent
                    )
                }
            }
        }

        // Optional State Badge Below 3D View
        if (showStateBadge) {
            Spacer(modifier = Modifier.height(6.dp))
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(5.dp),
                modifier = Modifier
                    .clip(RoundedCornerShape(999.dp))
                    .background(colors.surfaceVariant)
                    .padding(horizontal = 10.dp, vertical = 4.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(CircleShape)
                        .background(
                            when (state) {
                                AvatarState.ONLINE -> Color(0xFF22C55E)
                                AvatarState.TYPING -> colors.accent
                                AvatarState.HAPPY -> Color(0xFFF59E0B)
                                AvatarState.SLEEPING -> Color(0xFF8B5CF6)
                                AvatarState.SAD -> Color(0xFF64748B)
                                AvatarState.OFFLINE -> Color(0xFF94A3B8)
                            }
                        )
                )
                Text(
                    text = state.badgeText,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.textPrimary
                )
            }
        }
    }
}

private fun DrawScope.drawHair(
    styleId: String,
    color: Color,
    centerX: Float,
    headCenterY: Float,
    headRadius: Float
) {
    when (styleId) {
        "hair_buzz" -> {
            drawArc(
                color = color,
                startAngle = 180f,
                sweepAngle = 180f,
                useCenter = true,
                topLeft = Offset(centerX - headRadius, headCenterY - headRadius),
                size = Size(headRadius * 2f, headRadius * 1.1f)
            )
        }
        "hair_bob" -> {
            // Top and sides frame
            drawArc(
                color = color,
                startAngle = 180f,
                sweepAngle = 180f,
                useCenter = true,
                topLeft = Offset(centerX - headRadius * 1.05f, headCenterY - headRadius * 1.05f),
                size = Size(headRadius * 2.1f, headRadius * 1.5f)
            )
            // Left bob drop
            drawRoundRect(
                color = color,
                topLeft = Offset(centerX - headRadius * 1.05f, headCenterY - headRadius * 0.2f),
                size = Size(headRadius * 0.45f, headRadius * 0.9f),
                cornerRadius = CornerRadius(12f, 12f)
            )
            // Right bob drop
            drawRoundRect(
                color = color,
                topLeft = Offset(centerX + headRadius * 0.6f, headCenterY - headRadius * 0.2f),
                size = Size(headRadius * 0.45f, headRadius * 0.9f),
                cornerRadius = CornerRadius(12f, 12f)
            )
        }
        "hair_space_buns" -> {
            // Base hair
            drawArc(
                color = color,
                startAngle = 180f,
                sweepAngle = 180f,
                useCenter = true,
                topLeft = Offset(centerX - headRadius, headCenterY - headRadius),
                size = Size(headRadius * 2f, headRadius * 1.2f)
            )
            // Left space bun
            drawCircle(
                color = color,
                radius = headRadius * 0.38f,
                center = Offset(centerX - headRadius * 0.85f, headCenterY - headRadius * 0.85f)
            )
            // Right space bun
            drawCircle(
                color = color,
                radius = headRadius * 0.38f,
                center = Offset(centerX + headRadius * 0.85f, headCenterY - headRadius * 0.85f)
            )
        }
        "hair_ponytail" -> {
            drawArc(
                color = color,
                startAngle = 180f,
                sweepAngle = 180f,
                useCenter = true,
                topLeft = Offset(centerX - headRadius, headCenterY - headRadius),
                size = Size(headRadius * 2f, headRadius * 1.2f)
            )
            // Ponytail top puff
            drawCircle(
                color = color,
                radius = headRadius * 0.42f,
                center = Offset(centerX + headRadius * 0.7f, headCenterY - headRadius * 0.8f)
            )
        }
        else -> {
            // Default wavy / curls top
            drawArc(
                color = color,
                startAngle = 175f,
                sweepAngle = 190f,
                useCenter = true,
                topLeft = Offset(centerX - headRadius * 1.08f, headCenterY - headRadius * 1.08f),
                size = Size(headRadius * 2.16f, headRadius * 1.6f)
            )
        }
    }
}
