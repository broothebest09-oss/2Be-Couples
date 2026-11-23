package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
import com.twobe.app.ui.screens.CycleSettings
import com.twobe.app.ui.theme.LocalTwoBeColors
import com.twobe.app.ui.theme.LocalTwoBeSpacing
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@Composable
fun CycleSetupDialog(
    initialSettings: CycleSettings,
    isInitialSetup: Boolean = false,
    onDismiss: () -> Unit,
    onSave: (CycleSettings) -> Unit
) {
    val colors = LocalTwoBeColors.current
    val spacing = LocalTwoBeSpacing.current
    val view = LocalView.current

    var selectedStartDate by remember { mutableStateOf(initialSettings.lastPeriodStartDate) }
    var avgCycleLength by remember { mutableStateOf(initialSettings.avgCycleLength) }
    var avgPeriodLength by remember { mutableStateOf(initialSettings.avgPeriodLength) }
    var notifyRemindLog by remember { mutableStateOf(initialSettings.notifyRemindLog) }
    var notifyPartnerPhaseChanges by remember { mutableStateOf(initialSettings.notifyPartnerPhaseChanges) }

    val dateFormatter = DateTimeFormatter.ofPattern("EEEE, MMM d, yyyy")

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .fillMaxHeight(0.90f)
                .clip(RoundedCornerShape(24.dp)),
            color = colors.background,
            tonalElevation = 8.dp
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
                            text = if (isInitialSetup) "🌸 Set Up Cycle Tracker" else "⚙️ Cycle Settings",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.textPrimary
                        )
                        Text(
                            text = "Private rhythm & mutual care",
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

                // Scrollable Content
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(spacing.medium)
                ) {
                    // Explanation Box
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .background(colors.primary.copy(alpha = 0.12f))
                            .border(1.dp, colors.primary.copy(alpha = 0.3f), RoundedCornerShape(16.dp))
                            .padding(spacing.medium)
                    ) {
                        Row(verticalAlignment = Alignment.Top) {
                            Text(text = "🔒", fontSize = 20.sp, modifier = Modifier.padding(end = 10.dp))
                            Column {
                                Text(
                                    text = "Track your cycle to help your partner support you better. Your detailed symptoms remain strictly private and encrypted on your device.",
                                    fontSize = 13.sp,
                                    lineHeight = 18.sp,
                                    color = colors.textPrimary
                                )
                            }
                        }
                    }

                    // 1. Last Period Start Date
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
                    ) {
                        Column(modifier = Modifier.padding(spacing.medium)) {
                            Text(
                                text = "Last Period Start Date",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = colors.textPrimary
                            )
                            Text(
                                text = "When did your most recent period begin?",
                                fontSize = 12.sp,
                                color = colors.textSecondary,
                                modifier = Modifier.padding(bottom = 8.dp)
                            )

                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(colors.surface)
                                    .padding(horizontal = 12.dp, vertical = 10.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                IconButton(
                                    onClick = {
                                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                        selectedStartDate = selectedStartDate.minusDays(1)
                                    },
                                    modifier = Modifier.size(36.dp)
                                ) {
                                    Text(text = "◀", fontSize = 14.sp, color = colors.primary)
                                }

                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text(
                                        text = selectedStartDate.format(dateFormatter),
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = colors.textPrimary
                                    )
                                    val daysAgo = java.time.temporal.ChronoUnit.DAYS.between(selectedStartDate, LocalDate.now())
                                    Text(
                                        text = when {
                                            daysAgo == 0L -> "Today"
                                            daysAgo == 1L -> "Yesterday"
                                            daysAgo > 1L -> "$daysAgo days ago"
                                            else -> "In ${-daysAgo} days"
                                        },
                                        fontSize = 11.sp,
                                        color = colors.textSecondary
                                    )
                                }

                                IconButton(
                                    onClick = {
                                        if (selectedStartDate.isBefore(LocalDate.now())) {
                                            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                            selectedStartDate = selectedStartDate.plusDays(1)
                                        }
                                    },
                                    modifier = Modifier.size(36.dp),
                                    enabled = selectedStartDate.isBefore(LocalDate.now())
                                ) {
                                    Text(
                                        text = "▶",
                                        fontSize = 14.sp,
                                        color = if (selectedStartDate.isBefore(LocalDate.now())) colors.primary else colors.textSecondary.copy(alpha = 0.4f)
                                    )
                                }
                            }
                        }
                    }

                    // 2. Average Cycle Length (20-40 days)
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
                    ) {
                        Column(modifier = Modifier.padding(spacing.medium)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = "Average Cycle Length",
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = colors.textPrimary
                                    )
                                    Text(
                                        text = "Typical time between period starts (20–40 days)",
                                        fontSize = 11.sp,
                                        color = colors.textSecondary
                                    )
                                }
                                Text(
                                    text = "$avgCycleLength days",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.primary
                                )
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Slider(
                                value = avgCycleLength.toFloat(),
                                onValueChange = {
                                    avgCycleLength = it.toInt()
                                },
                                valueRange = 20f..40f,
                                steps = 19,
                                colors = SliderDefaults.colors(
                                    thumbColor = colors.primary,
                                    activeTrackColor = colors.primary,
                                    inactiveTrackColor = colors.surface
                                )
                            )
                        }
                    }

                    // 3. Average Period Length (2-10 days)
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
                    ) {
                        Column(modifier = Modifier.padding(spacing.medium)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = "Average Period Length",
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = colors.textPrimary
                                    )
                                    Text(
                                        text = "Number of bleeding days (2–10 days)",
                                        fontSize = 11.sp,
                                        color = colors.textSecondary
                                    )
                                }
                                Text(
                                    text = "$avgPeriodLength days",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.accent
                                )
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Slider(
                                value = avgPeriodLength.toFloat(),
                                onValueChange = {
                                    avgPeriodLength = it.toInt()
                                },
                                valueRange = 2f..10f,
                                steps = 7,
                                colors = SliderDefaults.colors(
                                    thumbColor = colors.accent,
                                    activeTrackColor = colors.accent,
                                    inactiveTrackColor = colors.surface
                                )
                            )
                        }
                    }

                    // 4. Notification Preferences
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
                    ) {
                        Column(
                            modifier = Modifier.padding(spacing.medium),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Text(
                                text = "Notification Preferences",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = colors.textPrimary
                            )

                            // For Her: Remind to log
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f).padding(end = 8.dp)) {
                                    Text(
                                        text = "Remind me to log symptoms",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Medium,
                                        color = colors.textPrimary
                                    )
                                    Text(
                                        text = "Gentle daily or period-start check-ins",
                                        fontSize = 11.sp,
                                        color = colors.textSecondary
                                    )
                                }
                                Switch(
                                    checked = notifyRemindLog,
                                    onCheckedChange = {
                                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                        notifyRemindLog = it
                                    },
                                    colors = SwitchDefaults.colors(
                                        checkedThumbColor = Color.White,
                                        checkedTrackColor = colors.primary
                                    )
                                )
                            }

                            Divider(color = colors.surface, thickness = 1.dp)

                            // For Partner: Notify phase changes
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f).padding(end = 8.dp)) {
                                    Text(
                                        text = "Notify partner of phase changes",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Medium,
                                        color = colors.textPrimary
                                    )
                                    Text(
                                        text = "Enables supportive reminders and tips for him without sharing your raw symptoms",
                                        fontSize = 11.sp,
                                        color = colors.textSecondary
                                    )
                                }
                                Switch(
                                    checked = notifyPartnerPhaseChanges,
                                    onCheckedChange = {
                                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                        notifyPartnerPhaseChanges = it
                                    },
                                    colors = SwitchDefaults.colors(
                                        checkedThumbColor = Color.White,
                                        checkedTrackColor = colors.accent
                                    )
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(spacing.medium))

                // Bottom Action Button
                TwoBeButton(
                    text = if (isInitialSetup) "Save & Start Predictions ✨" else "Save Changes",
                    onClick = {
                        view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                        val updated = initialSettings.copy(
                            isConfigured = true,
                            lastPeriodStartDate = selectedStartDate,
                            avgCycleLength = avgCycleLength,
                            avgPeriodLength = avgPeriodLength,
                            notifyRemindLog = notifyRemindLog,
                            notifyPartnerPhaseChanges = notifyPartnerPhaseChanges
                        )
                        onSave(updated)
                    },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}
