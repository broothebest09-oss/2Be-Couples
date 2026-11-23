package com.twobe.app.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

enum class ThemeMode {
    SYSTEM, LIGHT, DARK
}

@Immutable
data class TwoBeColorPalette(
    val primary: Color,
    val secondary: Color,
    val accent: Color,
    val background: Color,
    val surface: Color,
    val surfaceVariant: Color,
    val textPrimary: Color,
    val textSecondary: Color,
    val success: Color,
    val error: Color,
    val border: Color,
    val gradientStart: Color,
    val gradientEnd: Color,
    val isDark: Boolean
)

val LightPalette = TwoBeColorPalette(
    primary = SoftRose,
    secondary = WarmCream,
    accent = DeepBerry,
    background = BackgroundLight,
    surface = SurfaceLight,
    surfaceVariant = SurfaceVariantLight,
    textPrimary = TextPrimaryLight,
    textSecondary = TextSecondaryLight,
    success = SuccessGreen,
    error = ErrorRed,
    border = BorderLight,
    gradientStart = RoseGradientStart,
    gradientEnd = RoseGradientEnd,
    isDark = false
)

val DarkPalette = TwoBeColorPalette(
    primary = SoftRose,
    secondary = Color(0xFF2C2226),
    accent = Color(0xFFD6739B),
    background = BackgroundDark,
    surface = SurfaceDark,
    surfaceVariant = SurfaceVariantDark,
    textPrimary = TextPrimaryDark,
    textSecondary = TextSecondaryDark,
    success = SuccessGreen,
    error = ErrorRed,
    border = BorderDark,
    gradientStart = RoseGradientDarkStart,
    gradientEnd = RoseGradientDarkEnd,
    isDark = true
)

val LocalTwoBeColors = staticCompositionLocalOf { LightPalette }

private val LightColorScheme = lightColorScheme(
    primary = SoftRose,
    secondary = WarmCream,
    tertiary = DeepBerry,
    background = BackgroundLight,
    surface = SurfaceLight,
    surfaceVariant = SurfaceVariantLight,
    onPrimary = TextPrimaryLight,
    onSecondary = TextPrimaryLight,
    onTertiary = Color.White,
    onBackground = TextPrimaryLight,
    onSurface = TextPrimaryLight,
    onSurfaceVariant = TextSecondaryLight,
    error = ErrorRed
)

private val DarkColorScheme = darkColorScheme(
    primary = SoftRose,
    secondary = Color(0xFF2C2226),
    tertiary = DeepBerry,
    background = BackgroundDark,
    surface = SurfaceDark,
    surfaceVariant = SurfaceVariantDark,
    onPrimary = TextPrimaryDark,
    onSecondary = TextPrimaryDark,
    onTertiary = Color.White,
    onBackground = TextPrimaryDark,
    onSurface = TextPrimaryDark,
    onSurfaceVariant = TextSecondaryDark,
    error = ErrorRed
)

@Composable
fun TwoBeTheme(
    themeMode: ThemeMode = ThemeMode.SYSTEM,
    content: @Composable () -> Unit
) {
    val isDark = when (themeMode) {
        ThemeMode.SYSTEM -> isSystemInDarkTheme()
        ThemeMode.LIGHT -> false
        ThemeMode.DARK -> true
    }

    val palette = if (isDark) DarkPalette else LightPalette
    val colorScheme = if (isDark) DarkColorScheme else LightColorScheme

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window
            if (window != null) {
                window.statusBarColor = palette.background.toArgb()
                window.navigationBarColor = palette.background.toArgb()
                WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !isDark
                WindowCompat.getInsetsController(window, view).isAppearanceLightNavigationBars = !isDark
            }
        }
    }

    CompositionLocalProvider(
        LocalTwoBeColors provides palette,
        LocalSpacing provides TwoBeSpacing()
    ) {
        MaterialTheme(
            colorScheme = colorScheme,
            typography = TwoBeTypography,
            shapes = TwoBeShapes,
            content = content
        )
    }
}

object TwoBeTheme {
    val colors: TwoBeColorPalette
        @Composable
        get() = LocalTwoBeColors.current

    val spacing: TwoBeSpacing
        @Composable
        get() = LocalSpacing.current
}
