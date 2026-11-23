package com.twobe.app.ui.screens

import android.view.HapticFeedbackConstants
import androidx.compose.animation.*
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.components.*
import com.twobe.app.ui.theme.LocalTwoBeColors
import com.twobe.app.ui.theme.LocalTwoBeSpacing
import java.time.LocalDate
import java.time.format.DateTimeFormatter

enum class CycleViewPerspective {
    HER_VIEW,
    PARTNER_VIEW
}

@Composable
fun CycleTrackerSection(
    partnerName: String = "Sarah",
    userName: String = "Alex",
    modifier: Modifier = Modifier
) {
    val colors = LocalTwoBeColors.current
    val spacing = LocalTwoBeSpacing.current
    val view = LocalView.current

    // Cycle Settings & State
    var settings by remember {
        mutableStateOf(
            CycleSettings(
                isConfigured = true,
                lastPeriodStartDate = LocalDate.now().minusDays(12),
                lastPeriodEndDate = LocalDate.now().minusDays(7),
                avgCycleLength = 28,
                avgPeriodLength = 5,
                notifyRemindLog = true,
                notifyPartnerPhaseChanges = true
            )
        )
    }

    var selectedDate by remember { mutableStateOf(LocalDate.now()) }
    var perspective by remember { mutableStateOf(CycleViewPerspective.HER_VIEW) }
    var showSetupDialog by remember { mutableStateOf(false) }
    var showSymptomsSheet by remember { mutableStateOf(false) }
    var showCarePackageDialog by remember { mutableStateOf(false) }
    var showTipsDialog by remember { mutableStateOf(false) }
    var feedbackMessage by remember { mutableStateOf<String?>(null) }

    // Sample symptoms logged by her (strictly private)
    val symptomsMap = remember {
        mutableStateMapOf(
            LocalDate.now().minusDays(12) to SymptomRecord(
                date = LocalDate.now().minusDays(12),
                mood = MoodOption.TIRED,
                pain = PainLevel.MODERATE,
                energy = EnergyLevel.LOW,
                flow = FlowLevel.MEDIUM,
                customNotes = "Mild cramps in the morning, craving dark chocolate and warmth."
            ),
            LocalDate.now().minusDays(11) to SymptomRecord(
                date = LocalDate.now().minusDays(11),
                mood = MoodOption.CALM,
                pain = PainLevel.MILD,
                energy = EnergyLevel.MEDIUM,
                flow = FlowLevel.LIGHT,
                customNotes = "Much better today, enjoyed tea with honey."
            ),
            LocalDate.now() to SymptomRecord(
                date = LocalDate.now(),
                mood = MoodOption.HAPPY,
                pain = PainLevel.NONE,
                energy = EnergyLevel.HIGH,
                customNotes = "Feeling vibrant, creative, and excited for dinner tonight!"
            )
        )
    }

    val currentCycleDay = CycleCalculator.calculateCurrentCycleDay(settings)
    val currentPhase = CycleCalculator.calculatePhaseForDay(settings, LocalDate.now())
    val selectedDayPhase = CycleCalculator.calculatePhaseForDay(settings, selectedDate)
    val nextPeriodDays = CycleCalculator.calculateNextPeriodDays(settings)
    val fertileWindow = CycleCalculator.calculateFertileWindowDates(settings)

    val dateFormatter = DateTimeFormatter.ofPattern("EEEE, MMM d")

    Box(modifier = modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(bottom = 80.dp)
        ) {
            // ==========================================
            // TOP BAR: Title & Perspective Switcher
            // ==========================================
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = spacing.medium, vertical = spacing.small),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "🌸 Cycle Tracker",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )
                    Text(
                        text = if (perspective == CycleViewPerspective.HER_VIEW) "Her private tracking & rhythm" else "Supportive partner insights",
                        fontSize = 11.sp,
                        color = colors.textSecondary
                    )
                }

                IconButton(
                    onClick = {
                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                        showSetupDialog = true
                    },
                    modifier = Modifier.size(36.dp)
                ) {
                    Text(text = "⚙️", fontSize = 16.sp)
                }
            }

            // Segmented Control: Her View vs Partner View
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = spacing.medium)
                    .clip(RoundedCornerShape(999.dp))
                    .background(colors.surfaceVariant)
                    .padding(3.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // Her View
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(999.dp))
                        .background(if (perspective == CycleViewPerspective.HER_VIEW) colors.primary else Color.Transparent)
                        .clickable {
                            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                            perspective = CycleViewPerspective.HER_VIEW
                        }
                        .padding(vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Her View 🌸",
                        fontSize = 12.sp,
                        fontWeight = if (perspective == CycleViewPerspective.HER_VIEW) FontWeight.Bold else FontWeight.Medium,
                        color = if (perspective == CycleViewPerspective.HER_VIEW) Color.White else colors.textSecondary
                    )
                }

                // Partner View
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(999.dp))
                        .background(if (perspective == CycleViewPerspective.PARTNER_VIEW) colors.accent else Color.Transparent)
                        .clickable {
                            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                            perspective = CycleViewPerspective.PARTNER_VIEW
                        }
                        .padding(vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Partner View (for him) 💙",
                        fontSize = 12.sp,
                        fontWeight = if (perspective == CycleViewPerspective.PARTNER_VIEW) FontWeight.Bold else FontWeight.Medium,
                        color = if (perspective == CycleViewPerspective.PARTNER_VIEW) Color.White else colors.textSecondary
                    )
                }
            }

            Spacer(modifier = Modifier.height(spacing.medium))

            // ==========================================
            // REGION 1: STATUS CARD
            // ==========================================
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = spacing.medium),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(spacing.medium)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(38.dp)
                                    .clip(CircleShape)
                                    .background(colors.primary.copy(alpha = 0.2f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = currentPhase.emoji, fontSize = 20.sp)
                            }
                            Column {
                                Text(
                                    text = "Currently: ${currentPhase.title}",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                                Text(
                                    text = "Day $currentCycleDay of ${settings.avgCycleLength}-day cycle",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = colors.primary
                                )
                            }
                        }

                        // Next Period Pill
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .background(colors.accent.copy(alpha = 0.15f))
                                .padding(horizontal = 10.dp, vertical = 6.dp)
                        ) {
                            Column(horizontalAlignment = Alignment.End) {
                                Text(
                                    text = "Next Period",
                                    fontSize = 10.sp,
                                    color = colors.textSecondary
                                )
                                Text(
                                    text = "In $nextPeriodDays days",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.accent
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(spacing.small))

                    // Fertile window info
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(colors.surface.copy(alpha = 0.7f))
                            .padding(horizontal = 12.dp, vertical = 8.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Text(text = "✨", fontSize = 14.sp)
                            Text(
                                text = "Fertile Window",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Medium,
                                color = colors.textPrimary
                            )
                        }
                        Text(
                            text = fertileWindow,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.primary
                        )
                    }

                    // Supportive Phase Message
                    Spacer(modifier = Modifier.height(spacing.small))
                    Text(
                        text = if (perspective == CycleViewPerspective.HER_VIEW) currentPhase.herDescription else currentPhase.partnerContext,
                        fontSize = 12.sp,
                        lineHeight = 17.sp,
                        color = colors.textSecondary
                    )
                }
            }

            Spacer(modifier = Modifier.height(spacing.medium))

            // ==========================================
            // REGION 2: INTERACTIVE MONTHLY CALENDAR
            // ==========================================
            Box(modifier = Modifier.padding(horizontal = spacing.medium)) {
                CycleCalendarView(
                    settings = settings,
                    selectedDate = selectedDate,
                    onSelectDate = { date ->
                        selectedDate = date
                    },
                    symptomsMap = symptomsMap
                )
            }

            Spacer(modifier = Modifier.height(spacing.medium))

            // ==========================================
            // REGION 3: SELECTED DAY DETAILS CARD
            // ==========================================
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = spacing.medium),
                shape = RoundedCornerShape(18.dp),
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
                                text = selectedDate.format(dateFormatter),
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = colors.textPrimary
                            )
                            val dayCycleNumber = CycleCalculator.calculateCurrentCycleDay(settings, selectedDate)
                            Text(
                                text = "${selectedDayPhase.emoji} ${selectedDayPhase.title} • Cycle Day $dayCycleNumber",
                                fontSize = 12.sp,
                                color = colors.primary
                            )
                        }

                        if (perspective == CycleViewPerspective.HER_VIEW) {
                            OutlinedButton(
                                onClick = {
                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                    showSymptomsSheet = true
                                },
                                shape = RoundedCornerShape(20.dp),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                            ) {
                                Text(
                                    text = if (symptomsMap.containsKey(selectedDate)) "Edit Log ✏️" else "Log Day 🌸",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.primary
                                )
                            }
                        }
                    }

                    // If Her View and symptoms exist for selected day, show them
                    if (perspective == CycleViewPerspective.HER_VIEW) {
                        val record = symptomsMap[selectedDate]
                        if (record != null) {
                            Spacer(modifier = Modifier.height(spacing.small))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                record.mood?.let {
                                    AssistChip(
                                        onClick = {},
                                        label = { Text("${it.emoji} ${it.label}", fontSize = 11.sp) },
                                        colors = AssistChipDefaults.assistChipColors(containerColor = colors.surface)
                                    )
                                }
                                record.pain?.let {
                                    AssistChip(
                                        onClick = {},
                                        label = { Text("${it.emoji} ${it.label} pain", fontSize = 11.sp) },
                                        colors = AssistChipDefaults.assistChipColors(containerColor = colors.surface)
                                    )
                                }
                                record.energy?.let {
                                    AssistChip(
                                        onClick = {},
                                        label = { Text("${it.emoji} ${it.label} energy", fontSize = 11.sp) },
                                        colors = AssistChipDefaults.assistChipColors(containerColor = colors.surface)
                                    )
                                }
                                record.flow?.let {
                                    AssistChip(
                                        onClick = {},
                                        label = { Text("${it.emoji} ${it.label}", fontSize = 11.sp) },
                                        colors = AssistChipDefaults.assistChipColors(containerColor = colors.surface)
                                    )
                                }
                            }

                            if (record.customNotes.isNotEmpty()) {
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "\"${record.customNotes}\"",
                                    fontSize = 12.sp,
                                    fontStyle = androidx.compose.ui.text.font.FontStyle.Italic,
                                    color = colors.textSecondary
                                )
                            }
                        } else {
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "No symptoms logged for this date.",
                                fontSize = 11.sp,
                                color = colors.textSecondary
                            )
                        }
                    } else {
                        // Partner view day guidance
                        Spacer(modifier = Modifier.height(spacing.small))
                        Text(
                            text = selectedDayPhase.partnerContext,
                            fontSize = 12.sp,
                            lineHeight = 17.sp,
                            color = colors.textSecondary
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(spacing.medium))

            // ==========================================
            // REGION 4: HER VIEW ACTIONS vs PARTNER VIEW ACTIONS
            // ==========================================
            if (perspective == CycleViewPerspective.HER_VIEW) {
                // LOGGING ACTION BUTTONS (For Her)
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = spacing.medium),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
                ) {
                    Column(
                        modifier = Modifier.padding(spacing.medium),
                        verticalArrangement = Arrangement.spacedBy(spacing.small)
                    ) {
                        Text(
                            text = "Quick Logging",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.textPrimary
                        )

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            // Log Period Start Button
                            Button(
                                onClick = {
                                    view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                                    settings = settings.copy(lastPeriodStartDate = LocalDate.now())
                                    feedbackMessage = "Period start logged for today! Cycle predictions updated."
                                },
                                modifier = Modifier.weight(1f).height(46.dp),
                                shape = RoundedCornerShape(14.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE57373))
                            ) {
                                Text(
                                    text = "Period Started 🩸",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                            }

                            // Log Period End Button
                            Button(
                                onClick = {
                                    view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                                    settings = settings.copy(lastPeriodEndDate = LocalDate.now())
                                    feedbackMessage = "Period end logged for today! 🌸"
                                },
                                modifier = Modifier.weight(1f).height(46.dp),
                                shape = RoundedCornerShape(14.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = colors.surface)
                            ) {
                                Text(
                                    text = "Period Ended 🌸",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                            }
                        }

                        // Log Symptoms Full Button
                        TwoBeButton(
                            text = "Log Symptoms for Today 📝",
                            onClick = {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                selectedDate = LocalDate.now()
                                showSymptomsSheet = true
                            },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            } else {
                // PARTNER VIEW ACTIONS (For Him)
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = spacing.medium),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
                ) {
                    Column(
                        modifier = Modifier.padding(spacing.medium),
                        verticalArrangement = Arrangement.spacedBy(spacing.small)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Support $partnerName",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = colors.textPrimary
                            )

                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(colors.accent.copy(alpha = 0.12f))
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = "🔒 Privacy Shield Active",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = colors.accent
                                )
                            }
                        }

                        Text(
                            text = "Detailed symptom records are private to her. Here are thoughtful gestures to brighten her day:",
                            fontSize = 12.sp,
                            lineHeight = 16.sp,
                            color = colors.textSecondary
                        )

                        Spacer(modifier = Modifier.height(4.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Button(
                                onClick = {
                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                    showCarePackageDialog = true
                                },
                                modifier = Modifier.weight(1f).height(46.dp),
                                shape = RoundedCornerShape(14.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = colors.primary)
                            ) {
                                Text(
                                    text = "Send Care Package 🎁",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                            }

                            OutlinedButton(
                                onClick = {
                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                    showTipsDialog = true
                                },
                                modifier = Modifier.weight(1f).height(46.dp),
                                shape = RoundedCornerShape(14.dp),
                                colors = ButtonDefaults.outlinedButtonColors(contentColor = colors.accent)
                            ) {
                                Text(
                                    text = "View Tips 💡",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(spacing.medium))

            // ==========================================
            // REGION 5: PREDICTIONS SECTION
            // ==========================================
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = spacing.medium),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
            ) {
                Column(modifier = Modifier.padding(spacing.medium)) {
                    Text(
                        text = "Predictions & Statistics",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )
                    Text(
                        text = "Based on your last 3 cycles:",
                        fontSize = 12.sp,
                        color = colors.textSecondary
                    )

                    Spacer(modifier = Modifier.height(spacing.small))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        // Average cycle
                        Column(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(12.dp))
                                .background(colors.surface)
                                .padding(10.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = "${settings.avgCycleLength} days",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = colors.primary
                            )
                            Text(
                                text = "Avg Cycle",
                                fontSize = 11.sp,
                                color = colors.textSecondary
                            )
                        }

                        Spacer(modifier = Modifier.width(8.dp))

                        // Average period
                        Column(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(12.dp))
                                .background(colors.surface)
                                .padding(10.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = "${settings.avgPeriodLength} days",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = colors.accent
                            )
                            Text(
                                text = "Avg Period",
                                fontSize = 11.sp,
                                color = colors.textSecondary
                            )
                        }

                        Spacer(modifier = Modifier.width(8.dp))

                        // Accuracy
                        Column(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(12.dp))
                                .background(colors.surface)
                                .padding(10.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = "94%",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF7FB77E)
                            )
                            Text(
                                text = "Accuracy",
                                fontSize = 11.sp,
                                color = colors.textSecondary
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "💡 Predictions get more accurate the more you log",
                        fontSize = 11.sp,
                        fontStyle = androidx.compose.ui.text.font.FontStyle.Italic,
                        color = colors.textSecondary
                    )
                }
            }

            Spacer(modifier = Modifier.height(spacing.medium))

            // ==========================================
            // REGION 6: NOTIFICATIONS & REMINDERS
            // ==========================================
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = spacing.medium),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant)
            ) {
                Column(
                    modifier = Modifier.padding(spacing.medium),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = "Active Notifications",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(text = "🔔", fontSize = 16.sp)
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "For Her: Period alerts & symptom reminders",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Medium,
                                color = colors.textPrimary
                            )
                            Text(
                                text = if (settings.notifyRemindLog) "Enabled (2 days before period & ovulation)" else "Disabled",
                                fontSize = 11.sp,
                                color = if (settings.notifyRemindLog) Color(0xFF7FB77E) else colors.textSecondary
                            )
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(text = "💌", fontSize = 16.sp)
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "For Him: Phase change support reminders",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Medium,
                                color = colors.textPrimary
                            )
                            Text(
                                text = if (settings.notifyPartnerPhaseChanges) "Enabled (Sends gentle supportive prompts)" else "Disabled",
                                fontSize = 11.sp,
                                color = if (settings.notifyPartnerPhaseChanges) Color(0xFF7FB77E) else colors.textSecondary
                            )
                        }
                    }
                }
            }
        }

        // Feedback Snackbar / Banner
        feedbackMessage?.let { msg ->
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 24.dp, start = 16.dp, end = 16.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(colors.accent)
                    .clickable { feedbackMessage = null }
                    .padding(horizontal = 16.dp, vertical = 12.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(text = "✓", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    Text(
                        text = msg,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color.White
                    )
                }
            }
        }

        // First Time / Edit Settings Dialog
        if (showSetupDialog) {
            CycleSetupDialog(
                initialSettings = settings,
                isInitialSetup = !settings.isConfigured,
                onDismiss = { showSetupDialog = false },
                onSave = { updatedSettings ->
                    settings = updatedSettings
                    showSetupDialog = false
                    feedbackMessage = "Cycle settings saved & predictions recalibrated ✨"
                }
            )
        }

        // Log Symptoms Bottom Sheet (For Her)
        if (showSymptomsSheet) {
            LogSymptomsBottomSheet(
                date = selectedDate,
                existingRecord = symptomsMap[selectedDate],
                onDismiss = { showSymptomsSheet = false },
                onSaveRecord = { record ->
                    symptomsMap[record.date] = record
                    showSymptomsSheet = false
                    feedbackMessage = "Symptoms saved securely for ${record.date.format(dateFormatter)} 🌸"
                }
            )
        }

        // Partner Care Package Dialog
        if (showCarePackageDialog) {
            PartnerCarePackageDialog(
                partnerName = partnerName,
                currentPhaseTitle = currentPhase.title,
                onDismiss = { showCarePackageDialog = false },
                onSendCarePackage = { gifts, note ->
                    showCarePackageDialog = false
                    feedbackMessage = "Care package sent to $partnerName! 🎁 (${gifts.size} items)"
                }
            )
        }

        // Cycle Tips Dialog
        if (showTipsDialog) {
            CycleTipsDialog(
                phase = currentPhase,
                partnerName = partnerName,
                onDismiss = { showTipsDialog = false }
            )
        }
    }
}
