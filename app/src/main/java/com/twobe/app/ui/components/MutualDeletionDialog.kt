package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.screens.MemoryItem
import com.twobe.app.ui.theme.TwoBeTheme

@Composable
fun MutualDeletionDialog(
    memory: MemoryItem,
    partnerName: String = "Sarah",
    onConfirmRequestDeletion: () -> Unit,
    onPartnerConfirmDelete: () -> Unit,
    onCancelDeletion: () -> Unit,
    onDismiss: () -> Unit
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val view = LocalView.current

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.Black.copy(alpha = 0.7f))
            .clickable { onDismiss() }
            .padding(spacing.medium),
        contentAlignment = Alignment.Center
    ) {
        TwoBeCard(
            modifier = Modifier
                .fillMaxWidth(0.88f)
                .clickable(enabled = false) {},
            elevation = 20.dp
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Box(
                    modifier = Modifier
                        .size(60.dp)
                        .clip(CircleShape)
                        .background(Color(0xFFD64545).copy(alpha = 0.15f)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "🛡️", fontSize = 32.sp)
                }

                Spacer(modifier = Modifier.height(spacing.small))

                Text(
                    text = if (memory.isPendingDeletion) "Confirm Memory Deletion" else "Delete this memory?",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = colors.textPrimary,
                    textAlign = TextAlign.Center
                )

                Text(
                    text = if (memory.isPendingDeletion) {
                        "$partnerName requested to remove this shared memory. Once you confirm, it will be permanently erased for both of you."
                    } else {
                        "Because 2Be is your shared sanctuary, memories can only be removed when both partners agree. $partnerName will be notified and must confirm."
                    },
                    fontSize = 13.sp,
                    color = colors.textSecondary,
                    textAlign = TextAlign.Center,
                    lineHeight = 19.sp,
                    modifier = Modifier.padding(top = 6.dp, bottom = spacing.large)
                )

                if (!memory.isPendingDeletion) {
                    // Initial request flow
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        TwoBeButton(
                            text = "Request Deletion from $partnerName",
                            onClick = {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                onConfirmRequestDeletion()
                            },
                            modifier = Modifier.fillMaxWidth(),
                            variant = ButtonVariant.PRIMARY
                        )

                        TwoBeButton(
                            text = "Keep Memory",
                            onClick = onDismiss,
                            modifier = Modifier.fillMaxWidth(),
                            variant = ButtonVariant.SECONDARY
                        )
                    }
                } else {
                    // Partner confirmation / simulation flow
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        TwoBeButton(
                            text = "Confirm & Permanently Delete",
                            onClick = {
                                view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                                onPartnerConfirmDelete()
                            },
                            modifier = Modifier.fillMaxWidth(),
                            variant = ButtonVariant.PRIMARY
                        )

                        TwoBeButton(
                            text = "Cancel Deletion Request",
                            onClick = {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                onCancelDeletion()
                            },
                            modifier = Modifier.fillMaxWidth(),
                            variant = ButtonVariant.SECONDARY
                        )
                    }
                }
            }
        }
    }
}
