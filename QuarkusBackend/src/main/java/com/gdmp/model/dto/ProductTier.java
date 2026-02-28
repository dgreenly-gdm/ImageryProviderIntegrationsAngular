package com.gdmp.model.dto;

/**
 * Represents a specific product tier within a product type.
 * Tiers differentiate products by resolution, delivery speed, and pricing.
 */
public record ProductTier(
        /** Unique tier identifier, e.g. "eo-precision-pinpoint" */
        String id,

        /** Display name, e.g. "Precision Pinpoint" */
        String name,

        /** Description of the tier's capabilities */
        String description,

        /** Ground sample distance range, e.g. "0.3-0.5m" */
        String gsdRange,

        /** Expected delivery time, e.g. "3-6 hours" */
        String deliveryTime,

        /** Price per square kilometer in USD */
        double pricePerSqKm
) {}
