package com.gdmp.model.dto;

import java.util.List;

/**
 * Represents a top-level product family in the Global Data Marketplace.
 * Each family groups related product types under a common theme and color.
 */
public record ProductFamily(
        /** Unique family identifier, e.g. "imagery" */
        String id,

        /** Display name, e.g. "Imagery" */
        String name,

        /** Brand color hex code, e.g. "#3B82F6" */
        String color,

        /** Short description of the product family */
        String description,

        /** Total number of products across all types and tiers */
        int productCount,

        /** Product types within this family */
        List<ProductType> types
) {}
