import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Subscription name is required'],
        minLength: 2,
        maxLength: 100
    },
    price: {
        type: Number,
        required: [true, 'Subscription password is required'],
        min: [0, 'Price must be greater than zero'],
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'INR'],
        default: 'USD'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    category: {
        type: String,
        enum: ['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other']
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: true,
        validate: function (value) {
            return value <= new Date();
        },
        message: 'Start date must be in the past'
    },
    renewalDate: {
        type: Date,
        // required: true,
        validate: function (value) {
            return value > this.startDate;
        },
        message: 'Renewal date must be after start date'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true

    }
}, { timestamps: true });

// Auto calculates renewal date:
subscriptionSchema.pre('save', async function () {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        }
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }
    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;