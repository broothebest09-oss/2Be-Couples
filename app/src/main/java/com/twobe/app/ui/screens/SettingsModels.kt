package com.twobe.app.ui.screens

import java.time.LocalTime
import java.time.format.DateTimeFormatter

enum class AppTextScale(val label: String, val scaleFactor: Float) {
    SMALL("Small", 0.9f),
    MEDIUM("Medium", 1.0f),
    LARGE("Large", 1.15f)
}

data class UserAccountProfile(
    val displayName: String = "Alex",
    val nickname: String = "Bunny 🐰",
    val avatarId: String = "avatar_1",
    val avatarEmoji: String = "🐰"
)

data class PartnerAccountProfile(
    val displayName: String = "Sarah",
    val nickname: String = "My Sunshine ☀️",
    val avatarEmoji: String = "🌸",
    val pairedDateText: String = "October 14, 2026",
    val daysTogether: Int = 41
)

data class NotificationPreferences(
    val messagesEnabled: Boolean = true,
    val kissesAndHugsEnabled: Boolean = true,
    val lockedLettersEnabled: Boolean = true,
    val dailyPromptEnabled: Boolean = true,
    val dailyPromptTime: LocalTime = LocalTime.of(20, 0), // 8:00 PM
    val quietHoursEnabled: Boolean = false,
    val quietHoursStart: LocalTime = LocalTime.of(22, 0), // 10:00 PM
    val quietHoursEnd: LocalTime = LocalTime.of(8, 0)     // 8:00 AM
)

data class CloudBackupInfo(
    val isEnabled: Boolean = true,
    val lastBackupDateText: String = "Today at 3:14 PM",
    val backupAccount: String = "Google Drive (alex***@gmail.com)"
)

data class StorageUsageInfo(
    val localUsageMB: Float = 142.8f,
    val cacheMB: Float = 36.4f,
    val maxAvailableGB: Float = 128.0f
)
