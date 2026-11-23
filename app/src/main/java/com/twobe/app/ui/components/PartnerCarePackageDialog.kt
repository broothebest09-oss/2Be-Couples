package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.twobe.app.ui.theme.LocalTwoBeColors
import com.twobe.app.ui.theme.LocalTwoBeSpacing

data class CareGiftItem(
    val id: String,
    val title: String,
    val emoji: String,
    val note: String
)

@Composable
fun PartnerCarePackageDialog(
    partnerName: String,
    currentPhaseTitle: String,
    onDismiss: () -> Unit,
    onSendCarePackage: (List<String>, String) -> Unit
) {
    val colors = LocalTwoBeColors.current
    val spacing = LocalTwoBeSpacing.current
    val view = LocalView.current

    val careOptions = listOf(
        CareGiftItem("1", "Warm Cocoa", "☕", "Warm chocolate comfort"),
        CareGiftItem("2", "Fresh Peonies", "💐", "Gentle blooming love"),
        CareGiftItem("3", "Endless Hugs", "🫂", "Warm grounding embrace"),
        CareGiftItem("4", "Sweet Kisses", "💋", "100 gentle forehead kisses"),
        CareGiftItem("5", "Back Massage", "💆‍♀️", "Relaxation on demand"),
        CareGiftItem("6", "Chamomile Tea", "🍵", "Calm and peaceful sleep"),
        CareGiftItem("7", "Dark Chocolate", "🍫", "Sweet magnesium treat"),
        CareGiftItem("8", "Heating Pad", "🧸", "Cozy thermal comfort")
    )

    val selectedGiftIds = remember { mutableStateListOf("1", "3", "4") }
    var sweetNote by remember {
        mutableStateOf("Thinking of you my love! Take it easy today, I'm here for whatever you need 💕")
    }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .fillMaxHeight(0.85f)
                .clip(RoundedCornerShape(24.dp)),
            color = colors.background,
            tonalElevation = 6.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(spacing.large)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "🎁 Send Care Package",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.textPrimary
                        )
                        Text(
                            text = "To $partnerName • $currentPhaseTitle",
                            fontSize = 12.sp,
                            color = colors.textSecondary
                        )
                    }

                    IconButton(
                        onClick = onDismiss,
                        modifier = Modifier.size(36.dp)
                    ) {
                        Text(text = "✕", fontSize = 16.sp, color = colors.textSecondary)
                    }
                }

                Spacer(modifier = Modifier.height(spacing.medium))

                Text(
                    text = "Pick items to include in her digital care package:",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.textPrimary
                )

                Spacer(modifier = Modifier.height(spacing.small))

                // Grid of care gifts
                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    modifier = Modifier.weight(1f),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(careOptions) { item ->
                        val isSelected = selectedGiftIds.contains(item.id)
                        Box(
                            modifier = Modifier
                                .height(64.dp)
                                .clip(RoundedCornerShape(14.dp))
                                .background(if (isSelected) colors.primary.copy(alpha = 0.15f) else colors.surfaceVariant)
                                .border(
                                    width = if (isSelected) 1.5.dp else 0.5.dp,
                                    color = if (isSelected) colors.primary else Color.Transparent,
                                    shape = RoundedCornerShape(14.dp)
                                )
                                .clickable {
                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                    if (isSelected) {
                                        selectedGiftIds.remove(item.id)
                                    } else {
                                        selectedGiftIds.add(item.id)
                                    }
                                }
                                .padding(horizontal = 10.dp, vertical = 8.dp),
                            contentAlignment = Alignment.CenterStart
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Text(text = item.emoji, fontSize = 24.sp)
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = item.title,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = colors.textPrimary
                                    )
                                    Text(
                                        text = item.note,
                                        fontSize = 10.sp,
                                        color = colors.textSecondary,
                                        maxLines = 1
                                    )
                                }
                                if (isSelected) {
                                    Text(text = "✓", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = colors.primary)
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(spacing.small))

                // Custom Note
                Text(
                    text = "Sweet Message to Include",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.textPrimary
                )

                Spacer(modifier = Modifier.height(4.dp))

                OutlinedTextField(
                    value = sweetNote,
                    onValueChange = { sweetNote = it },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(80.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = colors.surfaceVariant,
                        unfocusedContainerColor = colors.surfaceVariant,
                        focusedBorderColor = colors.primary,
                        unfocusedBorderColor = Color.Transparent
                    )
                )

                Spacer(modifier = Modifier.height(spacing.medium))

                TwoBeButton(
                    text = "Send Care Package (${selectedGiftIds.size} gifts) 💖",
                    onClick = {
                        view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                        val giftTitles = careOptions.filter { selectedGiftIds.contains(it.id) }.map { "${it.emoji} ${it.title}" }
                        onSendCarePackage(giftTitles, sweetNote.trim())
                    },
                    modifier = Modifier.fillMaxWidth(),
                    enabled = selectedGiftIds.isNotEmpty()
                )
            }
        }
    }
}
