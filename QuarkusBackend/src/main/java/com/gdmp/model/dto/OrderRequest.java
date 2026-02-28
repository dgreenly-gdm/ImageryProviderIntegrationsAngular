package com.gdmp.model.dto;

/**
 * Request DTO for creating a new order.
 * Combines product selection with configuration and schedule parameters.
 */
public record OrderRequest(
        /** Product family identifier, e.g. "imagery" */
        String familyId,

        /** Product type identifier within the family, e.g. "electro-optical" */
        String productTypeId,

        /** Product tier identifier, e.g. "precision-pinpoint" */
        String tierId,

        /** Sensor and delivery configuration */
        OrderConfiguration configuration,

        /** Timing and recurrence schedule */
        OrderSchedule schedule
) {}
