package com.twobe.app.ui.screens

import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import java.util.UUID

enum class CyclePhase(
    val title: String,
    val emoji: String,
    val herDescription: String,
    val partnerContext: String,
    val partnerTips: List<String>
) {
    MENSTRUATION(
        title = "Menstruation",
        emoji = "🩸",
        herDescription = "Your body is resetting. Rest, stay warm, and take it slow today.",
        partnerContext = "She might need extra love and patience today. Common symptoms include cramps, fatigue, and tender emotions.",
        partnerTips = listOf(
            "Bring her a warm drink or heating pad without having to ask.",
            "Run her a warm bath or offer a gentle back/foot rub.",
            "Take care of dinner or chores to give her space to rest.",
            "Offer extra cuddles or gentle quiet time together."
        )
    ),
    FOLLICULAR(
        title = "Follicular Phase",
        emoji = "🌱",
        herDescription = "Energy and creativity are rising! Great time for new projects and fun dates.",
        partnerContext = "Her energy, optimism, and motivation are naturally climbing. She may feel adventurous and enthusiastic.",
        partnerTips = listOf(
            "Plan a fun date night, outdoor walk, or exciting activity.",
            "Encourage her new creative ideas and passions.",
            "Try cooking a fresh, vibrant meal together."
        )
    ),
    OVULATION(
        title = "Ovulation",
        emoji = "✨",
        herDescription = "Peak confidence, connection, and glow! High energy and sociability.",
        partnerContext = "Peak warmth, confidence, and mutual closeness. She often feels vibrant, magnetic, and socially engaged.",
        partnerTips = listOf(
            "Shower her with heartfelt compliments.",
            "Plan a romantic evening or special dinner out.",
            "Take beautiful photos of her glowing moments."
        )
    ),
    LUTEAL(
        title = "Luteal Phase",
        emoji = "🌙",
        herDescription = "Winding down. You might crave comfort foods, cozy spaces, and deep relaxation.",
        partnerContext = "Energy begins to mellow. She may experience pre-menstrual sensitivity, cravings, or need grounding comfort.",
        partnerTips = listOf(
            "Stock her favorite comfort snacks and sweet treats.",
            "Be an attentive, validating listener without jumping to fix things.",
            "Create a peaceful, cozy environment at home."
        )
    )
}

enum class MoodOption(val label: String, val emoji: String) {
    HAPPY("Happy", "😊"),
    CALM("Calm", "😌"),
    ANXIOUS("Anxious", "😰"),
    IRRITABLE("Irritable", "😤"),
    SAD("Sad", "🥺"),
    TIRED("Tired", "😴")
}

enum class PainLevel(val label: String, val emoji: String) {
    NONE("None", "✨"),
    MILD("Mild", "🌸"),
    MODERATE("Moderate", "⚡"),
    SEVERE("Severe", "💥")
}

enum class EnergyLevel(val label: String, val emoji: String) {
    LOW("Low", "🪫"),
    MEDIUM("Medium", "🔋"),
    HIGH("High", "⚡")
}

enum class FlowLevel(val label: String, val emoji: String) {
    SPOTTING("Spotting", "💧"),
    LIGHT("Light", "🩸"),
    MEDIUM("Medium", "🩸🩸"),
    HEAVY("Heavy", "🩸🩸🩸")
}

data class SymptomRecord(
    val id: String = UUID.randomUUID().toString(),
    val date: LocalDate,
    val mood: MoodOption? = null,
    val pain: PainLevel? = null,
    val energy: EnergyLevel? = null,
    val flow: FlowLevel? = null,
    val customNotes: String = ""
)

data class CycleSettings(
    val isConfigured: Boolean = true,
    val lastPeriodStartDate: LocalDate = LocalDate.now().minusDays(12),
    val lastPeriodEndDate: LocalDate? = LocalDate.now().minusDays(8),
    val avgCycleLength: Int = 28, // 20-40 days
    val avgPeriodLength: Int = 5,  // 2-10 days
    val notifyRemindLog: Boolean = true,
    val notifyPartnerPhaseChanges: Boolean = true
)

data class CyclePredictions(
    val avgCycleDays: Int = 28,
    val avgPeriodDays: Int = 5,
    val accuracyPercentage: Int = 94,
    val totalCyclesRecorded: Int = 3
)

object CycleCalculator {
    fun calculateCurrentCycleDay(settings: CycleSettings, today: LocalDate = LocalDate.now()): Int {
        val daysDiff = ChronoUnit.DAYS.between(settings.lastPeriodStartDate, today).toInt()
        val cycleDay = (daysDiff % settings.avgCycleLength) + 1
        return if (cycleDay <= 0) 1 else cycleDay
    }

    fun calculatePhaseForDay(settings: CycleSettings, date: LocalDate): CyclePhase {
        val daysDiff = ChronoUnit.DAYS.between(settings.lastPeriodStartDate, date).toInt()
        val cycleDay = ((daysDiff % settings.avgCycleLength) + settings.avgCycleLength) % settings.avgCycleLength + 1

        val periodEndDay = settings.avgPeriodLength
        val ovulationDay = settings.avgCycleLength - 14

        return when {
            cycleDay in 1..periodEndDay -> CyclePhase.MENSTRUATION
            cycleDay in (periodEndDay + 1) until (ovulationDay - 3) -> CyclePhase.FOLLICULAR
            cycleDay in (ovulationDay - 3)..(ovulationDay + 2) -> CyclePhase.OVULATION
            else -> CyclePhase.LUTEAL
        }
    }

    fun isPeriodDay(settings: CycleSettings, date: LocalDate): Boolean {
        val daysDiff = ChronoUnit.DAYS.between(settings.lastPeriodStartDate, date).toInt()
        val cycleDay = ((daysDiff % settings.avgCycleLength) + settings.avgCycleLength) % settings.avgCycleLength + 1
        return cycleDay in 1..settings.avgPeriodLength
    }

    fun isFertileDay(settings: CycleSettings, date: LocalDate): Boolean {
        val daysDiff = ChronoUnit.DAYS.between(settings.lastPeriodStartDate, date).toInt()
        val cycleDay = ((daysDiff % settings.avgCycleLength) + settings.avgCycleLength) % settings.avgCycleLength + 1
        val ovulationDay = settings.avgCycleLength - 14
        return cycleDay in (ovulationDay - 5)..(ovulationDay + 1)
    }

    fun isOvulationDay(settings: CycleSettings, date: LocalDate): Boolean {
        val daysDiff = ChronoUnit.DAYS.between(settings.lastPeriodStartDate, date).toInt()
        val cycleDay = ((daysDiff % settings.avgCycleLength) + settings.avgCycleLength) % settings.avgCycleLength + 1
        val ovulationDay = settings.avgCycleLength - 14
        return cycleDay == ovulationDay
    }

    fun isPredictedNextPeriodDay(settings: CycleSettings, date: LocalDate, today: LocalDate = LocalDate.now()): Boolean {
        val nextPeriodStart = calculateNextPeriodStartDate(settings, today)
        val daysDiff = ChronoUnit.DAYS.between(nextPeriodStart, date)
        return daysDiff in 0 until settings.avgPeriodLength
    }

    fun calculateNextPeriodStartDate(settings: CycleSettings, today: LocalDate = LocalDate.now()): LocalDate {
        var start = settings.lastPeriodStartDate
        while (start.isBefore(today) || start.isEqual(today)) {
            start = start.plusDays(settings.avgCycleLength.toLong())
        }
        return start
    }

    fun calculateNextPeriodDays(settings: CycleSettings, today: LocalDate = LocalDate.now()): Int {
        val nextStart = calculateNextPeriodStartDate(settings, today)
        return ChronoUnit.DAYS.between(today, nextStart).toInt()
    }

    fun calculateFertileWindowDates(settings: CycleSettings, today: LocalDate = LocalDate.now()): String {
        val formatter = DateTimeFormatter.ofPattern("MMM d")
        val currentOrNextPeriod = if (today.isBefore(settings.lastPeriodStartDate)) {
            settings.lastPeriodStartDate
        } else {
            val daysDiff = ChronoUnit.DAYS.between(settings.lastPeriodStartDate, today)
            val cyclesPassed = daysDiff / settings.avgCycleLength
            settings.lastPeriodStartDate.plusDays(cyclesPassed * settings.avgCycleLength)
        }

        val ovulationDay = settings.avgCycleLength - 14
        val fertileStart = currentOrNextPeriod.plusDays((ovulationDay - 5).toLong())
        val fertileEnd = currentOrNextPeriod.plusDays((ovulationDay + 1).toLong())

        return "${fertileStart.format(formatter)} – ${fertileEnd.format(formatter)}"
    }
}
