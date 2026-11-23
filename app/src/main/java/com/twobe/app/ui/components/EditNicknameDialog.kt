package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.twobe.app.ui.theme.LocalTwoBeColors
import com.twobe.app.ui.theme.LocalTwoBeSpacing

@Composable
fun EditNicknameDialog(
    partnerName: String,
    currentNickname: String,
    onDismiss: () -> Unit,
    onSaveNickname: (String) -> Unit
) {
    val colors = LocalTwoBeColors.current
    val spacing = LocalTwoBeSpacing.current
    val view = LocalView.current

    var text by remember { mutableStateOf(currentNickname) }

    val presetNicknames = listOf(
        "My Sunshine ☀️",
        "Honeybun 🍯",
        "Baby 💖",
        "Sweetheart 🌸",
        "Angel 👼",
        "Bunny 🐰"
    )

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.9f)
                .clip(RoundedCornerShape(24.dp)),
            color = colors.background,
            tonalElevation = 6.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(spacing.large),
                verticalArrangement = Arrangement.spacedBy(spacing.medium)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Edit Nickname for $partnerName",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.textPrimary
                        )
                        Text(
                            text = "A sweet private name only the two of you see",
                            fontSize = 12.sp,
                            color = colors.textSecondary
                        )
                    }

                    IconButton(onClick = onDismiss, modifier = Modifier.size(36.dp)) {
                        Text(text = "✕", fontSize = 16.sp, color = colors.textSecondary)
                    }
                }

                // Input Field
                OutlinedTextField(
                    value = text,
                    onValueChange = { if (it.length <= 30) text = it },
                    placeholder = { Text("e.g. My Sunshine ☀️", fontSize = 13.sp) },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = colors.surfaceVariant,
                        unfocusedContainerColor = colors.surfaceVariant,
                        focusedBorderColor = colors.primary,
                        unfocusedBorderColor = Color.Transparent
                    )
                )

                // Presets
                Text(
                    text = "Quick Sweet Ideas:",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.textPrimary
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    presetNicknames.take(3).forEach { suggestion ->
                        AssistChip(
                            onClick = {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                text = suggestion
                            },
                            label = { Text(text = suggestion, fontSize = 11.sp) },
                            colors = AssistChipDefaults.assistChipColors(
                                containerColor = colors.surfaceVariant
                            )
                        )
                    }
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    presetNicknames.drop(3).forEach { suggestion ->
                        AssistChip(
                            onClick = {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                text = suggestion
                            },
                            label = { Text(text = suggestion, fontSize = 11.sp) },
                            colors = AssistChipDefaults.assistChipColors(
                                containerColor = colors.surfaceVariant
                            )
                        )
                    }
                }

                Spacer(modifier = Modifier.height(4.dp))

                TwoBeButton(
                    text = "Save Nickname 💖",
                    onClick = {
                        view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                        onSaveNickname(text.trim())
                    },
                    modifier = Modifier.fillMaxWidth(),
                    enabled = text.isNotBlank()
                )
            }
        }
    }
}
