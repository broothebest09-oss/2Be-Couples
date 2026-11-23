package com.twobe.app.ui.onboarding.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.view.HapticFeedbackConstants
import android.widget.Toast
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.components.ButtonVariant
import com.twobe.app.ui.components.OtpSixDigitInput
import com.twobe.app.ui.components.TwoBeButton
import com.twobe.app.ui.components.TwoBeCard
import com.twobe.app.ui.theme.TwoBeTheme

@Composable
fun PairingInviteScreen(
    generatedCode: String = "2BE-8842",
    partnerNickname: String = "Partner",
    isInviteExpired: Boolean = false,
    onPartnerCodeEntered: (code: String) -> Unit,
    onPartnerJoinedSimulated: () -> Unit,
    onResendInvite: () -> Unit,
    onBack: () -> Unit
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val context = LocalContext.current
    val view = LocalView.current

    var selectedMode by remember { mutableStateOf<"SHARE" | "ENTER">("SHARE") }
    var partnerCodeInput by remember { mutableStateOf("") }
    var codeError by remember { mutableStateOf<String?>(null) }

    // Animated dots for waiting state
    val infiniteTransition = rememberInfiniteTransition(label = "dots")
    val dotOffset by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 3f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "dotPulse"
    )

    fun copyToClipboard() {
        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText("2Be Invite Code", generatedCode)
        clipboard.setPrimaryClip(clip)
        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
        Toast.makeText(context, "Invite code copied!", Toast.LENGTH_SHORT).show()
    }

    fun shareInviteLink() {
        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
        val shareIntent = Intent().apply {
            action = Intent.ACTION_SEND
            putExtra(
                Intent.EXTRA_TEXT,
                "Hey! Join me on 2Be, our private couple's world. Download the app and enter code: $generatedCode or open: https://2be.app/pair?code=$generatedCode"
            )
            type = "text/plain"
        }
        context.startActivity(Intent.createChooser(shareIntent, "Invite your partner via"))
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(colors.background)
            .verticalScroll(rememberScrollState())
            .padding(spacing.large)
    ) {
        // Back
        Box(
            modifier = Modifier
                .size(spacing.minTouchTarget)
                .clip(CircleShape)
                .clickable {
                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                    onBack()
                },
            contentAlignment = Alignment.Center
        ) {
            Text(text = "←", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = colors.textPrimary)
        }

        Spacer(modifier = Modifier.height(spacing.medium))

        Text(
            text = "Invite your partner",
            fontSize = 26.sp,
            fontWeight = FontWeight.Bold,
            color = colors.textPrimary
        )

        Text(
            text = "Connect with your significant other to unlock your private space.",
            fontSize = 14.sp,
            color = colors.textSecondary,
            modifier = Modifier.padding(top = spacing.xxSmall, bottom = spacing.medium)
        )

        // Mode switch cards
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(spacing.small)
        ) {
            // Option A: Send invite link
            TwoBeCard(
                modifier = Modifier
                    .weight(1f)
                    .clickable { selectedMode = "SHARE" },
                backgroundColor = if (selectedMode == "SHARE") colors.surfaceVariant else colors.surface,
                borderColor = if (selectedMode == "SHARE") colors.accent else colors.border
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(text = "💌", fontSize = 24.sp)
                    Text(
                        text = "Send invite",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (selectedMode == "SHARE") colors.accent else colors.textPrimary,
                        modifier = Modifier.padding(top = 4.dp)
                    )
                }
            }

            // Option B: Enter partner's code
            TwoBeCard(
                modifier = Modifier
                    .weight(1f)
                    .clickable { selectedMode = "ENTER" },
                backgroundColor = if (selectedMode == "ENTER") colors.surfaceVariant else colors.surface,
                borderColor = if (selectedMode == "ENTER") colors.accent else colors.border
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(text = "🔢", fontSize = 24.sp)
                    Text(
                        text = "Enter partner's code",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (selectedMode == "ENTER") colors.accent else colors.textPrimary,
                        modifier = Modifier.padding(top = 4.dp)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(spacing.medium))

        if (isInviteExpired) {
            // Expired error state with resend
            TwoBeCard(
                modifier = Modifier.fillMaxWidth(),
                backgroundColor = colors.error.copy(alpha = 0.08f),
                borderColor = colors.error
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "⚠️ Invite link has expired",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.error
                    )
                    Text(
                        text = "Invite links expire after 7 days for security. Please generate a fresh link.",
                        fontSize = 12.sp,
                        color = colors.textSecondary,
                        modifier = Modifier.padding(vertical = spacing.xxSmall)
                    )
                    TwoBeButton(
                        text = "Generate New Invite",
                        onClick = onResendInvite,
                        variant = ButtonVariant.PRIMARY
                    )
                }
            }
            return@Column
        }

        if (selectedMode == "SHARE") {
            // Option A Content: Generated invite code & share buttons
            TwoBeCard(modifier = Modifier.fillMaxWidth()) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "YOUR INVITATION CODE",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.accent,
                        letterSpacing = 1.sp
                    )

                    Spacer(modifier = Modifier.height(spacing.small))

                    Row(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(colors.surfaceVariant)
                            .padding(horizontal = spacing.large, vertical = spacing.small),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = generatedCode,
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.textPrimary,
                            letterSpacing = 2.sp
                        )

                        Spacer(modifier = Modifier.size(spacing.small))

                        Text(
                            text = "Copy",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.accent,
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .clickable { copyToClipboard() }
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(spacing.medium))

                    Text(
                        text = "⏳ Invite expires in 7 days",
                        fontSize = 12.sp,
                        color = colors.textSecondary
                    )

                    Spacer(modifier = Modifier.height(spacing.medium))

                    TwoBeButton(
                        text = "Share Invite Link",
                        onClick = { shareInviteLink() },
                        modifier = Modifier.fillMaxWidth(),
                        variant = ButtonVariant.PRIMARY
                    )
                }
            }

            Spacer(modifier = Modifier.height(spacing.medium))

            // Animated waiting card
            TwoBeCard(modifier = Modifier.fillMaxWidth()) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        // Animated dots
                        Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            for (i in 0..2) {
                                val active = dotOffset.toInt() % 3 == i
                                Box(
                                    modifier = Modifier
                                        .size(8.dp)
                                        .scale(if (active) 1.3f else 1.0f)
                                        .clip(CircleShape)
                                        .background(if (active) colors.accent else colors.primary.copy(alpha = 0.4f))
                                )
                            }
                        }

                        Text(
                            text = "Waiting for $partnerNickname to join...",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            color = colors.textSecondary,
                            modifier = Modifier.padding(start = spacing.small)
                        )
                    }

                    // Simulated trigger for testing and interactive flow
                    Text(
                        text = "Simulate Join",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.accent,
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .clickable {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                onPartnerJoinedSimulated()
                            }
                            .padding(horizontal = 6.dp, vertical = 3.dp)
                    )
                }
            }
        } else {
            // Option B Content: Enter Partner's code
            TwoBeCard(modifier = Modifier.fillMaxWidth()) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "ENTER PARTNER'S 6-DIGIT CODE",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.accent,
                        letterSpacing = 1.sp
                    )

                    Spacer(modifier = Modifier.height(spacing.medium))

                    OtpSixDigitInput(
                        code = partnerCodeInput,
                        onCodeChange = {
                            partnerCodeInput = it
                            codeError = null
                        },
                        isError = codeError != null,
                        onComplete = {
                            if (partnerCodeInput.length == 6) {
                                onPartnerCodeEntered(partnerCodeInput)
                            }
                        }
                    )

                    if (codeError != null) {
                        Text(
                            text = codeError!!,
                            fontSize = 12.sp,
                            color = colors.error,
                            modifier = Modifier.padding(top = spacing.small)
                        )
                    }

                    Spacer(modifier = Modifier.height(spacing.large))

                    TwoBeButton(
                        text = "Connect with Partner",
                        onClick = {
                            if (partnerCodeInput.length == 6) {
                                onPartnerCodeEntered(partnerCodeInput)
                            } else {
                                codeError = "Please enter partner's complete 6-digit code"
                            }
                        },
                        enabled = partnerCodeInput.length == 6,
                        modifier = Modifier.fillMaxWidth(),
                        variant = ButtonVariant.PRIMARY
                    )
                }
            }
        }
    }
}
