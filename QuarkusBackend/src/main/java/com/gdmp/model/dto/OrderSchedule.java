package com.gdmp.model.dto;

/**
 * Schedule parameters for an order, including timing, priority, and recurrence.
 */
public record OrderSchedule(
        /** Human-readable name for the order */
        String orderName,

        /** Collection start date in ISO 8601 format */
        String startDate,

        /** Collection end date in ISO 8601 format */
        String endDate,

        /** Order expiration date in ISO 8601 format */
        String expirationDate,

        /** Priority level: "Routine", "Priority", "Urgent", "Flash" */
        String priority,

        /** Whether the order recurs on a schedule */
        boolean recurring,

        /** Recurrence frequency: "Daily", "Weekly", "Biweekly", "Monthly" */
        String frequency,

        /** Day of week for recurring orders, e.g. "Monday" */
        String dayOfWeek,

        /** Preferred delivery window, e.g. "0600-1800 UTC" */
        String deliveryWindow
) {}
