package com.gdmp.service;

import com.gdmp.model.dto.ProductFamily;
import com.gdmp.model.dto.ProductTier;
import com.gdmp.model.dto.ProductType;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import org.jboss.logging.Logger;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service providing static product family definitions for the Global Data Marketplace.
 * Currently returns the Imagery family with its 5 types and associated tiers.
 * Additional families (Analytic Reports, SDA, Subscriptions, Terrestrial RF) can be
 * added by extending the initialization logic.
 */
@ApplicationScoped
public class FamilyService {

    private static final Logger LOG = Logger.getLogger(FamilyService.class);

    private final Map<String, ProductFamily> families = new LinkedHashMap<>();

    @PostConstruct
    void init() {
        LOG.info("Initializing product family definitions");
        initImageryFamily();
        initAnalyticReportsFamily();
        initSdaFamily();
        initSubscriptionsFamily();
        initTerrestrialRfFamily();
        LOG.infof("Loaded %d product families", families.size());
    }

    /**
     * Returns all product families with their complete type/tier hierarchy.
     *
     * @return list of all product families
     */
    public List<ProductFamily> getAllFamilies() {
        return new ArrayList<>(families.values());
    }

    /**
     * Returns a single product family by ID, including its types and tiers.
     *
     * @param familyId the family identifier
     * @return the product family, or empty if not found
     */
    public Optional<ProductFamily> getFamilyById(String familyId) {
        return Optional.ofNullable(families.get(familyId));
    }

    /**
     * Returns the product types for a given family.
     *
     * @param familyId the family identifier
     * @return list of product types, or empty list if family not found
     */
    public List<ProductType> getProductTypes(String familyId) {
        ProductFamily family = families.get(familyId);
        return family != null ? family.types() : List.of();
    }

    // ==================== Imagery Family ====================

    private void initImageryFamily() {
        List<ProductTier> standardImageryTiers = List.of(
                new ProductTier("precision-pinpoint", "Precision Pinpoint",
                        "Highest resolution imagery for precision targeting and detailed site analysis",
                        "0.3-0.5m", "3-6 hours", 12.50),
                new ProductTier("tactical", "Tactical",
                        "High resolution imagery for tactical planning and area surveillance",
                        "0.5-1.0m", "6-12 hours", 8.00),
                new ProductTier("operational", "Operational",
                        "Medium resolution imagery for operational awareness and change detection",
                        "1.0-2.5m", "12-24 hours", 4.50),
                new ProductTier("theater", "Theater",
                        "Wide-area coverage imagery for theater-level situational awareness",
                        "2.5-5.0m", "24-48 hours", 2.00)
        );

        List<ProductTier> satToSatTiers = List.of(
                new ProductTier("sat-leo", "LEO",
                        "Low Earth Orbit satellite-to-satellite imaging for close-range characterization",
                        "N/A", "6-12 hours", 25.00),
                new ProductTier("sat-meo", "MEO",
                        "Medium Earth Orbit satellite-to-satellite imaging for navigation constellation monitoring",
                        "N/A", "12-24 hours", 30.00),
                new ProductTier("sat-geo", "GEO",
                        "Geostationary orbit satellite-to-satellite imaging for high-value asset characterization",
                        "N/A", "24-48 hours", 45.00),
                new ProductTier("sat-heo-cislunar", "HEO-Cislunar",
                        "Highly elliptical and cislunar orbit imaging for deep space object characterization",
                        "N/A", "48-72 hours", 75.00)
        );

        List<ProductTier> skyImageryTiers = List.of(
                new ProductTier("sky-leo-detect", "LEO Detect",
                        "Low Earth Orbit detection and tracking from ground-based sky imaging sensors",
                        "N/A", "1-3 hours", 5.00),
                new ProductTier("sky-meo-monitor", "MEO Monitor",
                        "Medium Earth Orbit monitoring using wide-field sky imaging arrays",
                        "N/A", "3-6 hours", 8.00),
                new ProductTier("sky-geo-surveillance", "GEO Surveillance",
                        "Geostationary belt surveillance with persistent sky imaging coverage",
                        "N/A", "6-12 hours", 15.00),
                new ProductTier("sky-deep-space", "Deep Space",
                        "Deep space object detection beyond GEO using high-sensitivity sky imagers",
                        "N/A", "12-24 hours", 20.00),
                new ProductTier("sky-all-regime", "All-Regime",
                        "Comprehensive sky imaging coverage across all orbital regimes",
                        "N/A", "24-48 hours", 35.00)
        );

        List<ProductType> imageryTypes = List.of(
                new ProductType("electro-optical", "Electro-Optical (EO)",
                        "Visible-spectrum satellite imagery with sub-meter resolution for precision analysis",
                        "camera", standardImageryTiers),
                new ProductType("infrared", "Infrared (IR)",
                        "Thermal and near-infrared imagery for heat signature detection and night operations",
                        "thermometer", standardImageryTiers),
                new ProductType("sar", "Synthetic Aperture Radar (SAR)",
                        "All-weather, day/night radar imagery independent of cloud cover and illumination",
                        "radar", standardImageryTiers),
                new ProductType("sat-to-sat", "Satellite-to-Satellite",
                        "Space-based imaging of other satellites for characterization and proximity awareness",
                        "satellite", satToSatTiers),
                new ProductType("sky-imagery", "Sky Imagery",
                        "Ground-based optical sensors imaging space objects across orbital regimes",
                        "telescope", skyImageryTiers)
        );

        int productCount = imageryTypes.stream()
                .mapToInt(t -> t.tiers().size())
                .sum();

        families.put("imagery", new ProductFamily(
                "imagery", "Imagery", "#3B82F6",
                "Satellite and ground-based imagery products spanning electro-optical, infrared, SAR, "
                        + "satellite-to-satellite, and sky imaging across multiple resolution tiers",
                productCount, imageryTypes));
    }

    // ==================== Analytic Reports Family ====================

    private void initAnalyticReportsFamily() {
        List<ProductTier> analyticTiers = List.of(
                new ProductTier("flash-report", "Flash Report",
                        "Rapid initial assessment with key findings within 24 hours",
                        "N/A", "24 hours", 0.0),
                new ProductTier("standard-report", "Standard Report",
                        "Comprehensive analysis covering 3-5 disciplines with moderate depth",
                        "N/A", "7 days", 0.0),
                new ProductTier("deep-analysis", "Deep Analysis",
                        "In-depth multi-discipline assessment with extended research and correlation",
                        "N/A", "14 days", 0.0),
                new ProductTier("deep-fusion", "Deep Fusion Report",
                        "Maximum-depth fused analysis across all 7+ disciplines with 28-day turnaround",
                        "N/A", "28 days", 0.0)
        );

        List<ProductType> reportTypes = List.of(
                new ProductType("site-assessment", "Site Assessment",
                        "Detailed analysis of a specific geographic site or facility",
                        "map-pin", analyticTiers),
                new ProductType("activity-monitoring", "Activity Monitoring",
                        "Temporal analysis of activity patterns and changes at locations of interest",
                        "activity", analyticTiers),
                new ProductType("threat-assessment", "Threat Assessment",
                        "Evaluation of potential threats based on multi-source intelligence fusion",
                        "shield", analyticTiers)
        );

        int productCount = reportTypes.stream()
                .mapToInt(t -> t.tiers().size())
                .sum();

        families.put("analytic-reports", new ProductFamily(
                "analytic-reports", "Analytic Reports", "#10B981",
                "Multi-discipline intelligence analysis products ranging from flash reports to deep fusion assessments",
                productCount, reportTypes));
    }

    // ==================== Space Domain Awareness Family ====================

    private void initSdaFamily() {
        List<ProductTier> orbitRegimeTiers = List.of(
                new ProductTier("sda-leo", "LEO",
                        "Low Earth Orbit space domain awareness coverage (200-2000km altitude)",
                        "N/A", "1-6 hours", 0.0),
                new ProductTier("sda-meo", "MEO",
                        "Medium Earth Orbit space domain awareness coverage (2000-35786km altitude)",
                        "N/A", "6-12 hours", 0.0),
                new ProductTier("sda-geo", "GEO",
                        "Geostationary orbit space domain awareness coverage (35786km altitude)",
                        "N/A", "12-24 hours", 0.0),
                new ProductTier("sda-cislunar", "Cislunar",
                        "Cislunar space domain awareness extending beyond GEO to lunar distance",
                        "N/A", "24-48 hours", 0.0)
        );

        List<ProductType> sdaTypes = List.of(
                new ProductType("conjunction-reports", "Conjunction Reports",
                        "Predicted close approaches between space objects with collision probability assessment",
                        "alert-triangle", orbitRegimeTiers),
                new ProductType("elsets", "Element Sets (Elsets)",
                        "Orbital element sets for satellite tracking and propagation",
                        "orbit", orbitRegimeTiers),
                new ProductType("maneuver-detection", "Maneuver Detection",
                        "Detection and characterization of satellite orbital maneuvers",
                        "move", orbitRegimeTiers),
                new ProductType("observations", "Observations",
                        "Multi-phenomenology observation products including EO, radar, and RF sensors",
                        "eye", orbitRegimeTiers),
                new ProductType("state-vectors", "State Vectors",
                        "High-precision position and velocity state vectors for tracked objects",
                        "crosshair", orbitRegimeTiers)
        );

        int productCount = sdaTypes.stream()
                .mapToInt(t -> t.tiers().size())
                .sum();

        families.put("sda", new ProductFamily(
                "sda", "Space Domain Awareness", "#7C3AED",
                "Comprehensive space situational awareness products including tracking, characterization, "
                        + "and threat assessment across all orbital regimes",
                productCount, sdaTypes));
    }

    // ==================== Subscriptions Family ====================

    private void initSubscriptionsFamily() {
        List<ProductTier> subscriptionTiers = List.of(
                new ProductTier("sub-basic", "Basic",
                        "Standard subscription with daily updates and basic alerting",
                        "N/A", "Daily", 0.0),
                new ProductTier("sub-professional", "Professional",
                        "Enhanced subscription with hourly updates, advanced alerting, and API access",
                        "N/A", "Hourly", 0.0),
                new ProductTier("sub-enterprise", "Enterprise",
                        "Premium subscription with real-time streaming, custom integrations, and SLA guarantees",
                        "N/A", "Real-time", 0.0)
        );

        List<ProductType> subTypes = List.of(
                new ProductType("aircraft-signals", "Aircraft Signals",
                        "ADS-B and secondary radar signal collection for aircraft tracking",
                        "plane", subscriptionTiers),
                new ProductType("data-quality-monitoring", "Data Quality Monitoring",
                        "Continuous monitoring and scoring of data product quality metrics",
                        "check-circle", subscriptionTiers),
                new ProductType("weather-global", "Weather (Global)",
                        "Global weather observation and forecast data for mission planning",
                        "cloud", subscriptionTiers),
                new ProductType("weather-space", "Weather (Space)",
                        "Space weather monitoring including solar activity and geomagnetic conditions",
                        "sun", subscriptionTiers),
                new ProductType("weather-terrestrial", "Weather (Terrestrial)",
                        "Regional terrestrial weather observation and mesoscale forecasting",
                        "cloud-rain", subscriptionTiers),
                new ProductType("maritime-vessel-signals", "Maritime Vessel Signals",
                        "AIS and RF-based maritime vessel tracking and identification",
                        "ship", subscriptionTiers),
                new ProductType("object-characterization", "Object Characterization",
                        "Detailed physical characterization of resident space objects",
                        "box", subscriptionTiers),
                new ProductType("rf-environment", "RF Environment",
                        "Radio frequency environment monitoring and spectrum analysis",
                        "radio", subscriptionTiers),
                new ProductType("sgi-indices", "SGI Indices",
                        "Space governance and sustainability indices for responsible space operations",
                        "bar-chart", subscriptionTiers),
                new ProductType("satellite-beam-coverage", "Satellite Beam Coverage",
                        "Real-time and predicted satellite communication beam footprint mapping",
                        "wifi", subscriptionTiers),
                new ProductType("satellite-metadata-pairs", "Satellite Metadata (PAIRS)",
                        "Paired satellite metadata and association data for constellation analysis",
                        "database", subscriptionTiers),
                new ProductType("space-threat-visualization", "Space Threat Visualization",
                        "Visual threat assessment and situation display for space operations centers",
                        "monitor", subscriptionTiers)
        );

        int productCount = subTypes.stream()
                .mapToInt(t -> t.tiers().size())
                .sum();

        families.put("subscriptions", new ProductFamily(
                "subscriptions", "Subscriptions", "#F59E0B",
                "Continuous data subscription products spanning aircraft, maritime, weather, space domain, "
                        + "and RF environment monitoring",
                productCount, subTypes));
    }

    // ==================== Terrestrial RF Family ====================

    private void initTerrestrialRfFamily() {
        List<ProductTier> rfGeoTiers = List.of(
                new ProductTier("rf-geo-tactical", "Tactical",
                        "Tactical RF geolocation with high accuracy in limited area of operations",
                        "N/A", "1-3 hours", 0.0),
                new ProductTier("rf-geo-operational", "Operational",
                        "Operational RF geolocation covering regional area of interest",
                        "N/A", "3-6 hours", 0.0),
                new ProductTier("rf-geo-theater", "Theater",
                        "Theater-wide RF geolocation for broad area spectrum monitoring",
                        "N/A", "6-12 hours", 0.0)
        );

        List<ProductTier> gnssTiers = List.of(
                new ProductTier("gnss-gps", "GPS",
                        "GPS-only GNSS monitoring and interference detection",
                        "N/A", "Continuous", 0.0),
                new ProductTier("gnss-dual", "Dual Constellation",
                        "Dual-constellation GNSS monitoring (GPS + GLONASS or Galileo)",
                        "N/A", "Continuous", 0.0),
                new ProductTier("gnss-multi", "Multi Constellation",
                        "Multi-constellation GNSS monitoring (GPS + GLONASS + Galileo + BeiDou)",
                        "N/A", "Continuous", 0.0),
                new ProductTier("gnss-premium", "Premium",
                        "Premium all-constellation GNSS monitoring with advanced interference characterization",
                        "N/A", "Continuous", 0.0)
        );

        List<ProductType> rfTypes = List.of(
                new ProductType("rf-geolocation", "RF Geolocation",
                        "Radio frequency emitter geolocation across tactical, operational, and theater scales",
                        "crosshair", rfGeoTiers),
                new ProductType("gnss-monitoring", "GNSS Monitoring",
                        "Global navigation satellite system monitoring and interference detection",
                        "navigation", gnssTiers)
        );

        int productCount = rfTypes.stream()
                .mapToInt(t -> t.tiers().size())
                .sum();

        families.put("terrestrial-rf", new ProductFamily(
                "terrestrial-rf", "Terrestrial RF", "#E11D48",
                "Ground-based RF sensing products for emitter geolocation and GNSS monitoring",
                productCount, rfTypes));
    }
}
