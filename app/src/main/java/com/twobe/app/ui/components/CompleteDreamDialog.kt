package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.screens.BucketItem
import com.twobe.app.ui.theme.TwoBeTheme

@Composable
fun CompleteDreamDialog(
    item: BucketItem,
    onConfirmWithMemory: (BucketItem) -> Unit,
    onConfirmWithoutMemory: (BucketItem) -> Unit,
    onDismiss: () -> Unit
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val view = LocalView.current

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.7f))
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null
            ) { onDismiss() }
            .padding(spacing.large),
        contentAlignment = Alignment.Center
    ) {
        TwoBeCard(
            modifier = Modifier
                .fillMaxWidth(0.9f)
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null
                ) {},
            elevation = 20.dp
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.padding(8.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(64.dp)
                        .clip(CircleShape)
                        .background(colors.success.copy(alpha = 0.2f)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "✅", fontSize = 34.sp)
                }

                Spacer(modifier = Modifier.height(spacing.medium))

                Text(
                    text = "Mark dream as completed?",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = colors.textPrimary,
                    textAlign = TextAlign.Center
                )

                Text(
                    text = "“${item.text}”",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.accent,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(top = 4.dp, bottom = spacing.small)
                )

                Text(
                    text = "Would you like to preserve this moment in your shared Memories Timeline?",
                    fontSize = 13.sp,
                    color = colors.textSecondary,
                    textAlign = TextAlign.Center,
                    lineHeight = 18.sp,
                    modifier = Modifier.padding(bottom = spacing.large)
                )

                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    TwoBeButton(
                        text = "Yes, Create Memory & Complete 🎉",
                        onClick = {
                            view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                            onConfirmWithMemory(item)
                        },
                        modifier = Modifier.fillMaxWidth(),
                        variant = ButtonVariant.PRIMARY
                    )

                    TwoBeButton(
                        text = "Complete Without Memory",
                        onClick = {
                            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                            onConfirmWithoutMemory(item)
                        },
                        modifier = Modifier.fillMaxWidth(),
                        variant = ButtonVariant.SECONDARY
                    )

                    TwoBeButton(
                        text = "Cancel",
                        onClick = onDismiss,
                        modifier = Modifier.fillMaxWidth(),
                        variant = ButtonVariant.GHOST
                    )
                }
            }
        }
    }
}
