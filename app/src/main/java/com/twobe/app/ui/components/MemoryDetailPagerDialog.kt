package com.twobe.app.ui.components

import android.view.HapticFeedbackConstants
import android.widget.Toast
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.twobe.app.data.LockedLetterNotificationManager
import com.twobe.app.ui.screens.MemoryItem
import com.twobe.app.ui.screens.MemoryType
import com.twobe.app.ui.theme.DeepBerry
import com.twobe.app.ui.theme.SoftRose
import com.twobe.app.ui.theme.TwoBeTheme

@Composable
fun MemoryDetailPagerDialog(
    memories: List<MemoryItem>,
    initialIndex: Int,
    partnerName: String = "Sarah",
    onDismiss: () -> Unit,
    onRequestDelete: (MemoryItem) -> Unit
) {
    if (memories.isEmpty()) return

    val context = LocalContext.current
    val view = LocalView.current
    val colors = TwoBeTheme.colors
    val spacing = TwoBeTheme.spacing

    val pagerState = rememberPagerState(
        initialPage = initialIndex.coerceIn(0, memories.size - 1),
        pageCount = { memories.size }
    )

    // Unlocked tracking for locked memories during this viewer session
    val unlockedIds = remember { mutableStateOf(setOf<String>()) }
    var lockingMemory by remember { mutableStateOf<MemoryItem?>(null) }
    var unlockingMemory by remember { mutableStateOf<MemoryItem?>(null) }
    var changePinMemory by remember { mutableStateOf<MemoryItem?>(null) }
    var deleteLockedMemory by remember { mutableStateOf<MemoryItem?>(null) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.95f))
    ) {
        HorizontalPager(
            state = pagerState,
            modifier = Modifier.fillMaxSize()
        ) { page ->
            val memory = memories[page]
            val isLocked = (memory.isLocked || memory.type == MemoryType.LOCKED) && !unlockedIds.value.contains(memory.id)

            if (isLocked) {
                // Locked screen cover
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(spacing.large),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Box(
                        modifier = Modifier
                            .size(80.dp)
                            .clip(CircleShape)
                            .background(Color.White.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "🔒", fontSize = 40.sp)
                    }

                    Text(
                        text = "Private Couple Memory",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        modifier = Modifier.padding(top = spacing.medium)
                    )

                    Text(
                        text = "This memory requires mutual PIN verification to view.",
                        fontSize = 13.sp,
                        color = Color.White.copy(alpha = 0.7f),
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(top = 4.dp, bottom = spacing.large)
                    )

                    TwoBeButton(
                        text = "Enter 4-Digit PIN",
                        onClick = {
                            unlockingMemory = memory
                        },
                        variant = ButtonVariant.PRIMARY
                    )
                }
            } else {
                // Memory Content Viewer
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = spacing.medium, vertical = spacing.xLarge),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    Spacer(modifier = Modifier.height(40.dp))

                    // Media / Visual Canvas
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(0.92f)
                            .height(380.dp)
                            .clip(RoundedCornerShape(24.dp))
                            .background(colors.surface),
                        contentAlignment = Alignment.Center
                    ) {
                        when (memory.type) {
                            MemoryType.PHOTO, MemoryType.LOCKED -> {
                                Box(
                                    modifier = Modifier.fillMaxSize(),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(text = "📸", fontSize = 80.sp)
                                }
                            }
                            MemoryType.VIDEO -> {
                                Box(
                                    modifier = Modifier.fillMaxSize(),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Text(text = "🎥", fontSize = 72.sp)
                                        Text(
                                            text = "Playing video (${memory.videoDuration ?: "0:15"})",
                                            fontSize = 13.sp,
                                            color = colors.textSecondary,
                                            modifier = Modifier.padding(top = 8.dp)
                                        )
                                    }
                                }
                            }
                            MemoryType.MILESTONE -> {
                                Column(
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    modifier = Modifier.padding(24.dp)
                                ) {
                                    Text(text = memory.milestoneEmoji ?: "💖", fontSize = 72.sp)
                                    Text(
                                        text = memory.title ?: "Milestone",
                                        fontSize = 22.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = colors.textPrimary,
                                        textAlign = TextAlign.Center,
                                        modifier = Modifier.padding(top = 12.dp)
                                    )
                                }
                            }
                            MemoryType.TEXT -> {
                                Column(
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    modifier = Modifier.padding(24.dp)
                                ) {
                                    Text(text = "💬", fontSize = 48.sp)
                                    Text(
                                        text = "“${memory.caption ?: ""}”",
                                        fontSize = 18.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = colors.textPrimary,
                                        textAlign = TextAlign.Center,
                                        lineHeight = 26.sp,
                                        modifier = Modifier.padding(top = 16.dp)
                                    )
                                }
                            }
                        }

                        // Pending deletion banner if flagged
                        if (memory.isPendingDeletion) {
                            Box(
                                modifier = Modifier
                                    .align(Alignment.TopCenter)
                                    .fillMaxWidth()
                                    .background(Color(0xFFD64545).copy(alpha = 0.9f))
                                    .padding(vertical = 6.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "⚠️ Pending deletion (waiting for partner to confirm)",
                                    color = Color.White,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }

                    // Metadata & Actions (Sender, Date, Context)
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = spacing.small),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        // Sender & Date
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(28.dp)
                                    .clip(CircleShape)
                                    .background(colors.primary.copy(alpha = 0.3f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = memory.senderAvatarEmoji, fontSize = 16.sp)
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Saved by ${memory.senderName} • ${memory.dateText}",
                                color = Color.White,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }

                        if (memory.originalContext != null) {
                            Text(
                                text = "From: ${memory.originalContext}",
                                color = Color.White.copy(alpha = 0.7f),
                                fontSize = 12.sp,
                                modifier = Modifier.padding(top = 4.dp)
                            )
                        }

                        if (memory.caption != null && memory.type != MemoryType.TEXT) {
                            Text(
                                text = memory.caption,
                                color = Color.White,
                                fontSize = 14.sp,
                                textAlign = TextAlign.Center,
                                modifier = Modifier.padding(top = 8.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Action Buttons: Save to device, Lock/Unlock settings, and Delete
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.Center
                        ) {
                            // 1. Save to device
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(24.dp))
                                    .background(Color.White.copy(alpha = 0.18f))
                                    .clickable {
                                        view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                                        Toast.makeText(context, "Memory saved to your device album! 📸", Toast.LENGTH_SHORT).show()
                                    }
                                    .padding(horizontal = 14.dp, vertical = 10.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(text = "📥", fontSize = 15.sp)
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(text = "Save", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                                }
                            }

                            Spacer(modifier = Modifier.width(10.dp))

                            // 2. Lock / Lock Settings Button
                            val memoryIsLocked = memory.isLocked || memory.type == MemoryType.LOCKED
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(24.dp))
                                    .background(
                                        if (memoryIsLocked) colors.accent.copy(alpha = 0.35f)
                                        else Color.White.copy(alpha = 0.18f)
                                    )
                                    .border(
                                        1.dp,
                                        if (memoryIsLocked) colors.accent else Color.White.copy(alpha = 0.3f),
                                        RoundedCornerShape(24.dp)
                                    )
                                    .clickable {
                                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                        if (memoryIsLocked) {
                                            changePinMemory = memory
                                        } else {
                                            lockingMemory = memory
                                        }
                                    }
                                    .padding(horizontal = 14.dp, vertical = 10.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(text = if (memoryIsLocked) "⚙️" else "🔒", fontSize = 15.sp)
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = if (memoryIsLocked) "PIN Settings" else "Lock Memory",
                                        color = Color.White,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.width(10.dp))

                            // 3. Delete (Protected by PIN if locked!)
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(24.dp))
                                    .background(Color(0xFFD64545).copy(alpha = 0.25f))
                                    .border(1.dp, Color(0xFFD64545).copy(alpha = 0.5f), RoundedCornerShape(24.dp))
                                    .clickable {
                                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                        if (memoryIsLocked) {
                                            // Edge Case: Memory deleted while locked requires PIN verification!
                                            deleteLockedMemory = memory
                                        } else {
                                            onRequestDelete(memory)
                                        }
                                    }
                                    .padding(horizontal = 14.dp, vertical = 10.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(text = "🗑️", fontSize = 15.sp)
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(text = "Delete", color = Color(0xFFFF8D8D), fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                                }
                            }
                        }
                    }
                }
            }
        }

        // Close top button
        Box(
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(28.dp)
                .size(44.dp)
                .clip(CircleShape)
                .background(Color.White.copy(alpha = 0.2f))
                .clickable { onDismiss() },
            contentAlignment = Alignment.Center
        ) {
            Text(text = "✕", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
        }

        // Counter Indicator (e.g. "3 / 12")
        Box(
            modifier = Modifier
                .align(Alignment.TopCenter)
                .padding(top = 36.dp)
                .clip(RoundedCornerShape(999.dp))
                .background(Color.Black.copy(alpha = 0.5f))
                .padding(horizontal = 12.dp, vertical = 4.dp)
        ) {
            Text(
                text = "${pagerState.currentPage + 1} / ${memories.size}",
                color = Color.White,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold
            )
        }

        // 1. Lock Memory Dialog
        lockingMemory?.let { mem ->
            LockMemoryDialog(
                memory = mem,
                partnerName = partnerName,
                onDismiss = { lockingMemory = null },
                onLockConfirmed = { newPin ->
                    mem.isLocked = true
                    mem.pinRequired = true
                    mem.unlockPin = newPin
                    mem.failedPinAttempts = 0
                    mem.lockedUntilMillis = 0L
                    unlockedIds.value = unlockedIds.value - mem.id
                    lockingMemory = null
                    Toast.makeText(context, "Memory locked 🔒", Toast.LENGTH_SHORT).show()
                    LockedLetterNotificationManager.sendMemoryLockedNotification(
                        context = context,
                        partnerName = partnerName,
                        memoryTitle = mem.title ?: mem.caption ?: "Private Memory"
                    )
                }
            )
        }

        // 2. Unlock Memory Dialog
        unlockingMemory?.let { mem ->
            UnlockMemoryDialog(
                memory = mem,
                partnerName = partnerName,
                onDismiss = { unlockingMemory = null },
                onUnlocked = {
                    unlockedIds.value = unlockedIds.value + mem.id
                    unlockingMemory = null
                    Toast.makeText(context, "Memory unlocked! ✨", Toast.LENGTH_SHORT).show()
                    LockedLetterNotificationManager.sendMemoryUnlockedNotification(
                        context = context,
                        partnerName = partnerName,
                        memoryTitle = mem.title ?: mem.caption ?: "Private Memory"
                    )
                },
                onChangeOrRemoveLockRequested = {
                    unlockingMemory = null
                    changePinMemory = mem
                }
            )
        }

        // 3. Change or Remove PIN Dialog
        changePinMemory?.let { mem ->
            ChangeOrRemovePinDialog(
                memory = mem,
                partnerName = partnerName,
                onDismiss = { changePinMemory = null },
                onPinChanged = { newPin ->
                    mem.unlockPin = newPin
                    mem.failedPinAttempts = 0
                    mem.lockedUntilMillis = 0L
                    changePinMemory = null
                    Toast.makeText(context, "Mutual PIN updated! 🔑", Toast.LENGTH_SHORT).show()
                },
                onLockRemoved = {
                    mem.isLocked = false
                    mem.pinRequired = false
                    unlockedIds.value = unlockedIds.value + mem.id
                    changePinMemory = null
                    Toast.makeText(context, "Lock permanently removed 🔓", Toast.LENGTH_SHORT).show()
                }
            )
        }

        // 4. Confirm Deletion of Locked Memory
        deleteLockedMemory?.let { mem ->
            ConfirmLockedDeletionDialog(
                memory = mem,
                onDismiss = { deleteLockedMemory = null },
                onVerifiedToDelete = {
                    val target = deleteLockedMemory!!
                    deleteLockedMemory = null
                    onRequestDelete(target)
                }
            )
        }
    }
}
