package com.twobe.app.ui.screens

import java.util.UUID

enum class UsTabSection(val title: String) {
    MEMORIES("Memories"),
    GRATITUDE("Gratitude"),
    BUCKET_LIST("Bucket List"),
    CYCLE("Cycle")
}

enum class MemoryType {
    PHOTO,
    VIDEO,
    MILESTONE,
    TEXT,
    LOCKED
}

enum class DateRangeFilter(val label: String) {
    THIS_WEEK("This week"),
    THIS_MONTH("This month"),
    THIS_YEAR("This year"),
    ALL_TIME("All time")
}

enum class MemorySortOrder(val label: String) {
    NEWEST_FIRST("Newest first"),
    OLDEST_FIRST("Oldest first")
}

data class MemoryItem(
    val id: String = UUID.randomUUID().toString(),
    val type: MemoryType,
    val title: String? = null,
    val caption: String? = null,
    val mediaUrl: String? = null,
    val videoDuration: String? = null,
    val milestoneEmoji: String? = null,
    val dateText: String,
    val timestampMillis: Long,
    val senderName: String,
    val senderAvatarEmoji: String,
    val originalContext: String? = null,
    var isLocked: Boolean = false,
    var pinRequired: Boolean = false,
    var unlockPin: String = "1234",
    var lockedAtDateText: String? = null,
    var failedPinAttempts: Int = 0,
    var lockedUntilMillis: Long = 0L,
    var isPendingDeletion: Boolean = false,
    var deletionRequestedByMe: Boolean = false
)

data class CoupleStats(
    val kissesCount: Int = 184,
    val hugsCount: Int = 142,
    val memoriesCount: Int = 36,
    val streakDays: Int = 15,
    val daysTogether: Int = 342
)
