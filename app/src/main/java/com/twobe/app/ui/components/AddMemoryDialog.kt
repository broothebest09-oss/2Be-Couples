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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.screens.MemoryItem
import com.twobe.app.ui.screens.MemoryType
import com.twobe.app.ui.theme.TwoBeTheme
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

enum class AddMemoryMode {
    GALLERY,
    CHAT_MESSAGE,
    TEXT_MEMORY
}

@Composable
fun AddMemoryDialog(
    userAvatarEmoji: String = "🐰",
    userName: String = "Alex",
    onMemoryCreated: (MemoryItem) -> Unit,
    onDismiss: () -> Unit
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val view = LocalView.current

    var selectedMode by remember { mutableStateOf(AddMemoryMode.GALLERY) }
    var captionText by remember { mutableStateOf("") }
    var milestoneTitle by remember { mutableStateOf("") }

    val dateStr = remember {
        SimpleDateFormat("MMM d, yyyy", Locale.getDefault()).format(Date())
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.Black.copy(alpha = 0.65f))
            .clickable { onDismiss() }
            .padding(spacing.medium),
        contentAlignment = Alignment.Center
    ) {
        TwoBeCard(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .clickable(enabled = false) {},
            elevation = 16.dp
        ) {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Add New Memory",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )

                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .clickable { onDismiss() },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "✕", fontSize = 16.sp, color = colors.textSecondary)
                    }
                }

                Spacer(modifier = Modifier.height(spacing.small))

                // Three Mode Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf(
                        Triple(AddMemoryMode.GALLERY, "Gallery", "📸"),
                        Triple(AddMemoryMode.CHAT_MESSAGE, "From Chat", "💬"),
                        Triple(AddMemoryMode.TEXT_MEMORY, "Text Note", "📝")
                    ).forEach { (mode, label, emoji) ->
                        val isSelected = selectedMode == mode
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(12.dp))
                                .background(
                                    if (isSelected) colors.primary.copy(alpha = 0.25f)
                                    else colors.surfaceVariant
                                )
                                .border(
                                    1.dp,
                                    if (isSelected) colors.accent else Color.Transparent,
                                    RoundedCornerShape(12.dp)
                                )
                                .clickable {
                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                    selectedMode = mode
                                }
                                .padding(vertical = 10.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(text = emoji, fontSize = 20.sp)
                                Text(
                                    text = label,
                                    fontSize = 11.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                    color = if (isSelected) colors.accent else colors.textPrimary,
                                    modifier = Modifier.padding(top = 4.dp)
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(spacing.medium))

                // Preview Thumbnail Placeholder
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(130.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(colors.surfaceVariant),
                    contentAlignment = Alignment.Center
                ) {
                    when (selectedMode) {
                        AddMemoryMode.GALLERY -> {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(text = "🖼️", fontSize = 36.sp)
                                Text(
                                    text = "Sunset_at_beach.jpg selected",
                                    fontSize = 12.sp,
                                    color = colors.textSecondary,
                                    modifier = Modifier.padding(top = 4.dp)
                                )
                            }
                        }
                        AddMemoryMode.CHAT_MESSAGE -> {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(text = "💌", fontSize = 36.sp)
                                Text(
                                    text = "“I will love you forever and always”",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = colors.textPrimary,
                                    modifier = Modifier.padding(top = 4.dp)
                                )
                            }
                        }
                        AddMemoryMode.TEXT_MEMORY -> {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(text = "✨", fontSize = 36.sp)
                                Text(
                                    text = "Our secret little milestone",
                                    fontSize = 12.sp,
                                    color = colors.textSecondary,
                                    modifier = Modifier.padding(top = 4.dp)
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(spacing.medium))

                // Caption Input
                OutlinedTextField(
                    value = captionText,
                    onValueChange = { captionText = it },
                    placeholder = {
                        Text(
                            text = "Add a caption or memory note...",
                            fontSize = 13.sp,
                            color = colors.textSecondary
                        )
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = colors.primary,
                        unfocusedBorderColor = colors.border
                    )
                )

                Spacer(modifier = Modifier.height(spacing.large))

                TwoBeButton(
                    text = "Save Memory to Album",
                    onClick = {
                        view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                        val newMem = MemoryItem(
                            type = when (selectedMode) {
                                AddMemoryMode.GALLERY -> MemoryType.PHOTO
                                AddMemoryMode.CHAT_MESSAGE -> MemoryType.MILESTONE
                                AddMemoryMode.TEXT_MEMORY -> MemoryType.TEXT
                            },
                            title = if (selectedMode == AddMemoryMode.CHAT_MESSAGE) "Saved from Chat" else null,
                            caption = captionText.ifBlank { "Unforgettable moment together" },
                            milestoneEmoji = "💖",
                            dateText = dateStr,
                            timestampMillis = System.currentTimeMillis(),
                            senderName = userName,
                            senderAvatarEmoji = userAvatarEmoji,
                            originalContext = if (selectedMode == AddMemoryMode.CHAT_MESSAGE) "Private Chat" else "Gallery Upload"
                        )
                        onMemoryCreated(newMem)
                    },
                    modifier = Modifier.fillMaxWidth(),
                    variant = ButtonVariant.PRIMARY
                )
            }
        }
    }
}
