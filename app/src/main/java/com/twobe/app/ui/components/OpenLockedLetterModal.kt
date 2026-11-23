package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.twobe.app.ui.screens.LockedLetterPayload
import com.twobe.app.ui.theme.LocalTwoBeColors
import com.twobe.app.ui.theme.LocalTwoBeSpacing
import java.time.format.DateTimeFormatter

@Composable
fun OpenLockedLetterModal(
    letter: LockedLetterPayload,
    partnerName: String = letter.senderName,
    onDismiss: () -> Unit,
    onReply: (String) -> Unit = {},
    onReplyToLetter: (String) -> Unit = onReply
) {
    val colors = LocalTwoBeColors.current
    val spacing = LocalTwoBeSpacing.current
    val view = LocalView.current

    // Trigger celebration effects on initial unseal
    var showCelebration by remember { mutableStateOf(!letter.isUnlocked) }

    LaunchedEffect(Unit) {
        if (!letter.isUnlocked) {
            letter.isUnlocked = true
            letter.openedAtDateText = "Opened on ${java.time.LocalDate.now().format(DateTimeFormatter.ofPattern("MMM d, yyyy"))}"
            view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
        }
    }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = colors.background
        ) {
            Box(modifier = Modifier.fillMaxSize()) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .statusBarsPadding()
                        .navigationBarsPadding()
                ) {
                    // Header Bar
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = spacing.medium, vertical = spacing.small),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        IconButton(onClick = onDismiss, modifier = Modifier.size(40.dp)) {
                            Text(text = "←", fontSize = 22.sp, color = colors.textPrimary)
                        }

                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "💌 Love Letter Unlocked",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = colors.textPrimary
                            )
                            Text(
                                text = letter.openedAtDateText ?: "Opened Just Now",
                                fontSize = 11.sp,
                                color = colors.accent
                            )
                        }

                        IconButton(onClick = onDismiss, modifier = Modifier.size(40.dp)) {
                            Text(text = "✕", fontSize = 16.sp, color = colors.textSecondary)
                        }
                    }

                    Divider(color = colors.surfaceVariant, thickness = 1.dp)

                    // Scrollable Letter Body
                    Column(
                        modifier = Modifier
                            .weight(1f)
                            .verticalScroll(rememberScrollState())
                            .padding(spacing.medium),
                        verticalArrangement = Arrangement.spacedBy(spacing.medium)
                    ) {
                        // Unsealed Envelope Icon Banner
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(20.dp))
                                .background(
                                    Brush.linearGradient(
                                        listOf(colors.primary.copy(alpha = 0.15f), colors.accent.copy(alpha = 0.15f))
                                    )
                                )
                                .padding(spacing.medium),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(text = "💌", fontSize = 52.sp)
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "From ${letter.senderName} • ${letter.createdAtText}",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = colors.textPrimary
                                )
                                Box(
                                    modifier = Modifier
                                        .padding(top = 6.dp)
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(Color(0xFF7FB77E).copy(alpha = 0.18f))
                                        .padding(horizontal = 10.dp, vertical = 4.dp)
                                ) {
                                    Text(
                                        text = "✓ Condition Met: ${letter.getConditionSummary()}",
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color(0xFF2E7D32)
                                    )
                                }
                            }
                        }

                        // Full Letter Text
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(20.dp),
                            colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
                        ) {
                            Column(modifier = Modifier.padding(18.dp)) {
                                Text(
                                    text = letter.letterContent.ifBlank {
                                        "My love,\n\nEvery day with you is a gift I never take for granted. You make the ordinary feel magical and the quiet moments feel full of warmth. I sealed this letter to remind you how deeply and constantly you are loved.\n\nForever yours,\n${letter.senderName} ❤️"
                                    },
                                    fontSize = 15.sp,
                                    lineHeight = 24.sp,
                                    color = colors.textPrimary,
                                    fontStyle = androidx.compose.ui.text.font.FontStyle.Italic
                                )
                            }
                        }

                        // Attached Photos (Swipeable Gallery)
                        val photos = letter.mediaItems.filter { !it.isVideo }
                        if (photos.isNotEmpty()) {
                            Text(
                                text = "Attached Photos (${photos.size}) 📸",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = colors.textPrimary
                            )
                            LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                items(photos) { photo ->
                                    Box(
                                        modifier = Modifier
                                            .size(140.dp)
                                            .clip(RoundedCornerShape(16.dp))
                                            .background(colors.surfaceVariant),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(text = "📸 Photo", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }

                        // Attached Videos (Playable Cards)
                        val videos = letter.mediaItems.filter { it.isVideo }
                        if (videos.isNotEmpty()) {
                            Text(
                                text = "Attached Videos (${videos.size}) 🎥",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = colors.textPrimary
                            )
                            LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                items(videos) { vid ->
                                    Box(
                                        modifier = Modifier
                                            .width(180.dp)
                                            .height(110.dp)
                                            .clip(RoundedCornerShape(16.dp))
                                            .background(colors.accent.copy(alpha = 0.2f)),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                            Text(text = "▶ Play Video", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = colors.accent)
                                            Text(text = vid.durationText ?: "0:30", fontSize = 10.sp, color = colors.textSecondary)
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Bottom Action Bar: Reply Button
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(spacing.medium)
                    ) {
                        TwoBeButton(
                            text = "Reply with Love 💕",
                            onClick = {
                                view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                                val quote = "Re: \"${letter.letterContent.take(40)}...\""
                                onReplyToLetter(quote)
                                onDismiss()
                            },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }

                // Celebration Confetti Explosion
                if (showCelebration) {
                    CelebrationEffects()
                }
            }
        }
    }
}
