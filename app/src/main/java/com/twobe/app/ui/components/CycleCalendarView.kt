package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.screens.CycleCalculator
import com.twobe.app.ui.screens.CycleSettings
import com.twobe.app.ui.screens.SymptomRecord
import com.twobe.app.ui.theme.LocalTwoBeColors
import com.twobe.app.ui.theme.LocalTwoBeSpacing
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.YearMonth
import java.time.format.DateTimeFormatter
import java.time.format.TextStyle
import java.util.Locale

@Composable
fun CycleCalendarView(
    settings: CycleSettings,
    selectedDate: LocalDate,
    onSelectDate: (LocalDate) -> Unit,
    symptomsMap: Map<LocalDate, SymptomRecord>,
    modifier: Modifier = Modifier
) {
    val colors = LocalTwoBeColors.current
    val spacing = LocalTwoBeSpacing.current
    val view = LocalView.current

    var currentYearMonth by remember { mutableStateOf(YearMonth.from(selectedDate)) }
    val today = remember { LocalDate.now() }

    val monthFormatter = DateTimeFormatter.ofPattern("MMMM yyyy")

    // Theme color palette for cycle states
    val periodColor = Color(0xFFE57373) // Soft Red
    val fertileColor = Color(0xFFF48FB1) // Soft Pink
    val ovulationColor = colors.accent   // Deep Berry Accent
    val predictedColor = Color(0xFFE8A5B9) // Soft Rose

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = colors.surfaceVariant.copy(alpha = 0.85f)),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(spacing.medium)
        ) {
            // Month navigation header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Previous month button (min touch target 44px)
                IconButton(
                    onClick = {
                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                        currentYearMonth = currentYearMonth.minusMonths(1)
                    },
                    modifier = Modifier.size(44.dp)
                ) {
                    Text(text = "◀", fontSize = 14.sp, color = colors.primary)
                }

                // Month title + Today quick jump button
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = currentYearMonth.format(monthFormatter),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )

                    if (currentYearMonth != YearMonth.from(today)) {
                        Text(
                            text = "Today",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = colors.primary,
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(colors.primary.copy(alpha = 0.15f))
                                .clickable {
                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                    currentYearMonth = YearMonth.from(today)
                                    onSelectDate(today)
                                }
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }

                // Next month button (min touch target 44px)
                IconButton(
                    onClick = {
                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                        currentYearMonth = currentYearMonth.plusMonths(1)
                    },
                    modifier = Modifier.size(44.dp)
                ) {
                    Text(text = "▶", fontSize = 14.sp, color = colors.primary)
                }
            }

            Spacer(modifier = Modifier.height(spacing.small))

            // Day of Week Header (Sun, Mon, Tue, etc.)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceAround
            ) {
                val daysOfWeek = listOf(
                    DayOfWeek.SUNDAY, DayOfWeek.MONDAY, DayOfWeek.TUESDAY,
                    DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY
                )
                daysOfWeek.forEach { dayOfWeek ->
                    Text(
                        text = dayOfWeek.getDisplayName(TextStyle.SHORT, Locale.getDefault()).take(2),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = colors.textSecondary,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            Spacer(modifier = Modifier.height(spacing.xsmall))

            // Calendar Days Grid
            AnimatedContent(
                targetState = currentYearMonth,
                transitionSpec = { fadeIn() togetherWith fadeOut() },
                label = "MonthGridTransition"
            ) { ym ->
                val firstOfMonth = ym.atDay(1)
                val daysInMonth = ym.lengthOfMonth()
                // Day of week where Sunday is 0, Monday is 1, etc.
                val firstDayOfWeekIndex = firstOfMonth.dayOfWeek.value % 7

                val totalCells = ((firstDayOfWeekIndex + daysInMonth + 6) / 7) * 7

                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    for (week in 0 until (totalCells / 7)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceAround
                        ) {
                            for (dayCol in 0..6) {
                                val cellIndex = week * 7 + dayCol
                                val dayNumber = cellIndex - firstDayOfWeekIndex + 1

                                if (dayNumber in 1..daysInMonth) {
                                    val cellDate = ym.atDay(dayNumber)
                                    val isToday = cellDate.isEqual(today)
                                    val isSelected = cellDate.isEqual(selectedDate)
                                    val isPeriod = CycleCalculator.isPeriodDay(settings, cellDate)
                                    val isFertile = CycleCalculator.isFertileDay(settings, cellDate)
                                    val isOvulation = CycleCalculator.isOvulationDay(settings, cellDate)
                                    val isPredicted = !isPeriod && CycleCalculator.isPredictedNextPeriodDay(settings, cellDate, today)
                                    val hasSymptoms = symptomsMap.containsKey(cellDate)

                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .height(44.dp) // Touch target minimum 44px
                                            .clip(CircleShape)
                                            // Predicted next period dotted circle border
                                            .then(
                                                if (isPredicted) {
                                                    Modifier.drawBehind {
                                                        drawCircle(
                                                            color = periodColor.copy(alpha = 0.8f),
                                                            style = Stroke(
                                                                width = 2.dp.toPx(),
                                                                pathEffect = PathEffect.dashPathEffect(floatArrayOf(10f, 10f), 0f)
                                                            )
                                                        )
                                                    }
                                                } else Modifier
                                            )
                                            // Solid colored backgrounds for period / fertile
                                            .then(
                                                when {
                                                    isPeriod -> Modifier.background(periodColor.copy(alpha = 0.85f))
                                                    isOvulation -> Modifier.background(ovulationColor)
                                                    isFertile -> Modifier.background(fertileColor.copy(alpha = 0.45f))
                                                    isSelected -> Modifier.background(colors.primary.copy(alpha = 0.25f))
                                                    else -> Modifier
                                                }
                                            )
                                            // Bold border for today
                                            .then(
                                                if (isToday) {
                                                    Modifier.border(2.dp, colors.accent, CircleShape)
                                                } else if (isSelected && !isToday) {
                                                    Modifier.border(1.5.dp, colors.primary, CircleShape)
                                                } else Modifier
                                            )
                                            .clickable {
                                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                                onSelectDate(cellDate)
                                            },
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Column(
                                            horizontalAlignment = Alignment.CenterHorizontally,
                                            verticalArrangement = Arrangement.Center
                                        ) {
                                            Text(
                                                text = "$dayNumber",
                                                fontSize = 13.sp,
                                                fontWeight = if (isToday || isSelected || isPeriod || isOvulation) FontWeight.Bold else FontWeight.Medium,
                                                color = when {
                                                    isPeriod || isOvulation -> Color.White
                                                    isToday -> colors.accent
                                                    else -> colors.textPrimary
                                                }
                                            )

                                            // Small indicator dot for logged symptoms
                                            if (hasSymptoms) {
                                                Box(
                                                    modifier = Modifier
                                                        .size(4.dp)
                                                        .clip(CircleShape)
                                                        .background(if (isPeriod || isOvulation) Color.White else colors.primary)
                                                )
                                            }
                                        }
                                    }
                                } else {
                                    // Empty cell outside current month
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .height(44.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(spacing.medium))

            // Calendar Legend
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(colors.surface.copy(alpha = 0.7f))
                    .padding(horizontal = 10.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceAround,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Period
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .clip(CircleShape)
                            .background(periodColor)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "Period", fontSize = 11.sp, color = colors.textSecondary)
                }

                // Fertile
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .clip(CircleShape)
                            .background(fertileColor.copy(alpha = 0.6f))
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "Fertile", fontSize = 11.sp, color = colors.textSecondary)
                }

                // Ovulation
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .clip(CircleShape)
                            .background(ovulationColor)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "Ovulation", fontSize = 11.sp, color = colors.textSecondary)
                }

                // Predicted
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .border(1.5.dp, periodColor, CircleShape)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "Predicted", fontSize = 11.sp, color = colors.textSecondary)
                }
            }
        }
    }
}
