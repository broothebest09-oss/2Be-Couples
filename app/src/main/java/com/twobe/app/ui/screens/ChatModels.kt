package com.twobe.app.ui.screens

import java.util.UUID

enum class MessageType {
    TEXT,
    PHOTO,
    VIDEO,
    FILE,
    SNAP,
    KISS,
    HUG,
    LOCKED_LETTER,
    SCRATCH_OFF
}

enum class MessageDeliveryStatus {
    SENDING,
    SENT,
    FAILED
}

data class TwoBeMessage(
    val id: String = UUID.randomUUID().toString(),
    val senderIsMe: Boolean,
    val type: MessageType,
    val text: String = "",
    val mediaUrl: String? = null,
    val fileName: String? = null,
    val fileSize: String? = null,
    val durationText: String? = null,
    val lockedCondition: String? = null,
    val lockedLetterPayload: LockedLetterPayload? = null,
    var isUnlocked: Boolean = false,
    val scratchSecretText: String? = null,
    var isScratched: Boolean = false,
    val timestamp: String,
    val dateGroup: String, // "Today", "Yesterday", "Nov 20"
    var status: MessageDeliveryStatus = MessageDeliveryStatus.SENT,
    var reactionEmoji: String? = null,
    val replyToMessageText: String? = null
)
