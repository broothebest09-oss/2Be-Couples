package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.slideInHorizontally
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
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
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.screens.MessageDeliveryStatus
import com.twobe.app.ui.screens.MessageType
import com.twobe.app.ui.screens.TwoBeMessage
import com.twobe.app.ui.screens.UnlockConditionType
import com.twobe.app.ui.theme.TwoBeHaptics
import com.twobe.app.ui.theme.TwoBeTheme
import kotlin.math.roundToInt

@Composable
fun MessageBubbleItem(
    message: TwoBeMessage,
    onMediaClick: (TwoBeMessage) -> Unit,
    onRetrySend: (TwoBeMessage) -> Unit,
    onReaction: (TwoBeMessage, String) -> Unit = { _, _ -> },
    onReply: (TwoBeMessage) -> Unit = {},
    onLongPress: (TwoBeMessage) -> Unit = {}
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val view = LocalView.current
    var isExpanded by remember { mutableStateOf(false) }
    var swipeOffsetX by remember { mutableFloatStateOf(0f) }
    val animatedSwipeOffset by animateFloatAsState(
        targetValue = swipeOffsetX,
        animationSpec = spring(stiffness = Spring.StiffnessMediumLow)
    )

    val isMe = message.senderIsMe

    val bubbleShape = RoundedCornerShape(
        topStart = 16.dp,
        topEnd = 16.dp,
        bottomStart = if (isMe) 16.dp else 4.dp,
        bottomEnd = if (isMe) 4.dp else 16.dp
    )

    val bubbleBg = if (isMe) colors.primary else colors.surface
    val textColor = if (isMe) Color.White else colors.textPrimary

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalAlignment = if (isMe) Alignment.End else Alignment.Start
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = if (isMe) Arrangement.End else Arrangement.Start,
            modifier = Modifier.fillMaxWidth()
        ) {
            // Reply indicator when swiping right
            if (animatedSwipeOffset > 15f) {
                Box(
                    modifier = Modifier
                        .padding(horizontal = 8.dp)
                        .size(28.dp)
                        .clip(CircleShape)
                        .background(colors.primary.copy(alpha = (animatedSwipeOffset / 80f).coerceIn(0.2f, 1f))),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "↩️", fontSize = 13.sp)
                }
            }

            Row(
                verticalAlignment = Alignment.Bottom,
                horizontalArrangement = if (isMe) Arrangement.End else Arrangement.Start,
                modifier = Modifier
                    .offset { IntOffset(animatedSwipeOffset.roundToInt(), 0) }
                    .pointerInput(message.id) {
                        detectTapGestures(
                            onDoubleTap = {
                                TwoBeHaptics.lightTap(view)
                                onReaction(message, "❤️")
                            },
                            onLongPress = {
                                TwoBeHaptics.mediumTap(view)
                                onLongPress(message)
                            },
                            onTap = {
                                if (message.type == MessageType.PHOTO ||
                                    message.type == MessageType.VIDEO ||
                                    message.type == MessageType.FILE ||
                                    message.type == MessageType.SNAP ||
                                    message.type == MessageType.LOCKED_LETTER
                                ) {
                                    onMediaClick(message)
                                }
                            }
                        )
                    }
                    .pointerInput(message.id) {
                        detectHorizontalDragGestures(
                            onDragEnd = {
                                if (swipeOffsetX > 70f) {
                                    TwoBeHaptics.selectionChange(view)
                                    onReply(message)
                                }
                                swipeOffsetX = 0f
                            },
                            onDragCancel = {
                                swipeOffsetX = 0f
                            },
                            onHorizontalDrag = { change, dragAmount ->
                                change.consume()
                                if (dragAmount > 0 || swipeOffsetX > 0) {
                                    swipeOffsetX = (swipeOffsetX + dragAmount).coerceIn(0f, 100f)
                                }
                            }
                        )
                    }
            ) {
                // Failed retry button
                if (message.status == MessageDeliveryStatus.FAILED && isMe) {
                    Box(
                        modifier = Modifier
                            .padding(end = 6.dp)
                            .size(24.dp)
                            .clip(CircleShape)
                            .background(colors.error)
                            .clickable {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                onRetrySend(message)
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "!", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    }
                }

                when (message.type) {
                    // 1. Text Message
                    MessageType.TEXT -> {
                        val isLong = message.text.length > 280
                        Box(
                            modifier = Modifier
                                .widthIn(max = 280.dp)
                                .shadow(
                                    elevation = 2.dp,
                                    shape = bubbleShape,
                                    ambientColor = colors.accent.copy(alpha = 0.08f)
                                )
                                .clip(bubbleShape)
                                .background(bubbleBg)
                                .padding(horizontal = 14.dp, vertical = 10.dp)
                        ) {
                            Column {
                                if (!message.replyToMessageText.isNullOrEmpty()) {
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(bottom = 6.dp)
                                            .clip(RoundedCornerShape(6.dp))
                                            .background(if (isMe) Color.White.copy(alpha = 0.2f) else colors.surfaceVariant)
                                            .padding(horizontal = 8.dp, vertical = 4.dp)
                                    ) {
                                        Text(
                                            text = "↳ ${message.replyToMessageText}",
                                            fontSize = 11.sp,
                                            color = textColor.copy(alpha = 0.9f),
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis
                                        )
                                    }
                                }
                                Text(
                                    text = message.text,
                                    color = textColor,
                                    fontSize = 15.sp,
                                    lineHeight = 21.sp,
                                    maxLines = if (isLong && !isExpanded) 6 else Int.MAX_VALUE,
                                    overflow = TextOverflow.Ellipsis
                                )
                                if (isLong) {
                                    Text(
                                        text = if (isExpanded) "Read less" else "Read more...",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (isMe) Color.White.copy(alpha = 0.9f) else colors.accent,
                                        modifier = Modifier
                                            .clickable { isExpanded = !isExpanded }
                                            .padding(top = 4.dp)
                                    )
                                }
                            }
                        }
                    }
                                text = message.text,
                                color = textColor,
                                fontSize = 15.sp,
                                lineHeight = 21.sp,
                                maxLines = if (isLong && !isExpanded) 6 else Int.MAX_VALUE,
                                overflow = TextOverflow.Ellipsis
                            )
                            if (isLong) {
                                Text(
                                    text = if (isExpanded) "Read less" else "Read more...",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isMe) Color.White.copy(alpha = 0.9f) else colors.accent,
                                    modifier = Modifier
                                        .clickable { isExpanded = !isExpanded }
                                        .padding(top = 4.dp)
                                )
                            }
                        }
                    }
                }

                // 2. Photo Message (max width 280px, tap to view full screen)
                MessageType.PHOTO -> {
                    Box(
                        modifier = Modifier
                            .width(260.dp)
                            .clip(bubbleShape)
                            .background(bubbleBg)
                            .clickable {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                onMediaClick(message)
                            }
                            .padding(4.dp)
                    ) {
                        Column {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(180.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(colors.surfaceVariant),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = "🖼️", fontSize = 48.sp)
                            }
                            if (message.text.isNotEmpty()) {
                                Text(
                                    text = message.text,
                                    color = textColor,
                                    fontSize = 13.sp,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp)
                                )
                            }
                        }
                    }
                }

                // 3. Video Message (thumbnail with play icon overlay, duration shown, tap to play)
                MessageType.VIDEO -> {
                    Box(
                        modifier = Modifier
                            .width(260.dp)
                            .clip(bubbleShape)
                            .background(bubbleBg)
                            .clickable {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                onMediaClick(message)
                            }
                            .padding(4.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(160.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color(0xFF2D2528)),
                            contentAlignment = Alignment.Center
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(48.dp)
                                    .clip(CircleShape)
                                    .background(Color.White.copy(alpha = 0.85f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = "▶", fontSize = 20.sp, color = colors.accent)
                            }

                            // Duration badge
                            Box(
                                modifier = Modifier
                                    .align(Alignment.BottomEnd)
                                    .padding(8.dp)
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(Color.Black.copy(alpha = 0.6f))
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = message.durationText ?: "0:15",
                                    color = Color.White,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }
                    }
                }

                // 4. File Message (card with file icon, name, size)
                MessageType.FILE -> {
                    Box(
                        modifier = Modifier
                            .width(240.dp)
                            .clip(bubbleShape)
                            .background(bubbleBg)
                            .clickable {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                onMediaClick(message)
                            }
                            .padding(12.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (isMe) Color.White.copy(alpha = 0.2f) else colors.surfaceVariant),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = "📄", fontSize = 20.sp)
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = message.fileName ?: "document.pdf",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = textColor,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Text(
                                    text = message.fileSize ?: "1.4 MB",
                                    fontSize = 11.sp,
                                    color = if (isMe) Color.White.copy(alpha = 0.8f) else colors.textSecondary
                                )
                            }
                        }
                    }
                }

                // 5. Snap Message (photo/video taken in-app, camera icon, permanent)
                MessageType.SNAP -> {
                    Box(
                        modifier = Modifier
                            .width(220.dp)
                            .clip(bubbleShape)
                            .background(bubbleBg)
                            .clickable {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                onMediaClick(message)
                            }
                            .padding(8.dp)
                    ) {
                        Column {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(bottom = 6.dp)
                            ) {
                                Text(text = "📸", fontSize = 16.sp)
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "2Be Snap",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = textColor
                                )
                            }

                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(180.dp)
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(colors.surfaceVariant),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = "🌸", fontSize = 42.sp)
                            }
                        }
                    }
                }

                // 6. Kiss Message
                MessageType.KISS -> {
                    Box(
                        modifier = Modifier
                            .clip(bubbleShape)
                            .background(
                                Brush.linearGradient(
                                    listOf(Color(0xFFFF8DA1), Color(0xFFD6336C))
                                )
                            )
                            .padding(horizontal = 16.dp, vertical = 12.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(text = "💋", fontSize = 28.sp)
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(
                                    text = if (isMe) "Kiss sent" else "Kiss received!",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                                Text(
                                    text = "Warm lips sync",
                                    fontSize = 11.sp,
                                    color = Color.White.copy(alpha = 0.85f)
                                )
                            }
                        }
                    }
                }

                // 7. Hug Message
                MessageType.HUG -> {
                    Box(
                        modifier = Modifier
                            .clip(bubbleShape)
                            .background(
                                Brush.linearGradient(
                                    listOf(Color(0xFFC084FC), Color(0xFF7E22CE))
                                )
                            )
                            .padding(horizontal = 16.dp, vertical = 12.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(text = "🤗", fontSize = 28.sp)
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(
                                    text = if (isMe) "Hug sent" else "Hug received!",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                                Text(
                                    text = "Warm comfort embrace",
                                    fontSize = 11.sp,
                                    color = Color.White.copy(alpha = 0.85f)
                                )
                            }
                        }
                    }
                }

                // 8. Locked Letter Message (envelope with lock, countdown, tap to open)
                MessageType.LOCKED_LETTER -> {
                    val payload = message.lockedLetterPayload
                    val isOpened = message.isUnlocked || (payload?.isUnlocked == true)

                    Box(
                        modifier = Modifier
                            .width(270.dp)
                            .clip(bubbleShape)
                            .background(
                                if (isOpened) colors.primary.copy(alpha = 0.12f)
                                else colors.surface
                            )
                            .border(
                                width = 1.dp,
                                color = if (isOpened) colors.primary.copy(alpha = 0.5f) else colors.accent.copy(alpha = 0.4f),
                                shape = bubbleShape
                            )
                            .clickable {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                onMediaClick(message)
                            }
                            .padding(14.dp)
                    ) {
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(46.dp)
                                        .clip(CircleShape)
                                        .background(
                                            if (isOpened) colors.primary.copy(alpha = 0.2f)
                                            else colors.accent.copy(alpha = 0.15f)
                                        ),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = if (isOpened) "💌" else "🔒",
                                        fontSize = 24.sp
                                    )
                                }
                                Spacer(modifier = Modifier.width(12.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = if (isOpened) "Unsealed Love Letter" else "Sealed Love Letter",
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = colors.textPrimary
                                    )
                                    val statusText = if (isOpened) {
                                        payload?.openedAtDateText ?: "Tap to read anytime ✨"
                                    } else {
                                        payload?.getRemainingStatusText() ?: message.lockedCondition ?: "Opens in 2 days"
                                    }
                                    Text(
                                        text = statusText,
                                        fontSize = 11.sp,
                                        color = if (isOpened) colors.primary else colors.accent,
                                        fontWeight = FontWeight.Medium,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis,
                                        modifier = Modifier.padding(top = 2.dp)
                                    )
                                }
                            }

                            // If action-based condition and locked, show progress bar
                            if (!isOpened && payload != null && payload.conditionType == UnlockConditionType.AFTER_ACTION) {
                                Spacer(modifier = Modifier.height(10.dp))
                                Column {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(
                                            text = "Progress: ${payload.currentActionCount}/${payload.targetActionCount} ${payload.targetActionType.emoji}",
                                            fontSize = 11.sp,
                                            color = colors.textSecondary
                                        )
                                        Text(
                                            text = "${((payload.currentActionCount.toFloat() / payload.targetActionCount) * 100).toInt()}%",
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = colors.primary
                                        )
                                    }
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .height(5.dp)
                                            .clip(RoundedCornerShape(3.dp))
                                            .background(colors.surfaceVariant)
                                    ) {
                                        val progressFrac = (payload.currentActionCount.toFloat() / payload.targetActionCount).coerceIn(0f, 1f)
                                        Box(
                                            modifier = Modifier
                                                .fillMaxWidth(fraction = progressFrac)
                                                .height(5.dp)
                                                .clip(RoundedCornerShape(3.dp))
                                                .background(
                                                    Brush.horizontalGradient(
                                                        listOf(colors.primary, colors.secondary)
                                                    )
                                                )
                                        )
                                    }
                                }
                            }

                            // Tap hint
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = if (isOpened) "Read letter →" else "Check unlock status →",
                                fontSize = 10.sp,
                                color = colors.textSecondary,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }

                // 9. Scratch-off Message (metallic foil shimmer)
                MessageType.SCRATCH_OFF -> {
                    ScratchOffMessageBubble(
                        secretText = message.scratchSecretText ?: "I love you to the moon and back ❤️",
                        senderIsMe = isMe
                    )
                }
            }
        }

        // Reaction Badge overlay (Instagram/iMessage style)
        if (!message.reactionEmoji.isNullOrEmpty()) {
            Box(
                modifier = Modifier
                    .offset(y = (-6).dp)
                    .padding(start = if (isMe) 0.dp else 12.dp, end = if (isMe) 12.dp else 0.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(colors.surface)
                    .border(1.dp, colors.surfaceVariant, RoundedCornerShape(12.dp))
                    .clickable {
                        TwoBeHaptics.lightTap(view)
                        onReaction(message, "")
                    }
                    .padding(horizontal = 6.dp, vertical = 2.dp)
            ) {
                Text(text = message.reactionEmoji ?: "", fontSize = 12.sp)
            }
        }

        // Timestamp below message (small, e.g. "2:34 PM")
        Text(
            text = message.timestamp,
            fontSize = 10.sp,
            color = colors.textSecondary,
            modifier = Modifier.padding(
                top = 3.dp,
                start = if (isMe) 0.dp else 4.dp,
                end = if (isMe) 4.dp else 0.dp
            )
        )
    }
}
