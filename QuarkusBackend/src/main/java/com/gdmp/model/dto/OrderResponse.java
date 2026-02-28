package com.gdmp.model.dto;

/**
 * Response DTO returned after order creation or retrieval.
 * Includes the server-assigned order ID, status, and timestamps.
 */
public record OrderResponse(
        /** Server-assigned unique order identifier */
        String orderId,

        /** Current order status: "Submitted", "Processing", "Completed", "Cancelled" */
        String status,

        /** Product family identifier */
        String familyId,

        /** Product type identifier */
        String productTypeId,

        /** Product tier identifier */
        String tierId,

        /** Order configuration details */
        OrderConfiguration configuration,

        /** Order schedule details */
        OrderSchedule schedule,

        /** ISO 8601 timestamp of order creation */
        String createdAt
) {}
