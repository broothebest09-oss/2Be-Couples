package com.twobe.app.ui.components

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import java.util.UUID

enum class AffectionSyncAction {
    INVITE,
    ACCEPT_HOLD,
    TICK,
    RELEASE,
    COMPLETE,
    CANCEL
}

enum class PartnerPresenceState {
    IN_APP_ONLINE,
    OUT_OF_APP,
    NOTIFICATIONS_DISABLED
}

data class WebSocketAffectionPacket(
    val packetId: String = UUID.randomUUID().toString(),
    val type: HoldAffectionType,
    val action: AffectionSyncAction,
    val senderName: String,
    val holdProgressSeconds: Float = 0f,
    val timestampMillis: Long = System.currentTimeMillis()
)

data class QueuedAffection(
    val id: String = UUID.randomUUID().toString(),
    val type: HoldAffectionType,
    val senderName: String,
    val timestampMillis: Long = System.currentTimeMillis()
)

object RealtimeAffectionSyncEngine {
    private var lastAttemptTimestamp = 0L
    private const val DEBOUNCE_COOLDOWN_MS = 5000L

    // Queued affection for when partner was not in app
    val queuedAffectionFlow = MutableStateFlow<QueuedAffection?>(null)

    // WebSocket connection state
    val isConnected = MutableStateFlow(true)

    // Lifetime counters
    var lifetimeKisses = MutableStateFlow(184)
    var lifetimeHugs = MutableStateFlow(142)

    fun checkDebounce(): Boolean {
        val now = System.currentTimeMillis()
        if (now - lastAttemptTimestamp < DEBOUNCE_COOLDOWN_MS) {
            return false // Debounced
        }
        lastAttemptTimestamp = now
        return true
    }

    fun queueAffection(type: HoldAffectionType, senderName: String) {
        queuedAffectionFlow.value = QueuedAffection(type = type, senderName = senderName)
    }

    fun clearQueuedAffection() {
        queuedAffectionFlow.value = null
    }

    fun incrementLifetimeCounter(type: HoldAffectionType) {
        if (type == HoldAffectionType.KISS) {
            lifetimeKisses.value += 1
        } else {
            lifetimeHugs.value += 1
        }
    }
}
