package com.twobe.app.ui.screens

import androidx.compose.ui.graphics.Color
import java.util.UUID

data class GratitudeNote(
    val id: String = UUID.randomUUID().toString(),
    val text: String,
    val authorName: String,
    val authorAvatarEmoji: String,
    val dateText: String,
    val timestampMillis: Long,
    val paperColorHex: Long = 0xFFFFF3CD // pastel notes
)

val PASTEL_NOTE_COLORS = listOf(
    0xFFFFE3E8, // pastel rose
    0xFFFFF3CD, // pastel cream / yellow
    0xFFE3F2FD, // pastel blue
    0xFFE8F5E9, // pastel mint
    0xFFF3E5F5  // pastel lavender
)
