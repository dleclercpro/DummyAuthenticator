"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = require("../../libs/math");
const TimeTypes_1 = require("../../types/TimeTypes");
class TimeDurationComparator {
    static compare(a, b) {
        if (a.toMs().getAmount() < b.toMs().getAmount())
            return -1;
        if (a.toMs().getAmount() > b.toMs().getAmount())
            return 1;
        return 0;
    }
}
class TimeDuration {
    constructor(amount, unit) {
        this.amount = amount;
        this.unit = unit;
    }
    isZero() {
        return this.amount === 0;
    }
    getAmount() {
        return this.amount;
    }
    getUnit() {
        return this.unit;
    }
    add(other) {
        return new TimeDuration(this.toMs().getAmount() + other.toMs().getAmount(), TimeTypes_1.TimeUnit.Millisecond);
    }
    subtract(other) {
        return new TimeDuration(this.toMs().getAmount() - other.toMs().getAmount(), TimeTypes_1.TimeUnit.Millisecond);
    }
    compare(other) {
        return TimeDurationComparator.compare(this, other);
    }
    smallerThanOrEquals(other) {
        return this.smallerThan(other) || this.equals(other);
    }
    smallerThan(other) {
        return this.compare(other) === -1;
    }
    equals(other) {
        return this.compare(other) === 0;
    }
    greaterThan(other) {
        return this.compare(other) === 1;
    }
    greaterThanOrEquals(other) {
        return this.greaterThan(other) || this.equals(other);
    }
    format() {
        const duration = this.toMs();
        let amount = duration.getAmount();
        let unit = TimeTypes_1.TimeUnit.Millisecond;
        // ms -> s
        if (amount >= 1000) {
            amount /= 1000;
            unit = TimeTypes_1.TimeUnit.Second;
            // s -> m
            if (amount >= 60) {
                amount /= 60;
                unit = TimeTypes_1.TimeUnit.Minute;
                // m -> h
                if (amount >= 60) {
                    amount /= 60;
                    unit = TimeTypes_1.TimeUnit.Hour;
                    // h -> d
                    if (amount >= 24) {
                        amount /= 24;
                        unit = TimeTypes_1.TimeUnit.Day;
                    }
                }
            }
        }
        return `${(0, math_1.round)(amount, 1)}${unit}`;
    }
    to(unit) {
        let amount = 0;
        const ms = this.toMs().getAmount();
        switch (unit) {
            case TimeTypes_1.TimeUnit.Day:
                amount = ms / 24 / 3600 / 1000;
                break;
            case TimeTypes_1.TimeUnit.Hour:
                amount = ms / 3600 / 1000;
                break;
            case TimeTypes_1.TimeUnit.Minute:
                amount = ms / 60 / 1000;
                break;
            case TimeTypes_1.TimeUnit.Second:
                amount = ms / 1000;
                break;
            case TimeTypes_1.TimeUnit.Millisecond:
                amount = ms;
                break;
            default:
                throw new Error('Invalid time unit.');
        }
        return new TimeDuration(amount, unit);
    }
    toMs() {
        let amount = 0;
        switch (this.unit) {
            case TimeTypes_1.TimeUnit.Day:
                amount = this.amount * 24 * 3600 * 1000;
                break;
            case TimeTypes_1.TimeUnit.Hour:
                amount = this.amount * 3600 * 1000;
                break;
            case TimeTypes_1.TimeUnit.Minute:
                amount = this.amount * 60 * 1000;
                break;
            case TimeTypes_1.TimeUnit.Second:
                amount = this.amount * 1000;
                break;
            case TimeTypes_1.TimeUnit.Millisecond:
                amount = this.amount;
                break;
            default:
                throw new Error('Invalid time unit.');
        }
        return new TimeDuration(amount, TimeTypes_1.TimeUnit.Millisecond);
    }
}
exports.default = TimeDuration;
