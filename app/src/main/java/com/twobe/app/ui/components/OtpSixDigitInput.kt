package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.theme.TwoBeTheme

@Composable
fun OtpSixDigitInput(
    code: String,
    onCodeChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    isError: Boolean = false,
    onComplete: (() -> Unit)? = null
) {
    val focusRequester = remember { FocusRequester() }
    val colors = TwoBeTheme.colors
    val view = LocalView.current

    LaunchedEffect(Unit) {
        focusRequester.requestFocus()
    }

    Box(
        modifier = modifier.fillMaxWidth(),
        contentAlignment = Alignment.Center
    ) {
        // Invisible backing text field to handle native IME, keyboard, auto-advance, backspace
        BasicTextField(
            value = code,
            onValueChange = { newText ->
                if (newText.length <= 6 && newText.all { it.isDigit() }) {
                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                    onCodeChange(newText)
                    if (newText.length == 6) {
                        onComplete?.invoke()
                    }
                }
            },
            keyboardOptions = KeyboardOptions(
                keyboardType = KeyboardType.NumberPassword,
                imeAction = ImeAction.Done
            ),
            keyboardActions = KeyboardActions(
                onDone = {
                    if (code.length == 6) {
                        onComplete?.invoke()
                    }
                }
            ),
            modifier = Modifier
                .focusRequester(focusRequester)
                .size(1.dp)
        )

        // 6 Visual Digit Boxes
        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            for (i in 0 until 6) {
                val digit = code.getOrNull(i)?.toString() ?: ""
                val isCurrent = code.length == i

                val borderColor = when {
                    isError -> colors.error
                    isCurrent -> colors.accent
                    digit.isNotEmpty() -> colors.primary
                    else -> colors.border
                }

                val backgroundColor = when {
                    isError -> colors.error.copy(alpha = 0.05f)
                    isCurrent -> colors.surfaceVariant
                    else -> colors.surface
                }

                Box(
                    modifier = Modifier
                        .size(width = 46.dp, height = 54.dp)
                        .shadow(
                            elevation = if (isCurrent) 4.dp else 1.dp,
                            shape = RoundedCornerShape(12.dp),
                            ambientColor = colors.accent.copy(alpha = 0.1f)
                        )
                        .clip(RoundedCornerShape(12.dp))
                        .background(backgroundColor)
                        .border(
                            width = if (isCurrent) 2.dp else 1.dp,
                            color = borderColor,
                            shape = RoundedCornerShape(12.dp)
                        )
                        .clickable {
                            focusRequester.requestFocus()
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = digit,
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (isError) colors.error else colors.textPrimary
                    )
                }
            }
        }
    }
}
