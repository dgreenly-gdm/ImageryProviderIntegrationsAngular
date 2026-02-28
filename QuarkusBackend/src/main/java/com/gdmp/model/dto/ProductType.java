package com.gdmp.model.dto;

import java.util.List;

/**
 * Represents a product type within a product family.
 * Each type contains multiple tiers with varying capabilities and pricing.
 */
public record ProductType(
        /** Unique type identifier, e.g. "electro-optical" */
        String id,

        /** Display name, e.g. "Electro-Optical (EO)" */
        String name,

        /** Description of the product type */
        String description,

        /** Icon identifier for UI rendering */
        String icon,

        /** Available tiers within this product type */
        List<ProductTier> tiers
) {}
