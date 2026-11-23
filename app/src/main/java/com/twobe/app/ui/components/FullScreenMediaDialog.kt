package com.twobe.app.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTransformGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.screens.MessageType
import com.twobe.app.ui.screens.TwoBeMessage
import com.twobe.app.ui.theme.TwoBeTheme
import kotlin.math.roundToInt

@Composable
fun FullScreenMediaDialog(
    message: TwoBeMessage?,
    onDismiss: () -> Unit
) {
    if (message == null) return
    val colors = TwoBeTheme.colors

    var scale by remember { mutableFloatStateOf(1f) }
    var offset by remember { mutableStateOf(Offset.Zero) }
    var dismissDragOffsetY by remember { mutableFloatStateOf(0f) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = ((1f - (dismissDragOffsetY / 600f)).coerceIn(0.4f, 0.95f))))
            .pointerInput(Unit) {
                detectDragGestures(
                    onDrag = { change, dragAmount ->
                        change.consume()
                        if (scale <= 1.05f && dragAmount.y > 0) {
                            dismissDragOffsetY += dragAmount.y
                        }
                    },
                    onDragEnd = {
                        if (dismissDragOffsetY > 160f) {
                            onDismiss()
                        } else {
                            dismissDragOffsetY = 0f
                        }
                    }
                )
            },
        contentAlignment = Alignment.Center
    ) {
        // Close button
        Box(
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(32.dp)
                .size(44.dp)
                .clip(CircleShape)
                .background(Color.White.copy(alpha = 0.2f))
                .clickable { onDismiss() },
            contentAlignment = Alignment.Center
        ) {
            Text(text = "✕", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
        }

        // Hint for gestures
        Box(
            modifier = Modifier
                .align(Alignment.TopCenter)
                .padding(top = 36.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(Color.Black.copy(alpha = 0.5f))
                .padding(horizontal = 12.dp, vertical = 6.dp)
        ) {
            Text(
                text = "Pinch to zoom • Swipe down to close",
                color = Color.White.copy(alpha = 0.8f),
                fontSize = 11.sp
            )
        }

        Box(
            modifier = Modifier
                .offset { IntOffset(0, dismissDragOffsetY.roundToInt()) }
                .graphicsLayer {
                    scaleX = scale
                    scaleY = scale
                    translationX = offset.x
                    translationY = offset.y
                }
                .pointerInput(Unit) {
                    detectTransformGestures { _, pan, zoom, _ ->
                        scale = (scale * zoom).coerceIn(1f, 4f)
                        if (scale > 1f) {
                            val maxOffset = (scale - 1f) * 350f
                            offset = Offset(
                                x = (offset.x + pan.x).coerceIn(-maxOffset, maxOffset),
                                y = (offset.y + pan.y).coerceIn(-maxOffset, maxOffset)
                            )
                        } else {
                            offset = Offset.Zero
                        }
                    }
                }
        ) {
            when (message.type) {
                MessageType.PHOTO, MessageType.SNAP -> {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(24.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth(0.9f)
                                .height(380.dp)
                                .clip(RoundedCornerShape(20.dp))
                                .background(colors.surfaceVariant),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = if (message.type == MessageType.SNAP) "📸" else "🖼️", fontSize = 72.sp)
                        }

                        if (message.text.isNotEmpty()) {
                            Text(
                                text = message.text,
                                color = Color.White,
                                fontSize = 15.sp,
                                modifier = Modifier.padding(top = 16.dp)
                            )
                        }
                    }
                }

                MessageType.VIDEO -> {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(24.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth(0.9f)
                                .height(340.dp)
                                .clip(RoundedCornerShape(20.dp))
                                .background(Color.DarkGray),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = "▶️", fontSize = 56.sp)
                        }
                        Text(
                            text = "Playing video (${message.durationText ?: "0:15"})",
                            color = Color.White,
                            fontSize = 14.sp,
                            modifier = Modifier.padding(top = 12.dp)
                        )
                    }
                }

                MessageType.LOCKED_LETTER -> {
                    TwoBeCard(
                        modifier = Modifier
                            .fillMaxWidth(0.85f)
                            .clickable(enabled = false) {},
                        elevation = 20.dp
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            modifier = Modifier.padding(8.dp)
                        ) {
                            Text(text = "💌", fontSize = 48.sp)
                            Text(
                                text = "Sealed Love Letter",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold,
                                color = colors.textPrimary,
                                modifier = Modifier.padding(top = 8.dp)
                            )
                            Text(
                                text = message.lockedCondition ?: "Opens on your anniversary",
                                fontSize = 13.sp,
                                color = colors.accent,
                                modifier = Modifier.padding(top = 4.dp)
                            )
                            Spacer(modifier = Modifier.height(16.dp))
                            TwoBeButton(
                                text = "Close",
                                onClick = onDismiss,
                                variant = ButtonVariant.PRIMARY,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                    }
                }

                else -> {}
            }
        }
    }
}
