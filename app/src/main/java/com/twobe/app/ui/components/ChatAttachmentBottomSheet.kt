package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.foundation.background
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.SheetState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.theme.TwoBeTheme

enum class AttachmentAction {
    PHOTO_GALLERY,
    VIDEO_GALLERY,
    FILE_DOCUMENT,
    LOCKED_LETTER,
    SCRATCH_OFF
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatAttachmentBottomSheet(
    sheetState: SheetState,
    onSelectAction: (AttachmentAction) -> Unit,
    onDismiss: () -> Unit
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val view = LocalView.current

    val actions = listOf(
        Triple(AttachmentAction.PHOTO_GALLERY, "Photo", "🖼️"),
        Triple(AttachmentAction.VIDEO_GALLERY, "Video", "🎥"),
        Triple(AttachmentAction.FILE_DOCUMENT, "File", "📄"),
        Triple(AttachmentAction.LOCKED_LETTER, "Locked Letter", "💌"),
        Triple(AttachmentAction.SCRATCH_OFF, "Scratch Card", "🎁")
    )

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = colors.surface,
        dragHandle = {
            Box(
                modifier = Modifier
                    .padding(vertical = 12.dp)
                    .size(width = 36.dp, height = 4.dp)
                    .clip(RoundedCornerShape(999.dp))
                    .background(colors.border)
            )
        }
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = spacing.large, vertical = spacing.small)
                .padding(bottom = 32.dp)
        ) {
            Text(
                text = "Share Something Special",
                fontSize = 17.sp,
                fontWeight = FontWeight.Bold,
                color = colors.textPrimary,
                modifier = Modifier.padding(bottom = spacing.medium)
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                actions.forEach { (action, title, emoji) ->
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .clickable {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                onSelectAction(action)
                            }
                            .padding(horizontal = 6.dp, vertical = 8.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(54.dp)
                                .clip(CircleShape)
                                .background(colors.surfaceVariant),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = emoji, fontSize = 24.sp)
                        }

                        Spacer(modifier = Modifier.height(6.dp))

                        Text(
                            text = title,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium,
                            color = colors.textPrimary
                        )
                    }
                }
            }
        }
    }
}
