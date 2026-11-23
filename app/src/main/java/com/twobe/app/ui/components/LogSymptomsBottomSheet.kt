package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.screens.*
import com.twobe.app.ui.theme.LocalTwoBeColors
import com.twobe.app.ui.theme.LocalTwoBeSpacing
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LogSymptomsBottomSheet(
    date: LocalDate,
    existingRecord: SymptomRecord?,
    onDismiss: () -> Unit,
    onSaveRecord: (SymptomRecord) -> Unit
) {
    val colors = LocalTwoBeColors.current
    val spacing = LocalTwoBeSpacing.current
    val view = LocalView.current

    var selectedMood by remember { mutableStateOf(existingRecord?.mood) }
    var selectedPain by remember { mutableStateOf(existingRecord?.pain) }
    var selectedEnergy by remember { mutableStateOf(existingRecord?.energy) }
    var selectedFlow by remember { mutableStateOf(existingRecord?.flow) }
    var notesText by remember { mutableStateOf(existingRecord?.customNotes ?: "") }

    val dateFormatter = DateTimeFormatter.ofPattern("EEEE, MMM d")

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        containerColor = colors.background,
        dragHandle = {
            Box(
                modifier = Modifier
                    .padding(vertical = 10.dp)
                    .width(40.dp)
                    .height(4.dp)
                    .clip(CircleShape)
                    .background(colors.textSecondary.copy(alpha = 0.3f))
            )
        }
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = spacing.large)
                .padding(bottom = spacing.xlarge)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(spacing.medium)
        ) {
            // Title & Date
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "🌸 Log Daily Symptoms",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )
                    Text(
                        text = date.format(dateFormatter),
                        fontSize = 12.sp,
                        color = colors.textSecondary
                    )
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(colors.accent.copy(alpha = 0.12f))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "🔒 Private & Encrypted",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = colors.accent
                    )
                }
            }

            // 1. Mood
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "Mood",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.textPrimary
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    MoodOption.values().forEach { mood ->
                        val isSelected = selectedMood == mood
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .height(46.dp) // Touch target minimum
                                .clip(RoundedCornerShape(12.dp))
                                .background(if (isSelected) colors.primary else colors.surfaceVariant)
                                .clickable {
                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                    selectedMood = if (isSelected) null else mood
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(text = mood.emoji, fontSize = 16.sp)
                                Text(
                                    text = mood.label,
                                    fontSize = 9.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                    color = if (isSelected) Color.White else colors.textPrimary
                                )
                            }
                        }
                    }
                }
            }

            // 2. Pain Level
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "Pain / Cramps",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.textPrimary
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    PainLevel.values().forEach { pain ->
                        val isSelected = selectedPain == pain
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .height(46.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(if (isSelected) Color(0xFFE57373) else colors.surfaceVariant)
                                .clickable {
                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                    selectedPain = if (isSelected) null else pain
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Text(text = pain.emoji, fontSize = 13.sp)
                                Text(
                                    text = pain.label,
                                    fontSize = 11.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                    color = if (isSelected) Color.White else colors.textPrimary
                                )
                            }
                        }
                    }
                }
            }

            // 3. Energy Level
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "Energy",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.textPrimary
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    EnergyLevel.values().forEach { energy ->
                        val isSelected = selectedEnergy == energy
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .height(46.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(if (isSelected) colors.accent else colors.surfaceVariant)
                                .clickable {
                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                    selectedEnergy = if (isSelected) null else energy
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Text(text = energy.emoji, fontSize = 14.sp)
                                Text(
                                    text = energy.label,
                                    fontSize = 11.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                    color = if (isSelected) Color.White else colors.textPrimary
                                )
                            }
                        }
                    }
                }
            }

            // 4. Flow Level
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "Flow",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.textPrimary
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    FlowLevel.values().forEach { flow ->
                        val isSelected = selectedFlow == flow
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .height(46.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(if (isSelected) Color(0xFFD32F2F) else colors.surfaceVariant)
                                .clickable {
                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                    selectedFlow = if (isSelected) null else flow
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(text = flow.emoji, fontSize = 12.sp)
                                Text(
                                    text = flow.label,
                                    fontSize = 9.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                    color = if (isSelected) Color.White else colors.textPrimary
                                )
                            }
                        }
                    }
                }
            }

            // 5. Custom Notes
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text(
                    text = "Personal Notes (strictly confidential)",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.textPrimary
                )
                OutlinedTextField(
                    value = notesText,
                    onValueChange = { if (it.length <= 300) notesText = it },
                    placeholder = {
                        Text(
                            text = "How is your body feeling? Any food cravings, sleep quality, or reflections...",
                            fontSize = 12.sp,
                            color = colors.textSecondary.copy(alpha = 0.7f)
                        )
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(88.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = colors.surfaceVariant,
                        unfocusedContainerColor = colors.surfaceVariant,
                        focusedBorderColor = colors.primary,
                        unfocusedBorderColor = Color.Transparent
                    )
                )
                Text(
                    text = "${notesText.length}/300",
                    fontSize = 10.sp,
                    color = colors.textSecondary,
                    modifier = Modifier.align(Alignment.End)
                )
            }

            // Privacy Assurance Notice
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(colors.surfaceVariant.copy(alpha = 0.6f))
                    .border(1.dp, colors.textSecondary.copy(alpha = 0.15f), RoundedCornerShape(12.dp))
                    .padding(horizontal = 12.dp, vertical = 8.dp)
            ) {
                Text(
                    text = "🔒 Zero-Knowledge Privacy: Symptoms are encrypted on your device. Your partner only receives high-level supportive phase insights.",
                    fontSize = 11.sp,
                    lineHeight = 15.sp,
                    color = colors.textSecondary
                )
            }

            Spacer(modifier = Modifier.height(4.dp))

            // Save Button
            TwoBeButton(
                text = "Save Symptoms 🌸",
                onClick = {
                    view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                    val record = SymptomRecord(
                        id = existingRecord?.id ?: java.util.UUID.randomUUID().toString(),
                        date = date,
                        mood = selectedMood,
                        pain = selectedPain,
                        energy = selectedEnergy,
                        flow = selectedFlow,
                        customNotes = notesText.trim()
                    )
                    onSaveRecord(record)
                },
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}
