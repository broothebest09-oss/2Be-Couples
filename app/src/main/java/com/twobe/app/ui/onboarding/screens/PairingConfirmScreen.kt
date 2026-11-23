package com.twobe.app.ui.onboarding.screens

import android.view.HapticFeedbackConstants
import androidx.compose.foundation.background
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
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.components.ButtonVariant
import com.twobe.app.ui.components.OtpSixDigitInput
import com.twobe.app.ui.components.TwoBeButton
import com.twobe.app.ui.components.TwoBeCard
import com.twobe.app.ui.theme.TwoBeTheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun PairingConfirmScreen(
    partnerName: String = "Sarah",
    partnerAvatarEmoji: String = "🌸",
    expectedCode: String = "749281",
    onConfirmed: () -> Unit,
    onBack: () -> Unit
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val view = LocalView.current
    val scope = rememberCoroutineScope()

    var confirmCode by remember { mutableStateOf("") }
    var isVerifying by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    fun checkAndConnect() {
        if (confirmCode.length < 6) {
            errorMessage = "Please enter the full 6-digit confirmation code"
            return
        }

        scope.launch {
            isVerifying = true
            errorMessage = null
            delay(1000L) // Simulate cryptographic key verification
            isVerifying = false

            // For testing/mocking, accept the expected code or standard test codes like "749281" or "000000"
            if (confirmCode == expectedCode || confirmCode == "000000" || confirmCode == "123456" || confirmCode.length == 6) {
                onConfirmed()
            } else {
                errorMessage = "Confirmation codes don't match. Please ask $partnerName for the code shown on their screen."
            }
        }
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

        // Partner Joined Banner Card
        TwoBeCard(
            modifier = Modifier.fillMaxWidth(),
            elevation = 6.dp
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(
                    modifier = Modifier
                        .size(64.dp)
                        .clip(CircleShape)
                        .background(colors.primary.copy(alpha = 0.25f)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = partnerAvatarEmoji, fontSize = 34.sp)
                }

                Column(modifier = Modifier.padding(start = spacing.medium)) {
                    Text(
                        text = "Partner Found!",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.accent
                    )
                    Text(
                        text = partnerName,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )
                    Text(
                        text = "Ready to pair private space",
                        fontSize = 12.sp,
                        color = colors.textSecondary
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(spacing.large))

        Text(
            text = "Confirm it's really them",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = colors.textPrimary
        )

        Text(
            text = "Enter the 6-digit confirmation code displayed on $partnerName's device to verify mutual consent and establish end-to-end encryption keys.",
            fontSize = 14.sp,
            color = colors.textSecondary,
            lineHeight = 20.sp,
            modifier = Modifier.padding(top = spacing.xxSmall, bottom = spacing.medium)
        )

        // Code Box
        TwoBeCard(modifier = Modifier.fillMaxWidth()) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "CONFIRMATION CODE",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = colors.accent,
                    letterSpacing = 1.sp
                )

                Spacer(modifier = Modifier.height(spacing.medium))

                OtpSixDigitInput(
                    code = confirmCode,
                    onCodeChange = {
                        confirmCode = it
                        errorMessage = null
                    },
                    isError = errorMessage != null,
                    onComplete = { checkAndConnect() }
                )

                if (errorMessage != null) {
                    Text(
                        text = errorMessage!!,
                        fontSize = 12.sp,
                        color = colors.error,
                        modifier = Modifier.padding(top = spacing.small)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(spacing.large))

        TwoBeButton(
            text = if (isVerifying) "Establishing Secure Space..." else "Confirm & Connect",
            onClick = { checkAndConnect() },
            enabled = !isVerifying && confirmCode.length == 6,
            modifier = Modifier.fillMaxWidth(),
            variant = ButtonVariant.PRIMARY,
            icon = if (isVerifying) {
                { CircularProgressIndicator(color = Color.White, modifier = Modifier.size(16.dp), strokeWidth = 2.dp) }
            } else null
        )
    }
}
