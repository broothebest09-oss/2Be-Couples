package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.screens.GratitudeNote
import com.twobe.app.ui.theme.TwoBeTheme
import kotlinx.coroutines.launch

@Composable
fun GratitudeNoteModal(
    note: GratitudeNote?,
    onNext: () -> Unit,
    onDismiss: () -> Unit
) {
    if (note == null) return

    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val view = LocalView.current
    val scope = rememberCoroutineScope()

    val unfoldScale = remember { Animatable(0.3f) }

    LaunchedEffect(note.id) {
        view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
        unfoldScale.snapTo(0.3f)
        unfoldScale.animateTo(
            targetValue = 1f,
            animationSpec = spring(
                dampingRatio = Spring.DampingRatioMediumBouncy,
                stiffness = Spring.StiffnessMediumLow
            )
        )
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.75f))
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null
            ) { onDismiss() }
            .padding(spacing.large),
        contentAlignment = Alignment.Center
    ) {
        // Unfolded Paper Note Card
        Box(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .scale(unfoldScale.value)
                .shadow(
                    elevation = 24.dp,
                    shape = RoundedCornerShape(20.dp),
                    spotColor = colors.primary
                )
                .clip(RoundedCornerShape(20.dp))
                .background(Color(note.paperColorHex))
                .padding(spacing.large)
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null
                ) {}
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                // Header badge
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .clip(CircleShape)
                                .background(Color.White.copy(alpha = 0.7f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = note.authorAvatarEmoji, fontSize = 18.sp)
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text(
                                text = "From ${note.authorName}",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF4A343A)
                            )
                            Text(
                                text = note.dateText,
                                fontSize = 10.sp,
                                color = Color(0xFF755E64)
                            )
                        }
                    }

                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .clickable { onDismiss() },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "✕", fontSize = 16.sp, color = Color(0xFF755E64), fontWeight = FontWeight.Bold)
                    }
                }

                Spacer(modifier = Modifier.height(spacing.large))

                // Note Full Text
                Text(
                    text = "“${note.text}”",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFF2D1F24),
                    textAlign = TextAlign.Center,
                    lineHeight = 25.sp,
                    modifier = Modifier.padding(horizontal = 8.dp)
                )

                Spacer(modifier = Modifier.height(spacing.xLarge))

                // Bottom Buttons: "Next" and "Close"
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    TwoBeButton(
                        text = "Next Note 🔀",
                        onClick = {
                            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                            onNext()
                        },
                        modifier = Modifier.weight(1f),
                        variant = ButtonVariant.PRIMARY
                    )

                    TwoBeButton(
                        text = "Close",
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f),
                        variant = ButtonVariant.SECONDARY
                    )
                }
            }
        }
    }
}
