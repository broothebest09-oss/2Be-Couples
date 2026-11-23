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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
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
fun SignUpScreen(
    initialEmail: String = "",
    onVerified: (email: String) -> Unit,
    onBack: () -> Unit
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val view = LocalView.current
    val scope = rememberCoroutineScope()

    var emailOrPhone by remember { mutableStateOf(initialEmail) }
    var codeSent by remember { mutableStateOf(false) }
    var verificationCode by remember { mutableStateOf("") }

    var isSendingCode by remember { mutableStateOf(false) }
    var isVerifying by remember { mutableStateOf(false) }

    var errorMessage by remember { mutableStateOf<String?>(null) }
    var isCodeExpired by remember { mutableStateOf(false) }

    fun validateEmailOrPhone(): Boolean {
        val trimmed = emailOrPhone.trim()
        if (trimmed.isEmpty()) {
            errorMessage = "Please enter your email or phone number"
            return false
        }
        val isEmail = trimmed.contains("@") && trimmed.contains(".")
        val isPhone = trimmed.replace("+", "").all { it.isDigit() } && trimmed.length >= 7
        if (!isEmail && !isPhone) {
            errorMessage = "Invalid email or phone number format"
            return false
        }
        errorMessage = null
        return true
    }

    fun sendCode() {
        if (!validateEmailOrPhone()) return
        scope.launch {
            isSendingCode = true
            errorMessage = null
            delay(1000L) // Simulate network call
            isSendingCode = false
            codeSent = true
            isCodeExpired = false
        }
    }

    fun verifyCode() {
        if (verificationCode.length < 6) {
            errorMessage = "Please enter all 6 digits"
            return
        }
        scope.launch {
            isVerifying = true
            errorMessage = null
            delay(1000L)
            isVerifying = false

            if (isCodeExpired) {
                errorMessage = "Verification code has expired. Please request a new one."
            } else if (verificationCode == "123456" || verificationCode == "000000" || verificationCode.isNotEmpty()) {
                // Mock success for any entered 6-digit code or test code
                onVerified(emailOrPhone)
            } else {
                errorMessage = "Wrong code entered. Please check and try again."
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
        // Back Button
        Box(
            modifier = Modifier
                .size(spacing.minTouchTarget)
                .clip(CircleShape)
                .clickable {
                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                    if (codeSent) codeSent = false else onBack()
                },
            contentAlignment = Alignment.Center
        ) {
            Text(text = "←", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = colors.textPrimary)
        }

        Spacer(modifier = Modifier.height(spacing.medium))

        Text(
            text = if (!codeSent) "Enter your email or phone" else "Verify your code",
            fontSize = 26.sp,
            fontWeight = FontWeight.Bold,
            color = colors.textPrimary
        )

        Text(
            text = if (!codeSent)
                "We'll send you a 6-digit confirmation code to securely link your account."
            else
                "We sent a 6-digit code to $emailOrPhone",
            fontSize = 14.sp,
            color = colors.textSecondary,
            lineHeight = 20.sp,
            modifier = Modifier.padding(top = spacing.xxSmall, bottom = spacing.large)
        )

        if (!codeSent) {
            // Email / Phone Field
            TwoBeCard(modifier = Modifier.fillMaxWidth()) {
                Column {
                    OutlinedTextField(
                        value = emailOrPhone,
                        onValueChange = {
                            emailOrPhone = it
                            errorMessage = null
                        },
                        placeholder = { Text("e.g. alex@example.com or +123456789") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        isError = errorMessage != null,
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = colors.primary,
                            unfocusedBorderColor = colors.border
                        )
                    )
                }
            }

            if (errorMessage != null) {
                Text(
                    text = errorMessage!!,
                    fontSize = 12.sp,
                    color = colors.error,
                    modifier = Modifier.padding(top = spacing.xxSmall, start = 4.dp)
                )
            }

            Spacer(modifier = Modifier.height(spacing.large))

            TwoBeButton(
                text = if (isSendingCode) "Sending Code..." else "Send verification code",
                onClick = { sendCode() },
                enabled = !isSendingCode,
                modifier = Modifier.fillMaxWidth(),
                variant = ButtonVariant.PRIMARY,
                icon = if (isSendingCode) {
                    { CircularProgressIndicator(color = Color.White, modifier = Modifier.size(16.dp), strokeWidth = 2.dp) }
                } else null
            )
        } else {
            // Code Input Field
            TwoBeCard(modifier = Modifier.fillMaxWidth()) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    OtpSixDigitInput(
                        code = verificationCode,
                        onCodeChange = {
                            verificationCode = it
                            errorMessage = null
                        },
                        isError = errorMessage != null,
                        onComplete = { verifyCode() }
                    )

                    Spacer(modifier = Modifier.height(spacing.medium))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Didn't receive it?",
                            fontSize = 12.sp,
                            color = colors.textSecondary
                        )

                        Text(
                            text = "Resend Code",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.accent,
                            modifier = Modifier
                                .clip(RoundedCornerShape(4.dp))
                                .clickable {
                                    sendCode()
                                }
                                .padding(4.dp)
                        )
                    }
                }
            }

            if (errorMessage != null) {
                Text(
                    text = errorMessage!!,
                    fontSize = 12.sp,
                    color = colors.error,
                    modifier = Modifier.padding(top = spacing.xxSmall, start = 4.dp)
                )
            }

            Spacer(modifier = Modifier.height(spacing.large))

            TwoBeButton(
                text = if (isVerifying) "Verifying..." else "Verify",
                onClick = { verifyCode() },
                enabled = !isVerifying && verificationCode.length == 6,
                modifier = Modifier.fillMaxWidth(),
                variant = ButtonVariant.PRIMARY,
                icon = if (isVerifying) {
                    { CircularProgressIndicator(color = Color.White, modifier = Modifier.size(16.dp), strokeWidth = 2.dp) }
                } else null
            )
        }
    }
}
