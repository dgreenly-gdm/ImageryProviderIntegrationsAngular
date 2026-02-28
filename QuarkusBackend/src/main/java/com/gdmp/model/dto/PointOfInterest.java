package com.gdmp.model.dto;

/**
 * Geographic point of interest for imagery orders.
 * Defines a circular area centered on a lat/lon coordinate.
 */
public record PointOfInterest(
        /** Latitude in WGS84 degrees (-90 to 90) */
        double latitude,

        /** Longitude in WGS84 degrees (-180 to 180) */
        double longitude,

        /** Radius around the point in kilometers */
        double radiusKm
) {}
