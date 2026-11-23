package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.twobe.app.ui.screens.MemoryItem
import com.twobe.app.ui.theme.LocalTwoBeColors
import com.twobe.app.ui.theme.LocalTwoBeSpacing
import kotlinx.coroutines.delay

private val WEAK_PINS = setOf("1234", "0000", "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999", "1212", "4321")

/**
 * 1. Lock a Memory Modal:
 * Sets mutual 4-digit PIN with confirmation & weak PIN check
 */
@Composable
fun LockMemoryDialog(
    memory: MemoryItem,
    partnerName: String = "Sarah",
    onDismiss: () -> Unit,
    onLockConfirmed: (String) -> Unit
) {
    val colors = LocalTwoBeColors.current
    val spacing = LocalTwoBeSpacing.current
    val view = LocalView.current

    var step by remember { mutableStateOf(1) } // 1: Enter PIN, 2: Confirm PIN
    var firstPin by remember { mutableStateOf("") }
    var confirmPin by remember { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var isLockingAnimation by remember { mutableStateOf(false) }

    val currentInput = if (step == 1) firstPin else confirmPin
    val isWeakPin = step == 1 && firstPin.length == 4 && WEAK_PINS.contains(firstPin)

    fun onDigitPress(digit: String) {
        if (currentInput.length < 4) {
            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
            errorMessage = null
            if (step == 1) {
                firstPin += digit
            } else {
                confirmPin += digit
            }
        }
    }

    fun onBackspace() {
        if (currentInput.isNotEmpty()) {
            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
            if (step == 1) {
                firstPin = firstPin.dropLast(1)
            } else {
                confirmPin = confirmPin.dropLast(1)
            }
        }
    }

    // Auto advance when 4 digits entered
    LaunchedEffect(firstPin) {
        if (firstPin.length == 4 && step == 1) {
            delay(250)
            step = 2
        }
    }

    LaunchedEffect(confirmPin) {
        if (confirmPin.length == 4 && step == 2) {
            delay(200)
            if (confirmPin == firstPin) {
                // Success: animate lock closing
                isLockingAnimation = true
                view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                delay(700)
                onLockConfirmed(firstPin)
            } else {
                view.performHapticFeedback(HapticFeedbackConstants.REJECT)
                errorMessage = "PINs don't match, try again"
                confirmPin = ""
            }
        }
    }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .clip(RoundedCornerShape(28.dp)),
            color = colors.background,
            tonalElevation = 8.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(spacing.large),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Header & Close
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = if (step == 1) "Lock Memory" else "Confirm PIN",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )
                    IconButton(onClick = onDismiss, modifier = Modifier.size(32.dp)) {
                        Text(text = "✕", fontSize = 16.sp, color = colors.textSecondary)
                    }
                }

                // Animated Lock Graphic
                val lockScale by animateFloatAsState(
                    targetValue = if (isLockingAnimation) 1.25f else 1.0f,
                    animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy)
                )

                Box(
                    modifier = Modifier
                        .size(76.dp)
                        .scale(lockScale)
                        .clip(CircleShape)
                        .background(
                            Brush.radialGradient(
                                listOf(colors.accent.copy(alpha = 0.25f), Color.Transparent)
                            )
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (isLockingAnimation || step == 2) "🔒" else "🔓",
                        fontSize = 38.sp
                    )
                }

                Text(
                    text = "Lock this memory? Both of you will need a PIN to view it.",
                    fontSize = 13.sp,
                    color = colors.textSecondary,
                    textAlign = TextAlign.Center
                )

                Text(
                    text = if (step == 1) "Create mutual 4-digit PIN" else "Re-enter PIN to confirm",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.textPrimary
                )

                // 4 PIN Dot Indicators
                Row(
                    horizontalArrangement = Arrangement.spacedBy(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    repeat(4) { index ->
                        val isFilled = index < currentInput.length
                        Box(
                            modifier = Modifier
                                .size(16.dp)
                                .clip(CircleShape)
                                .background(
                                    if (isFilled) colors.primary else colors.surfaceVariant
                                )
                                .border(
                                    1.dp,
                                    if (isFilled) colors.primary else colors.accent.copy(alpha = 0.4f),
                                    CircleShape
                                )
                        )
                    }
                }

                // Weak PIN Warning (Edge Case)
                if (isWeakPin) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .background(Color(0xFFFFF3CD))
                            .padding(horizontal = 10.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = "⚠️", fontSize = 12.sp)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "This PIN is easy to guess",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF856404)
                        )
                    }
                }

                // Error Message if Mismatch
                if (errorMessage != null) {
                    Text(
                        text = errorMessage!!,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFD64545)
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))

                // Custom Numeric Keypad
                MutualNumericKeypad(
                    onDigitClick = ::onDigitPress,
                    onBackspace = ::onBackspace,
                    onClear = {
                        if (step == 1) firstPin = "" else confirmPin = ""
                    }
                )
            }
        }
    }
}

/**
 * 2. Unlock a Memory Modal:
 * 4-digit PIN check with attempt limits (3 attempts -> 5 min lockout)
 */
@Composable
fun UnlockMemoryDialog(
    memory: MemoryItem,
    partnerName: String = "Sarah",
    onDismiss: () -> Unit,
    onUnlocked: () -> Unit,
    onChangeOrRemoveLockRequested: () -> Unit = {}
) {
    val colors = LocalTwoBeColors.current
    val spacing = LocalTwoBeSpacing.current
    val view = LocalView.current

    var enteredPin by remember { mutableStateOf("") }
    var attemptsLeft by remember { mutableStateOf(3 - memory.failedPinAttempts) }
    var isLockedOut by remember { mutableStateOf(System.currentTimeMillis() < memory.lockedUntilMillis) }
    var lockoutSecondsLeft by remember {
        mutableStateOf(
            if (isLockedOut) ((memory.lockedUntilMillis - System.currentTimeMillis()) / 1000).toInt() else 0
        )
    }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var isUnlockingAnimation by remember { mutableStateOf(false) }

    // Lockout timer ticker
    LaunchedEffect(isLockedOut) {
        while (isLockedOut && lockoutSecondsLeft > 0) {
            delay(1000)
            lockoutSecondsLeft = ((memory.lockedUntilMillis - System.currentTimeMillis()) / 1000).toInt()
            if (lockoutSecondsLeft <= 0) {
                isLockedOut = false
                memory.failedPinAttempts = 0
                attemptsLeft = 3
            }
        }
    }

    fun onDigitPress(digit: String) {
        if (isLockedOut || enteredPin.length >= 4) return
        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
        errorMessage = null
        enteredPin += digit
    }

    fun onBackspace() {
        if (!isLockedOut && enteredPin.isNotEmpty()) {
            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
            enteredPin = enteredPin.dropLast(1)
        }
    }

    LaunchedEffect(enteredPin) {
        if (enteredPin.length == 4) {
            delay(200)
            if (enteredPin == memory.unlockPin) {
                // Correct PIN!
                view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                isUnlockingAnimation = true
                memory.failedPinAttempts = 0
                delay(600)
                onUnlocked()
            } else {
                // Incorrect PIN!
                view.performHapticFeedback(HapticFeedbackConstants.REJECT)
                memory.failedPinAttempts++
                val remaining = (3 - memory.failedPinAttempts).coerceAtLeast(0)
                attemptsLeft = remaining

                if (remaining == 0) {
                    memory.lockedUntilMillis = System.currentTimeMillis() + 5 * 60 * 1000L
                    isLockedOut = true
                    lockoutSecondsLeft = 300
                    errorMessage = "Too many attempts. Try again in 5 minutes."
                } else {
                    errorMessage = "Wrong PIN, try again ($remaining attempts left)"
                }
                enteredPin = ""
            }
        }
    }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .clip(RoundedCornerShape(28.dp)),
            color = colors.background,
            tonalElevation = 8.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(spacing.large),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Unlock Memory",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )
                    IconButton(onClick = onDismiss, modifier = Modifier.size(32.dp)) {
                        Text(text = "✕", fontSize = 16.sp, color = colors.textSecondary)
                    }
                }

                // Unlock Animation
                Box(
                    modifier = Modifier
                        .size(72.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.radialGradient(
                                listOf(
                                    if (isUnlockingAnimation) Color(0xFF7FB77E).copy(alpha = 0.25f)
                                    else colors.accent.copy(alpha = 0.2f),
                                    Color.Transparent
                                )
                            )
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (isUnlockingAnimation) "🔓" else "🔒",
                        fontSize = 36.sp
                    )
                }

                Text(
                    text = "This memory is locked. Enter the 4-digit PIN.",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.textPrimary,
                    textAlign = TextAlign.Center
                )

                // Lockout Banner or PIN Dots
                if (isLockedOut) {
                    val minutes = lockoutSecondsLeft / 60
                    val seconds = lockoutSecondsLeft % 60
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(14.dp))
                            .background(Color(0xFFFFEBEB))
                            .padding(12.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "⏳ Too many attempts",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFFD64545)
                        )
                        Text(
                            text = "Try again in ${minutes}m ${seconds}s",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFFD64545),
                            modifier = Modifier.padding(top = 2.dp)
                        )
                    }
                } else {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        repeat(4) { index ->
                            val isFilled = index < enteredPin.length
                            Box(
                                modifier = Modifier
                                    .size(16.dp)
                                    .clip(CircleShape)
                                    .background(
                                        if (isFilled) colors.primary else colors.surfaceVariant
                                    )
                                    .border(
                                        1.dp,
                                        if (isFilled) colors.primary else colors.accent.copy(alpha = 0.4f),
                                        CircleShape
                                    )
                            )
                        }
                    }
                }

                if (errorMessage != null && !isLockedOut) {
                    Text(
                        text = errorMessage!!,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFD64545)
                    )
                }

                // Numeric Keypad
                MutualNumericKeypad(
                    enabled = !isLockedOut,
                    onDigitClick = ::onDigitPress,
                    onBackspace = ::onBackspace,
                    onClear = { enteredPin = "" }
                )

                // Forgot PIN / Change Lock Links
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Forgot PIN? (Ask $partnerName)",
                        fontSize = 11.sp,
                        color = colors.textSecondary,
                        modifier = Modifier.clickable {
                            errorMessage = "No recovery possible. Ask $partnerName or both agree to remove lock."
                        }
                    )

                    Text(
                        text = "Change / Remove ⚙️",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.accent,
                        modifier = Modifier.clickable {
                            onDismiss()
                            onChangeOrRemoveLockRequested()
                        }
                    )
                }
            }
        }
    }
}

/**
 * 3. Change or Remove PIN Dialog:
 * Mutual agreement flow:
 * - Change PIN: enter current PIN + enter & confirm new PIN
 * - Remove Lock: both confirm to permanently unlock
 */
@Composable
fun ChangeOrRemovePinDialog(
    memory: MemoryItem,
    partnerName: String = "Sarah",
    onDismiss: () -> Unit,
    onPinChanged: (newPin: String) -> Unit,
    onLockRemoved: () -> Unit
) {
    val colors = LocalTwoBeColors.current
    val spacing = LocalTwoBeSpacing.current
    val view = LocalView.current

    var selectedTab by remember { mutableStateOf(0) } // 0: Change PIN, 1: Remove Lock

    // Change PIN sub-steps: 1: Verify current, 2: New PIN, 3: Confirm new
    var changeStep by remember { mutableStateOf(1) }
    var currentPinInput by remember { mutableStateOf("") }
    var newPinInput by remember { mutableStateOf("") }
    var confirmNewPinInput by remember { mutableStateOf("") }
    var errorMsg by remember { mutableStateOf<String?>(null) }

    // Remove lock mutual confirm toggles
    var youConfirmedRemove by remember { mutableStateOf(false) }
    var partnerConfirmedRemove by remember { mutableStateOf(false) }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .clip(RoundedCornerShape(28.dp)),
            color = colors.background,
            tonalElevation = 8.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(spacing.large),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Top Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Mutual Lock Settings",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )
                    IconButton(onClick = onDismiss, modifier = Modifier.size(32.dp)) {
                        Text(text = "✕", fontSize = 16.sp, color = colors.textSecondary)
                    }
                }

                // Tab Switcher: Change PIN vs Remove Lock
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(colors.surfaceVariant)
                        .padding(4.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (selectedTab == 0) colors.primary else Color.Transparent)
                            .clickable { selectedTab = 0 }
                            .padding(vertical = 8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "Change PIN",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (selectedTab == 0) Color.White else colors.textSecondary
                        )
                    }

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (selectedTab == 1) colors.primary else Color.Transparent)
                            .clickable { selectedTab = 1 }
                            .padding(vertical = 8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "Remove Lock",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (selectedTab == 1) Color.White else colors.textSecondary
                        )
                    }
                }

                if (selectedTab == 0) {
                    // TAB 0: CHANGE PIN
                    val currentVal = when (changeStep) {
                        1 -> currentPinInput
                        2 -> newPinInput
                        else -> confirmNewPinInput
                    }

                    val stepTitle = when (changeStep) {
                        1 -> "Step 1: Enter Current PIN"
                        2 -> "Step 2: Enter New PIN"
                        else -> "Step 3: Confirm New PIN"
                    }

                    Text(
                        text = stepTitle,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )

                    // 4 PIN Dots
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        repeat(4) { index ->
                            val isFilled = index < currentVal.length
                            Box(
                                modifier = Modifier
                                    .size(16.dp)
                                    .clip(CircleShape)
                                    .background(
                                        if (isFilled) colors.primary else colors.surfaceVariant
                                    )
                            )
                        }
                    }

                    if (errorMsg != null) {
                        Text(
                            text = errorMsg!!,
                            fontSize = 11.sp,
                            color = Color(0xFFD64545),
                            fontWeight = FontWeight.Bold
                        )
                    }

                    // Keypad handling for Change PIN
                    MutualNumericKeypad(
                        onDigitClick = { digit ->
                            errorMsg = null
                            when (changeStep) {
                                1 -> {
                                    if (currentPinInput.length < 4) currentPinInput += digit
                                    if (currentPinInput.length == 4) {
                                        if (currentPinInput == memory.unlockPin) {
                                            view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                                            changeStep = 2
                                        } else {
                                            view.performHapticFeedback(HapticFeedbackConstants.REJECT)
                                            errorMsg = "Incorrect current PIN"
                                            currentPinInput = ""
                                        }
                                    }
                                }
                                2 -> {
                                    if (newPinInput.length < 4) newPinInput += digit
                                    if (newPinInput.length == 4) {
                                        view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                                        changeStep = 3
                                    }
                                }
                                3 -> {
                                    if (confirmNewPinInput.length < 4) confirmNewPinInput += digit
                                    if (confirmNewPinInput.length == 4) {
                                        if (confirmNewPinInput == newPinInput) {
                                            view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                                            onPinChanged(newPinInput)
                                        } else {
                                            view.performHapticFeedback(HapticFeedbackConstants.REJECT)
                                            errorMsg = "New PINs don't match"
                                            confirmNewPinInput = ""
                                        }
                                    }
                                }
                            }
                        },
                        onBackspace = {
                            when (changeStep) {
                                1 -> if (currentPinInput.isNotEmpty()) currentPinInput = currentPinInput.dropLast(1)
                                2 -> if (newPinInput.isNotEmpty()) newPinInput = newPinInput.dropLast(1)
                                3 -> if (confirmNewPinInput.isNotEmpty()) confirmNewPinInput = confirmNewPinInput.dropLast(1)
                            }
                        },
                        onClear = {
                            when (changeStep) {
                                1 -> currentPinInput = ""
                                2 -> newPinInput = ""
                                3 -> confirmNewPinInput = ""
                            }
                        }
                    )
                } else {
                    // TAB 1: REMOVE LOCK (Requires mutual consent)
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        Text(
                            text = "Remove lock from this memory?",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.textPrimary,
                            textAlign = TextAlign.Center
                        )

                        Text(
                            text = "Requires mutual agreement. Once removed, this memory will be visible in the album without requiring any PIN.",
                            fontSize = 12.sp,
                            color = colors.textSecondary,
                            textAlign = TextAlign.Center,
                            lineHeight = 17.sp
                        )

                        // Mutual Consent Cards
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .background(colors.surfaceVariant)
                                .padding(12.dp),
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(text = "Your consent to unlock:", fontSize = 13.sp, color = colors.textPrimary)
                                Checkbox(
                                    checked = youConfirmedRemove,
                                    onCheckedChange = { youConfirmedRemove = it },
                                    colors = CheckboxDefaults.colors(checkedColor = colors.primary)
                                )
                            }

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(text = "$partnerName's consent to unlock:", fontSize = 13.sp, color = colors.textPrimary)
                                Checkbox(
                                    checked = partnerConfirmedRemove,
                                    onCheckedChange = { partnerConfirmedRemove = it },
                                    colors = CheckboxDefaults.colors(checkedColor = colors.primary)
                                )
                            }
                        }

                        Button(
                            onClick = {
                                view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                                onLockRemoved()
                            },
                            enabled = youConfirmedRemove && partnerConfirmedRemove,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(48.dp),
                            shape = RoundedCornerShape(24.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = colors.primary)
                        ) {
                            Text(
                                text = "Remove Lock Permanently 🔓",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }
                    }
                }
            }
        }
    }
}

/**
 * 4. Confirm Deletion of Locked Memory:
 * Edge Case: Memory deleted while locked requires PIN verification first!
 */
@Composable
fun ConfirmLockedDeletionDialog(
    memory: MemoryItem,
    onDismiss: () -> Unit,
    onVerifiedToDelete: () -> Unit
) {
    val colors = LocalTwoBeColors.current
    val spacing = LocalTwoBeSpacing.current
    val view = LocalView.current

    var enteredPin by remember { mutableStateOf("") }
    var errorMsg by remember { mutableStateOf<String?>(null) }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .clip(RoundedCornerShape(28.dp)),
            color = colors.background,
            tonalElevation = 8.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(spacing.large),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text(
                    text = "🔒 Locked Memory Deletion",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Bold,
                    color = colors.textPrimary
                )

                Text(
                    text = "This memory is locked. Enter the mutual 4-digit PIN to confirm deletion.",
                    fontSize = 12.sp,
                    color = colors.textSecondary,
                    textAlign = TextAlign.Center
                )

                // 4 PIN Dots
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    repeat(4) { index ->
                        val isFilled = index < enteredPin.length
                        Box(
                            modifier = Modifier
                                .size(16.dp)
                                .clip(CircleShape)
                                .background(
                                    if (isFilled) Color(0xFFD64545) else colors.surfaceVariant
                                )
                        )
                    }
                }

                if (errorMsg != null) {
                    Text(
                        text = errorMsg!!,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFD64545)
                    )
                }

                MutualNumericKeypad(
                    onDigitClick = { digit ->
                        if (enteredPin.length < 4) {
                            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                            enteredPin += digit
                            errorMsg = null
                        }
                        if (enteredPin.length == 4) {
                            if (enteredPin == memory.unlockPin) {
                                view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                                onVerifiedToDelete()
                            } else {
                                view.performHapticFeedback(HapticFeedbackConstants.REJECT)
                                errorMsg = "Incorrect PIN"
                                enteredPin = ""
                            }
                        }
                    },
                    onBackspace = {
                        if (enteredPin.isNotEmpty()) enteredPin = enteredPin.dropLast(1)
                    },
                    onClear = { enteredPin = "" }
                )
            }
        }
    }
}

/**
 * Reusable 3x4 Tactile Numeric Keypad
 */
@Composable
fun MutualNumericKeypad(
    enabled: Boolean = true,
    onDigitClick: (String) -> Unit,
    onBackspace: () -> Unit,
    onClear: () -> Unit
) {
    val colors = LocalTwoBeColors.current

    val keys = listOf(
        listOf("1", "2", "3"),
        listOf("4", "5", "6"),
        listOf("7", "8", "9"),
        listOf("C", "0", "⌫")
    )

    Column(
        modifier = Modifier.fillMaxWidth(0.85f),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        keys.forEach { row ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                row.forEach { key ->
                    Box(
                        modifier = Modifier
                            .size(54.dp)
                            .clip(CircleShape)
                            .background(
                                if (key == "C" || key == "⌫") colors.surfaceVariant.copy(alpha = 0.7f)
                                else colors.surfaceVariant
                            )
                            .clickable(enabled = enabled) {
                                when (key) {
                                    "C" -> onClear()
                                    "⌫" -> onBackspace()
                                    else -> onDigitClick(key)
                                }
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = key,
                            fontSize = if (key == "⌫") 18.sp else 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (enabled) colors.textPrimary else colors.textSecondary.copy(alpha = 0.5f)
                        )
                    }
                }
            }
        }
    }
}
