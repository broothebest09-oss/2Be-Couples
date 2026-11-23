package com.twobe.app.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

@Immutable
data class TwoBeSpacing(
    val xxxSmall: Dp = 4.dp,
    val xxSmall: Dp = 8.dp,
    val xSmall: Dp = 12.dp,
    val small: Dp = 16.dp,
    val medium: Dp = 20.dp,
    val large: Dp = 24.dp,
    val xLarge: Dp = 32.dp,
    val xxLarge: Dp = 40.dp,
    val xxxLarge: Dp = 48.dp,
    val huge: Dp = 64.dp,
    val minTouchTarget: Dp = 44.dp
)

val LocalSpacing = staticCompositionLocalOf { TwoBeSpacing() }
