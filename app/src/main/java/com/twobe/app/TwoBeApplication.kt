package com.twobe.app

import android.app.Application
import com.twobe.app.data.LockedLetterNotificationManager
import com.twobe.app.data.TwoBeAnalytics
import com.twobe.app.data.TwoBeNotificationManager

class TwoBeApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        TwoBeAnalytics.init(this)
        TwoBeNotificationManager.createAllNotificationChannels(this)
        LockedLetterNotificationManager.initNotificationChannels(this)
    }
}
