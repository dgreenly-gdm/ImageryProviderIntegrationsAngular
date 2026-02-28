package com.gdmp.model.dto;

import java.util.List;

/**
 * Configuration parameters for an imagery order.
 * Contains sensor, processing, and delivery preferences.
 */
public record OrderConfiguration(
        /** Geographic point of interest defining the collection area */
        PointOfInterest poi,

        /** Maximum acceptable cloud cover percentage (0-100) */
        double cloudCoverMax,

        /** Requested spectral bands, e.g. ["Red", "Green", "Blue", "NIR"] */
        List<String> spectralBands,

        /** Output delivery format, e.g. "GeoTIFF", "NITF", "JPEG2000" */
        String deliveryFormat,

        /** Processing level, e.g. "Raw", "Orthorectified", "Pansharpened" */
        String processingLevel,

        /** Free-text notes or special instructions */
        String notes
) {}
