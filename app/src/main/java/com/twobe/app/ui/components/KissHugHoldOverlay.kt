package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.waitForUpOrCancellation
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.theme.DeepBerry
import com.twobe.app.ui.theme.SoftRose
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

enum class HoldAffectionType {
    KISS,
    HUG
}

@Composable
fun KissHugHoldOverlay(
    type: HoldAffectionType,
    partnerName: String = "Sarah",
    userName: String = "Alex",
    isPartnerInApp: Boolean = true,
    isLowBattery: Boolean = false,
    partnerHasNotifications: Boolean = true,
    onSuccess: (HoldAffectionType) -> Unit,
    onDismiss: () -> Unit
) {
    val view = LocalView.current
    val scope = rememberCoroutineScope()

    // Holding & Timer state
    var isHolding by remember { mutableStateOf(false) }
    var holdDurationSeconds by remember { mutableFloatStateOf(0f) }
    var holdJob by remember { mutableStateOf<Job?>(null) }
    var timeoutJob by remember { mutableStateOf<Job?>(null) }

    // Edge case flags
    var isSuccess by remember { mutableStateOf(false) }
    var feedbackMessage by remember { mutableStateOf<String?>(null) }
    var partnerHoldingState by remember { mutableStateOf(false) }
    var isNetworkDisconnected by remember { mutableStateOf(false) }
    var hasEarlyReleaseOccurred by remember { mutableStateOf(false) }
    var isTimeoutOccurred by remember { mutableStateOf(false) }

    // Simulated WebSocket channel state
    var wsConnectionStatus by remember { mutableStateOf("Connected via WebSocket") }

    val emoji = if (type == HoldAffectionType.KISS) "💋" else "🤗"
    val actionName = if (type == HoldAffectionType.KISS) "kiss" else "hug"

    // Infinite breathing pulse for center icon
    val pulseTransition = rememberInfiniteTransition(label = "IconPulseTransition")
    val idleIconScale by pulseTransition.animateFloat(
        initialValue = 0.96f,
        targetValue = 1.06f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "IdleScale"
    )

    // Animated glow spread when holding
    val animatedGlowRadius by animateDpAsState(
        targetValue = if (isHolding) (120 + (holdDurationSeconds * 45)).dp else 120.dp,
        animationSpec = spring(stiffness = Spring.StiffnessMediumLow),
        label = "GlowRadius"
    )

    // Partner In-App simulated response & 30s timeout
    LaunchedEffect(Unit) {
        // Check debounce (5 second cooldown)
        if (!RealtimeAffectionSyncEngine.checkDebounce()) {
            feedbackMessage = "Please wait 5s between sending kisses/hugs"
            delay(1800L)
            onDismiss()
            return@LaunchedEffect
        }

        if (!isPartnerInApp) {
            // Partner is not in app: queue the kiss/hug
            RealtimeAffectionSyncEngine.queueAffection(type, userName)
            if (partnerHasNotifications) {
                feedbackMessage = "Push sent: $userName is sending you a $actionName! 💋 (Queued)"
            } else {
                feedbackMessage = "Queued in private sanctuary (Notifications silent)"
            }
        }

        // Start 30-second timeout
        timeoutJob = scope.launch {
            delay(30000L)
            if (!isSuccess) {
                isTimeoutOccurred = true
                feedbackMessage = "Partner didn't respond, try again later"
                delay(2200L)
                onDismiss()
            }
        }
    }

    fun startHolding() {
        if (isSuccess || isTimeoutOccurred) return
        isHolding = true
        feedbackMessage = null
        hasEarlyReleaseOccurred = false
        holdDurationSeconds = 0f

        // When partner is in-app, partner automatically joins simultaneous holding!
        if (isPartnerInApp) {
            partnerHoldingState = true
        }

        holdJob?.cancel()
        holdJob = scope.launch {
            val stepMs = 50L
            var accumulated = 0L

            while (accumulated < 3000L) {
                delay(stepMs)
                accumulated += stepMs
                holdDurationSeconds = (accumulated / 1000f)

                // Haptic feedback increases with time (light → medium → strong)
                if (!isLowBattery) {
                    when {
                        accumulated < 1000L && accumulated % 250L == 0L -> {
                            // Light haptic
                            view.performHapticFeedback(HapticFeedbackConstants.CLOCK_TICK)
                        }
                        accumulated in 1000L..2000L && accumulated % 150L == 0L -> {
                            // Medium haptic
                            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                        }
                        accumulated > 2000L && accumulated % 100L == 0L -> {
                            // Strong haptic
                            view.performHapticFeedback(HapticFeedbackConstants.VIRTUAL_KEY)
                        }
                    }
                } else {
                    // Low battery power-saving haptic
                    if (accumulated % 400L == 0L) {
                        view.performHapticFeedback(HapticFeedbackConstants.CLOCK_TICK)
                    }
                }
            }

            // Exactly at 3.0 seconds: SUCCESS!
            isSuccess = true
            timeoutJob?.cancel()
            RealtimeAffectionSyncEngine.incrementLifetimeCounter(type)

            // Strong celebration haptic
            view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)

            // Auto-close after 2 seconds
            delay(2000L)
            onSuccess(type)
        }
    }

    fun releaseHolding() {
        if (!isSuccess) {
            holdJob?.cancel()
            partnerHoldingState = false
            hasEarlyReleaseOccurred = true

            if (holdDurationSeconds > 0.2f && holdDurationSeconds < 3.0f) {
                feedbackMessage = "Almost! Hold longer next time"
            }
            isHolding = false
            holdDurationSeconds = 0f

            scope.launch {
                delay(1600L)
                if (!isSuccess) {
                    onDismiss()
                }
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.88f))
            .clickable(enabled = isSuccess || isTimeoutOccurred) { onDismiss() }
    ) {
        // Top Bar: Dismiss & Connection Status
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .padding(horizontal = 20.dp, vertical = 14.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(CircleShape)
                        .background(if (isNetworkDisconnected) Color(0xFFEF4444) else Color(0xFF22C55E))
                )
                Text(
                    text = if (isNetworkDisconnected) "Reconnecting..." else wsConnectionStatus,
                    fontSize = 11.sp,
                    color = Color.White.copy(alpha = 0.7f)
                )
            }

            IconButton(
                onClick = onDismiss,
                modifier = Modifier.size(36.dp)
            ) {
                Text(text = "✕", fontSize = 18.sp, color = Color.White.copy(alpha = 0.8f))
            }
        }

        // Low Battery Badge if applicable
        if (isLowBattery) {
            Box(
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .padding(top = 64.dp)
                    .clip(RoundedCornerShape(999.dp))
                    .background(Color(0xFFEAB308).copy(alpha = 0.2f))
                    .border(1.dp, Color(0xFFEAB308).copy(alpha = 0.4f), RoundedCornerShape(999.dp))
                    .padding(horizontal = 12.dp, vertical = 4.dp)
            ) {
                Text(
                    text = "🔋 Low battery: power-saving haptics",
                    fontSize = 11.sp,
                    color = Color(0xFFFEF08A)
                )
            }
        }

        // Partner in-app invitation banner
        if (isPartnerInApp && !isSuccess && !isHolding) {
            Box(
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .padding(top = 70.dp, start = 24.dp, end = 24.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(Color(0xFF1E1417))
                    .border(1.dp, SoftRose.copy(alpha = 0.3f), RoundedCornerShape(16.dp))
                    .padding(horizontal = 14.dp, vertical = 8.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(text = "💌", fontSize = 16.sp)
                    Text(
                        text = "$partnerName is in the app! Both hold to complete the $actionName",
                        fontSize = 12.sp,
                        color = Color.White
                    )
                }
            }
        }

        // Center Content: Pulsing Icon, Instructions, & Success
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Main Animated Icon in Center
            val dynamicScale = when {
                isSuccess -> 1.35f
                isHolding -> 1f + (holdDurationSeconds / 5f)
                else -> idleIconScale
            }

            Box(
                modifier = Modifier
                    .size(170.dp)
                    .scale(dynamicScale)
                    .shadow(
                        elevation = if (isHolding) (16 + holdDurationSeconds * 14).dp else 10.dp,
                        shape = CircleShape,
                        spotColor = if (type == HoldAffectionType.KISS) SoftRose else Color(0xFFC084FC)
                    )
                    .clip(CircleShape)
                    .background(
                        Brush.radialGradient(
                            listOf(
                                if (type == HoldAffectionType.KISS) Color(0xFFFF9EB5) else Color(0xFFE9D5FF),
                                if (type == HoldAffectionType.KISS) Color(0xFFE85D88) else Color(0xFF7E22CE)
                            )
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(text = emoji, fontSize = 84.sp)
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Instruction Text
            Text(
                text = when {
                    isSuccess -> if (type == HoldAffectionType.KISS) "Kiss sent! 💋" else "Hug sent! 🤗"
                    partnerHoldingState && isHolding -> "Both holding together! 💕"
                    isHolding -> "Keep holding..."
                    else -> "Hold to send $actionName"
                },
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                textAlign = TextAlign.Center
            )

            Text(
                text = when {
                    isSuccess -> "$partnerName feels your love right now"
                    partnerHoldingState && isHolding -> "WebSocket synced • Releasing early cancels sync"
                    !isPartnerInApp -> "Queued for $partnerName when they open 2Be"
                    else -> "Hold the button for 3.0 seconds to deliver"
                },
                fontSize = 13.sp,
                color = Color.White.copy(alpha = 0.8f),
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(top = 6.dp)
            )

            // Lifetime Counter
            val currentCount = if (type == HoldAffectionType.KISS) {
                RealtimeAffectionSyncEngine.lifetimeKisses.collectAsState().value
            } else {
                RealtimeAffectionSyncEngine.lifetimeHugs.collectAsState().value
            }
            Text(
                text = "Lifetime ${if (type == HoldAffectionType.KISS) "kisses" else "hugs"}: $currentCount",
                fontSize = 12.sp,
                color = SoftRose,
                modifier = Modifier.padding(top = 8.dp)
            )
        }

        // Celebration Confetti on Success (At 3.0s)
        if (isSuccess) {
            CelebrationEffects()
        }

        // ==========================================
        // BOTTOM SECTION: TIMER COUNTER & 120px BUTTON
        // ==========================================
        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 44.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Feedback message on early release or error
            if (feedbackMessage != null && !isSuccess) {
                Text(
                    text = feedbackMessage!!,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFFFF8DA1),
                    modifier = Modifier.padding(bottom = 12.dp)
                )
            }

            // Counter: 0.0s initially, counting up smoothly to 3.0s
            Text(
                text = if (isSuccess) {
                    "3.0s ✓ Complete"
                } else {
                    String.format("%.1fs", holdDurationSeconds)
                },
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = if (isHolding) SoftRose else Color.White,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            // Holding button container with expanding glow ring
            Box(
                modifier = Modifier.size(240.dp),
                contentAlignment = Alignment.Center
            ) {
                // Expanding visual glow effect (gradient spreads from button)
                if (isHolding) {
                    Box(
                        modifier = Modifier
                            .size(animatedGlowRadius)
                            .clip(CircleShape)
                            .background(
                                Brush.radialGradient(
                                    listOf(
                                        if (type == HoldAffectionType.KISS) Color(0xFFFF8DA1).copy(alpha = 0.5f) else Color(0xFFC084FC).copy(alpha = 0.5f),
                                        Color.Transparent
                                    )
                                )
                            )
                    )
                }

                // EXACT 120px DIAMETER CIRCULAR BUTTON TO HOLD
                Box(
                    modifier = Modifier
                        .size(120.dp) // Large circular button at bottom (120px diameter)
                        .scale(if (isHolding) 0.94f else 1f)
                        .shadow(
                            elevation = if (isHolding) 24.dp else 12.dp,
                            shape = CircleShape,
                            spotColor = if (type == HoldAffectionType.KISS) SoftRose else Color(0xFFC084FC)
                        )
                        .clip(CircleShape)
                        .background(
                            Brush.linearGradient(
                                if (type == HoldAffectionType.KISS) {
                                    listOf(Color(0xFFFF9EB5), Color(0xFFE85D88))
                                } else {
                                    listOf(Color(0xFFD8B4FE), Color(0xFF9333EA))
                                }
                            )
                        )
                        .pointerInput(isSuccess) {
                            if (isSuccess) return@pointerInput
                            while (true) {
                                awaitPointerEventScope {
                                    awaitFirstDown(requireUnconsumed = false)
                                    startHolding()
                                    waitForUpOrCancellation()
                                    releaseHolding()
                                }
                            }
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(text = emoji, fontSize = 44.sp)
                        Text(
                            text = if (isHolding) "HOLDING" else "HOLD",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }
            }
        }
    }
}
