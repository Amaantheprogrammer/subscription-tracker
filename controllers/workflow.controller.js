import { createRequire } from "module";
import dayjs from "dayjs";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

import Subscription from "../models/subscription.model.js";
import { sendReminderEmail } from "../utils/send-email.js";

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    // 1. Validate subscription exists and is active
    if (!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);

    // 2. Stop if the renewal date is already in the past
    if (renewalDate.isBefore(dayjs())) {
        console.log(`Subscription date has passed for subscription ${subscriptionId}. Stopping Workflow`);
        return;
    }

    // 3. Iterate through reminders using for...of to allow 'await'
    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        // Only sleep and trigger if the reminder date is in the future
        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
        }

        if (dayjs().isSame(reminderDate, 'day')) {
            // 4. Trigger the email step
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
        }

    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    });
}

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} at ${date}`);
    // Correct SDK method is context.sleepUntil
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);

        // This calls your Nodemailer utility
        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription
        });
    });
}