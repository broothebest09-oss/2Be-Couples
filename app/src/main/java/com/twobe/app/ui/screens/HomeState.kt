package com.twobe.app.ui.screens

data class UpcomingEvent(
    val id: String,
    val title: String,
    val subtitle: String,
    val countdownDays: Int,
    val iconEmoji: String,
    val isLockedLetter: Boolean = false,
    val dateText: String
)

enum class PartnerPresence(val label: String, val emoji: String) {
    ONLINE("Online", "🟢"),
    TYPING("Typing...", "💬"),
    SLEEPING("Sleeping 💤", "🌙"),
    LAST_SEEN("Last seen 2h ago", "⏳")
}

data class DailyQuestion(
    val id: String,
    val question: String,
    var savedAnswer: String? = null,
    var isSharedWithPartner: Boolean = true
)

enum class HomeLoadingState {
    LOADING,
    SUCCESS,
    EMPTY,
    ERROR,
    OFFLINE
}
