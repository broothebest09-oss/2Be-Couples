package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
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
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.theme.TwoBeTheme

data class GratitudeMilestone(
    val threshold: Int,
    val title: String,
    val subtitle: String,
    val emoji: String
)

@Composable
fun MilestoneCelebrationDialog(
    milestone: GratitudeMilestone?,
    onDismiss: () -> Unit
) {
    if (milestone == null) return

    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val view = LocalView.current

    LaunchedEffect(milestone) {
        view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.85f))
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null
            ) { onDismiss() }
            .padding(spacing.large),
        contentAlignment = Alignment.Center
    ) {
        CelebrationEffects()

        TwoBeCard(
            modifier = Modifier
                .fillMaxWidth(0.9f)
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null
                ) {},
            elevation = 24.dp
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.padding(12.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .shadow(16.dp, CircleShape, spotColor = colors.primary)
                        .clip(CircleShape)
                        .background(colors.primary.copy(alpha = 0.25f)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = milestone.emoji, fontSize = 44.sp)
                }

                Spacer(modifier = Modifier.height(spacing.medium))

                Text(
                    text = milestone.title,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = colors.textPrimary,
                    textAlign = TextAlign.Center
                )

                Text(
                    text = milestone.subtitle,
                    fontSize = 14.sp,
                    color = colors.accent,
                    fontWeight = FontWeight.SemiBold,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(top = 4.dp)
                )

                Box(
                    modifier = Modifier
                        .padding(vertical = spacing.medium)
                        .clip(CircleShape)
                        .background(colors.surfaceVariant)
                        .padding(horizontal = 14.dp, vertical = 6.dp)
                ) {
                    Text(
                        text = "✓ Auto-saved to Memories Timeline",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = colors.success
                    )
                }

                TwoBeButton(
                    text = "Celebrate Together",
                    onClick = onDismiss,
                    modifier = Modifier.fillMaxWidth(),
                    variant = ButtonVariant.PRIMARY
                )
            }
        }
    }
}
