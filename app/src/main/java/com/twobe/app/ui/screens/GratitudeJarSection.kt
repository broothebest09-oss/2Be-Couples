package com.twobe.app.ui.screens

import android.view.HapticFeedbackConstants
import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.ui.components.ButtonVariant
import com.twobe.app.ui.components.GratitudeJarVisual
import com.twobe.app.ui.components.GratitudeMilestone
import com.twobe.app.ui.components.GratitudeNoteModal
import com.twobe.app.ui.components.MilestoneCelebrationDialog
import com.twobe.app.ui.components.RememberShakeDetector
import com.twobe.app.ui.components.TwoBeButton
import com.twobe.app.ui.components.TwoBeCard
import com.twobe.app.ui.theme.TwoBeTheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun GratitudeJarSection(
    partnerName: String = "Sarah",
    userName: String = "Alex",
    userAvatarEmoji: String = "🐰",
    partnerAvatarEmoji: String = "🌸",
    onMilestoneReached: (MemoryItem) -> Unit = {}
) {
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing
    val context = LocalContext.current
    val view = LocalView.current
    val scope = rememberCoroutineScope()

    // Notes list (initialized with 18 grateful notes)
    val notes = remember {
        mutableStateListOf(
            GratitudeNote(
                id = "1",
                text = "Thank you for bringing me warm tea when I had that long work call today. You always notice the small things.",
                authorName = userName,
                authorAvatarEmoji = userAvatarEmoji,
                dateText = "Today",
                timestampMillis = System.currentTimeMillis() - 3600000L,
                paperColorHex = 0xFFFFE3E8
            ),
            GratitudeNote(
                id = "2",
                text = "How tightly you held my hand while we crossed the street yesterday. It made me feel so cherished.",
                authorName = partnerName,
                authorAvatarEmoji = partnerAvatarEmoji,
                dateText = "Yesterday",
                timestampMillis = System.currentTimeMillis() - 86400000L,
                paperColorHex = 0xFFFFF3CD
            ),
            GratitudeNote(
                id = "3",
                text = "Your belly laugh when our pancake flipped completely upside down onto the counter! I love our goofy mornings.",
                authorName = userName,
                authorAvatarEmoji = userAvatarEmoji,
                dateText = "3 days ago",
                timestampMillis = System.currentTimeMillis() - 259200000L,
                paperColorHex = 0xFFE3F2FD
            ),
            GratitudeNote(
                id = "4",
                text = "For listening without judgment when I was feeling overwhelmed. You are my calm in every storm.",
                authorName = partnerName,
                authorAvatarEmoji = partnerAvatarEmoji,
                dateText = "5 days ago",
                timestampMillis = System.currentTimeMillis() - 432000000L,
                paperColorHex = 0xFFE8F5E9
            ),
            GratitudeNote(
                id = "5",
                text = "The spontaneous forehead kiss before leaving for work. It gave me energy for the whole day.",
                authorName = userName,
                authorAvatarEmoji = userAvatarEmoji,
                dateText = "1 week ago",
                timestampMillis = System.currentTimeMillis() - 604800000L,
                paperColorHex = 0xFFF3E5F5
            )
        )
    }

    // Interactive states
    var inputText by remember { mutableStateOf("") }
    var isShakingAnimation by remember { mutableStateOf(false) }
    var isDroppingNoteAnimation by remember { mutableStateOf(false) }
    var partnerNotificationBanner by remember { mutableStateOf<String?>(null) }
    var activeNoteModal by remember { mutableStateOf<GratitudeNote?>(null) }
    var activeMilestone by remember { mutableStateOf<GratitudeMilestone?>(null) }

    fun triggerRandomNote() {
        if (notes.isEmpty()) return
        view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
        isShakingAnimation = true
        scope.launch {
            delay(500L)
            isShakingAnimation = false
            activeNoteModal = notes.random()
        }
    }

    // Sensor Shake Listener
    RememberShakeDetector(enabled = true) {
        triggerRandomNote()
    }

    fun handleDropNote() {
        val trimmed = inputText.trim()
        if (trimmed.isEmpty()) return

        view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
        isDroppingNoteAnimation = true

        scope.launch {
            delay(400L) // Sound/haptic time
            isDroppingNoteAnimation = false

            val newNote = GratitudeNote(
                text = trimmed,
                authorName = userName,
                authorAvatarEmoji = userAvatarEmoji,
                dateText = "Just now",
                timestampMillis = System.currentTimeMillis(),
                paperColorHex = PASTEL_NOTE_COLORS.random()
            )
            notes.add(0, newNote)
            inputText = ""

            // Show simulated partner notification
            partnerNotificationBanner = "$userName added a note to the gratitude jar ✨"
            Toast.makeText(context, "Note added to jar ✓", Toast.LENGTH_SHORT).show()

            delay(3500L)
            partnerNotificationBanner = null

            // Check Milestones (10, 50, 100)
            val currentCount = notes.size
            if (currentCount == 10 || currentCount == 50 || currentCount == 100) {
                val milestone = when (currentCount) {
                    10 -> GratitudeMilestone(10, "10 notes! 🎉", "A blossom of mutual appreciation", "🌸")
                    50 -> GratitudeMilestone(50, "50 notes! 🌟", "You're amazing together", "✨")
                    else -> GratitudeMilestone(100, "100 notes! 💖", "A century of gratitude", "👑")
                }
                activeMilestone = milestone

                // Auto-save milestone to Memories Timeline
                val milestoneMemory = MemoryItem(
                    type = MemoryType.MILESTONE,
                    title = milestone.title,
                    caption = milestone.subtitle,
                    milestoneEmoji = milestone.emoji,
                    dateText = SimpleDateFormat("MMM d, yyyy", Locale.getDefault()).format(Date()),
                    timestampMillis = System.currentTimeMillis(),
                    senderName = "Gratitude Jar",
                    senderAvatarEmoji = "🍯",
                    originalContext = "Jar reached ${milestone.threshold} notes"
                )
                onMilestoneReached(milestoneMemory)
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = spacing.medium, vertical = spacing.small)
    ) {
        // Partner Notification Banner
        AnimatedVisibility(visible = partnerNotificationBanner != null) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = spacing.small)
                    .clip(RoundedCornerShape(12.dp))
                    .background(colors.accent)
                    .padding(horizontal = spacing.medium, vertical = 8.dp)
            ) {
                Text(
                    text = partnerNotificationBanner ?: "",
                    color = Color.White,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }

        // ==========================================
        // 1. JAR VISUAL (Top half of screen)
        // ==========================================
        TwoBeCard(
            modifier = Modifier.fillMaxWidth(),
            elevation = 4.dp
        ) {
            GratitudeJarVisual(
                notesCount = notes.size,
                isShaking = isShakingAnimation,
                isDroppingNote = isDroppingNoteAnimation,
                onManualShakeClick = { triggerRandomNote() }
            )
        }

        Spacer(modifier = Modifier.height(spacing.medium))

        // ==========================================
        // 2. ADD NOTE SECTION (Middle)
        // ==========================================
        TwoBeCard(
            modifier = Modifier.fillMaxWidth(),
            elevation = 4.dp
        ) {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "WHAT ARE YOU GRATEFUL FOR TODAY?",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.accent,
                        letterSpacing = 1.sp
                    )

                    Text(
                        text = "${inputText.length}/500",
                        fontSize = 11.sp,
                        color = if (inputText.length > 450) colors.error else colors.textSecondary
                    )
                }

                Spacer(modifier = Modifier.height(spacing.xxSmall))

                OutlinedTextField(
                    value = inputText,
                    onValueChange = { if (it.length <= 500) inputText = it },
                    placeholder = {
                        Text(
                            text = "A sweet gesture, a warm laugh, or something they did that made you smile...",
                            fontSize = 13.sp,
                            color = colors.textSecondary
                        )
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(110.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = colors.primary,
                        unfocusedBorderColor = colors.border
                    )
                )

                Spacer(modifier = Modifier.height(spacing.small))

                TwoBeButton(
                    text = "Drop in Jar 🍯",
                    onClick = { handleDropNote() },
                    enabled = inputText.isNotBlank(),
                    modifier = Modifier.fillMaxWidth(),
                    variant = ButtonVariant.PRIMARY
                )
            }
        }

        Spacer(modifier = Modifier.height(spacing.large))

        // ==========================================
        // 3. RECENT NOTES (Bottom)
        // ==========================================
        Text(
            text = "Recent notes",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = colors.textPrimary
        )

        Spacer(modifier = Modifier.height(spacing.small))

        if (notes.isEmpty()) {
            TwoBeCard(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "No notes yet. Be the first to drop one in!",
                    fontSize = 13.sp,
                    color = colors.textSecondary,
                    textAlign = TextAlign.Center,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = spacing.medium)
                )
            }
        } else {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                // Show last 5 notes
                notes.take(5).forEach { note ->
                    TwoBeCard(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                activeNoteModal = note
                            },
                        elevation = 2.dp,
                        backgroundColor = Color(note.paperColorHex).copy(alpha = 0.5f)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(34.dp)
                                    .clip(CircleShape)
                                    .background(Color.White.copy(alpha = 0.7f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = note.authorAvatarEmoji, fontSize = 18.sp)
                            }

                            Spacer(modifier = Modifier.width(spacing.small))

                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = if (note.text.length > 50) "${note.text.take(50)}..." else note.text,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = Color(0xFF2D1F24),
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )

                                Text(
                                    text = "${note.authorName} • ${note.dateText}",
                                    fontSize = 11.sp,
                                    color = Color(0xFF6B585C),
                                    modifier = Modifier.padding(top = 2.dp)
                                )
                            }

                            Text(
                                text = "Read",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = colors.accent,
                                modifier = Modifier.padding(start = 8.dp)
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(spacing.huge))
    }

    // Modal displaying the drawn / unfolded note
    GratitudeNoteModal(
        note = activeNoteModal,
        onNext = {
            if (notes.isNotEmpty()) {
                activeNoteModal = notes.random()
            }
        },
        onDismiss = { activeNoteModal = null }
    )

    // Milestone celebration modal
    MilestoneCelebrationDialog(
        milestone = activeMilestone,
        onDismiss = { activeMilestone = null }
    )
}
