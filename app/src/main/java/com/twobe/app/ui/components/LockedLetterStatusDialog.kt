package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.twobe.app.ui.screens.LockedLetterPayload
import com.twobe.app.ui.screens.UnlockConditionType
import com.twobe.app.ui.theme.LocalTwoBeColors
import com.twobe.app.ui.theme.LocalTwoBeSpacing

@Composable
fun LockedLetterStatusDialog(
    letter: LockedLetterPayload,
    partnerName: String = letter.senderName,
    onDismiss: () -> Unit,
    onUnlockSuccess: () -> Unit = {},
    onForceManualUnlock: () -> Unit = onUnlockSuccess
) {
    val colors = LocalTwoBeColors.current
    val spacing = LocalTwoBeSpacing.current
    val view = LocalView.current

    var manualUnlockRequested by remember { mutableStateOf(false) }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.9f)
                .clip(RoundedCornerShape(24.dp)),
            color = colors.background,
            tonalElevation = 8.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(spacing.large),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(spacing.medium)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    IconButton(onClick = onDismiss, modifier = Modifier.size(32.dp)) {
                        Text(text = "✕", fontSize = 16.sp, color = colors.textSecondary)
                    }
                }

                // Envelope Icon with Lock
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .clip(CircleShape)
                        .background(colors.accent.copy(alpha = 0.15f)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "🔒", fontSize = 42.sp)
                }

                // Title
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "Sealed Love Letter",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )
                    Text(
                        text = "From ${letter.senderName}",
                        fontSize = 13.sp,
                        color = colors.accent,
                        modifier = Modifier.padding(top = 2.dp)
                    )
                }

                // Condition Card & Progress
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(
                            text = letter.getConditionSummary(),
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.textPrimary,
                            textAlign = TextAlign.Center
                        )

                        Text(
                            text = letter.getRemainingStatusText(),
                            fontSize = 12.sp,
                            lineHeight = 17.sp,
                            color = colors.textSecondary,
                            textAlign = TextAlign.Center
                        )

                        // If Action condition: show progress bar
                        if (letter.conditionType == UnlockConditionType.AFTER_ACTION) {
                            val progress = (letter.currentActionCount.toFloat() / letter.targetActionCount).coerceIn(0f, 1f)
                            LinearProgressIndicator(
                                progress = progress,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(8.dp)
                                    .clip(CircleShape),
                                color = colors.primary,
                                trackColor = colors.surface
                            )
                        }
                    }
                }

                // Fallback for Location / Manual Unlock Request
                if (letter.conditionType == UnlockConditionType.LOCATION) {
                    if (!manualUnlockRequested) {
                        OutlinedButton(
                            onClick = {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                manualUnlockRequested = true
                            },
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text(text = "Cannot reach location? Request Unlock", fontSize = 11.sp, color = colors.accent)
                        }
                    } else {
                        Text(
                            text = "✓ Unlock request sent to ${letter.senderName}",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF7FB77E)
                        )
                    }
                }

                // Action button (Can simulate unlock for testing or close)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    TwoBeButton(
                        text = "I'll Wait! 💕",
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f)
                    )

                    OutlinedButton(
                        onClick = {
                            view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                            onForceManualUnlock()
                        },
                        modifier = Modifier.height(48.dp),
                        shape = RoundedCornerShape(24.dp)
                    ) {
                        Text(text = "Unlock Now ✨", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = colors.primary)
                    }
                }
            }
        }
    }
}
