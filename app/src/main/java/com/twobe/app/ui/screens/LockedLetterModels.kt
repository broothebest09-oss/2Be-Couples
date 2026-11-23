package com.twobe.app.ui.screens

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import java.util.UUID

enum class UnlockConditionType(val label: String, val emoji: String) {
    DATE_TIME("Specific date & time", "📅"),
    AFTER_ACTION("After partner completes actions", "🎯"),
    LOCATION("When at special location", "📍")
}

enum class LetterActionType(val label: String, val singular: String, val emoji: String) {
    KISSES("Kisses", "kiss", "💋"),
    HUGS("Hugs", "hug", "🤗"),
    SNAPS("Snaps", "snap", "📸"),
    MESSAGES("Messages", "message", "💬")
}

enum class LocationRadius(val label: String, val meters: Int) {
    RADIUS_100M("100 meters (Exact spot)", 100),
    RADIUS_500M("500 meters (Neighborhood)", 500),
    RADIUS_1KM("1 kilometer (City area)", 1000)
}

data class LetterMediaItem(
    val id: String = UUID.randomUUID().toString(),
    val url: String,
    val isVideo: Boolean = false,
    val durationText: String? = null
)

data class LockedLetterPayload(
    val id: String = UUID.randomUUID().toString(),
    val senderName: String = "You",
    val letterContent: String = "",
    val mediaItems: List<LetterMediaItem> = emptyList(),
    val conditionType: UnlockConditionType = UnlockConditionType.DATE_TIME,
    
    // Condition 1: Date/time
    val unlockDateTime: LocalDateTime = LocalDateTime.now().plusDays(2),
    
    // Condition 2: Action count
    val targetActionType: LetterActionType = LetterActionType.KISSES,
    val targetActionCount: Int = 10,
    var currentActionCount: Int = 3,
    
    // Condition 3: Location
    val locationName: String = "Paris Airport",
    val locationRadius: LocationRadius = LocationRadius.RADIUS_500M,
    var currentDistanceMeters: Int = 1200,
    var locationPermissionDenied: Boolean = false,
    var isManualUnlockApproved: Boolean = false,
    
    // Toggles & Status
    val showCountdownToPartner: Boolean = true,
    var isUnlocked: Boolean = false,
    var openedAtDateText: String? = null,
    val createdAtText: String = "Today, 10:24 AM"
) {
    fun getConditionSummary(): String {
        return when (conditionType) {
            UnlockConditionType.DATE_TIME -> {
                val formatter = DateTimeFormatter.ofPattern("MMM d, yyyy 'at' h:mm a")
                "Opens on ${unlockDateTime.format(formatter)}"
            }
            UnlockConditionType.AFTER_ACTION -> {
                "Opens after you send $targetActionCount ${targetActionType.label.lowercase()}"
            }
            UnlockConditionType.LOCATION -> {
                "Opens when you're at $locationName"
            }
        }
    }

    fun isConditionMet(now: LocalDateTime = LocalDateTime.now()): Boolean {
        if (isUnlocked || isManualUnlockApproved) return true
        return when (conditionType) {
            UnlockConditionType.DATE_TIME -> now.isAfter(unlockDateTime) || now.isEqual(unlockDateTime)
            UnlockConditionType.AFTER_ACTION -> currentActionCount >= targetActionCount
            UnlockConditionType.LOCATION -> currentDistanceMeters <= locationRadius.meters
        }
    }

    fun getRemainingStatusText(now: LocalDateTime = LocalDateTime.now()): String {
        return when (conditionType) {
            UnlockConditionType.DATE_TIME -> {
                val days = ChronoUnit.DAYS.between(now, unlockDateTime)
                val hours = ChronoUnit.HOURS.between(now, unlockDateTime) % 24
                val minutes = ChronoUnit.MINUTES.between(now, unlockDateTime) % 60
                when {
                    days > 0 -> "Opens in $days days, $hours hrs"
                    hours > 0 -> "Opens in $hours hrs, $minutes mins"
                    minutes > 0 -> "Opens in $minutes mins"
                    else -> "Ready to open!"
                }
            }
            UnlockConditionType.AFTER_ACTION -> {
                val remaining = (targetActionCount - currentActionCount).coerceAtLeast(0)
                "Send $remaining more ${targetActionType.label.lowercase()} to unlock ($currentActionCount/$targetActionCount completed)"
            }
            UnlockConditionType.LOCATION -> {
                if (locationPermissionDenied) {
                    "Location permission denied. Request manual unlock from sender."
                } else {
                    "Get closer to $locationName to unlock (Currently ${currentDistanceMeters}m away, need ≤${locationRadius.meters}m)"
                }
            }
        }
    }
}
