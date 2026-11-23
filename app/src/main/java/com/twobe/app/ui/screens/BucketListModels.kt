package com.twobe.app.ui.screens

import java.util.UUID

enum class BucketCategory(val label: String, val emoji: String) {
    TRAVEL("Travel", "✈️"),
    FOOD("Food", "🍝"),
    ADVENTURE("Adventure", "🧗"),
    ROMANCE("Romance", "🌹"),
    OTHER("Other", "✨")
}

data class BucketItem(
    val id: String = UUID.randomUUID().toString(),
    val text: String,
    val authorName: String,
    val authorAvatarEmoji: String,
    var isCompleted: Boolean = false,
    val dateAdded: String,
    var dateCompleted: String? = null,
    val category: BucketCategory = BucketCategory.ROMANCE,
    val targetDate: String? = null
)
