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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.SheetState
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
import com.twobe.app.ui.screens.BucketCategory
import com.twobe.app.ui.screens.BucketItem
import com.twobe.app.ui.theme.TwoBeTheme
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddDreamBottomSheet(
    sheetState: SheetState,
    userName: String = "Alex",
    userAvatarEmoji: String = "🐰",
    onAddDream: (BucketItem) -> Unit,
    onDismiss: () -> Unit
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val view = LocalView.current

    var dreamText by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf(BucketCategory.TRAVEL) }
    var targetDate by remember { mutableStateOf("") }

    val todayStr = remember {
        SimpleDateFormat("MMM d, yyyy", Locale.getDefault()).format(Date())
    }

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
                .padding(bottom = 36.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Add a Couple Dream",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = colors.textPrimary
                )

                Text(
                    text = "${dreamText.length}/200",
                    fontSize = 11.sp,
                    color = if (dreamText.length > 180) colors.error else colors.textSecondary
                )
            }

            Spacer(modifier = Modifier.height(spacing.small))

            // Dream text input (max 200 chars)
            OutlinedTextField(
                value = dreamText,
                onValueChange = { if (it.length <= 200) dreamText = it },
                placeholder = {
                    Text(
                        text = "e.g., Stargaze from a glass cabin in Norway...",
                        fontSize = 13.sp,
                        color = colors.textSecondary
                    )
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(90.dp),
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = colors.primary,
                    unfocusedBorderColor = colors.border
                )
            )

            Spacer(modifier = Modifier.height(spacing.medium))

            // Category Selector Chips
            Text(
                text = "CATEGORY",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = colors.accent,
                letterSpacing = 1.sp
            )

            Spacer(modifier = Modifier.height(spacing.xxSmall))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                BucketCategory.values().forEach { category ->
                    val isSelected = selectedCategory == category
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(999.dp))
                            .background(
                                if (isSelected) colors.primary.copy(alpha = 0.25f)
                                else colors.surfaceVariant
                            )
                            .border(
                                1.dp,
                                if (isSelected) colors.accent else Color.Transparent,
                                RoundedCornerShape(999.dp)
                            )
                            .clickable {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                selectedCategory = category
                            }
                            .padding(horizontal = 10.dp, vertical = 6.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "${category.emoji} ${category.label}",
                            fontSize = 11.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                            color = if (isSelected) colors.accent else colors.textPrimary
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(spacing.medium))

            // Optional Target Date
            Text(
                text = "TARGET TIMELINE (OPTIONAL)",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = colors.accent,
                letterSpacing = 1.sp
            )

            Spacer(modifier = Modifier.height(spacing.xxSmall))

            OutlinedTextField(
                value = targetDate,
                onValueChange = { targetDate = it },
                placeholder = {
                    Text(
                        text = "e.g., Summer 2027, Our Anniversary, By December",
                        fontSize = 12.sp,
                        color = colors.textSecondary
                    )
                },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = colors.primary,
                    unfocusedBorderColor = colors.border
                )
            )

            Spacer(modifier = Modifier.height(spacing.large))

            // Add to List Button
            TwoBeButton(
                text = "Add to List ✨",
                onClick = {
                    if (dreamText.isNotBlank()) {
                        view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                        val newDream = BucketItem(
                            text = dreamText.trim(),
                            authorName = userName,
                            authorAvatarEmoji = userAvatarEmoji,
                            dateAdded = todayStr,
                            category = selectedCategory,
                            targetDate = targetDate.ifBlank { null }
                        )
                        onAddDream(newDream)
                    }
                },
                enabled = dreamText.isNotBlank(),
                modifier = Modifier.fillMaxWidth(),
                variant = ButtonVariant.PRIMARY
            )
        }
    }
}
