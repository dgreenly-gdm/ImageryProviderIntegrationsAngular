package com.gdmp.stac;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

/**
 * Represents a single STAC (SpatioTemporal Asset Catalog) item.
 * Uses flexible Map types for properties and assets since STAC items
 * vary significantly by provider and collection.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class StacItem {

    private String id;
    private String type;
    private Map<String, Object> properties;
    private StacGeometry geometry;
    private Map<String, Object> assets;
    private String collection;
    private List<Map<String, Object>> links;

    @JsonProperty("stac_version")
    private String stacVersion;

    @JsonProperty("stac_extensions")
    private List<String> stacExtensions;

    private double[] bbox;

    public StacItem() {
    }

    public StacItem(String id, String type, Map<String, Object> properties,
                    StacGeometry geometry, Map<String, Object> assets,
                    String collection, List<Map<String, Object>> links) {
        this.id = id;
        this.type = type;
        this.properties = properties;
        this.geometry = geometry;
        this.assets = assets;
        this.collection = collection;
        this.links = links;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Map<String, Object> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, Object> properties) {
        this.properties = properties;
    }

    public StacGeometry getGeometry() {
        return geometry;
    }

    public void setGeometry(StacGeometry geometry) {
        this.geometry = geometry;
    }

    public Map<String, Object> getAssets() {
        return assets;
    }

    public void setAssets(Map<String, Object> assets) {
        this.assets = assets;
    }

    public String getCollection() {
        return collection;
    }

    public void setCollection(String collection) {
        this.collection = collection;
    }

    public List<Map<String, Object>> getLinks() {
        return links;
    }

    public void setLinks(List<Map<String, Object>> links) {
        this.links = links;
    }

    public String getStacVersion() {
        return stacVersion;
    }

    public void setStacVersion(String stacVersion) {
        this.stacVersion = stacVersion;
    }

    public List<String> getStacExtensions() {
        return stacExtensions;
    }

    public void setStacExtensions(List<String> stacExtensions) {
        this.stacExtensions = stacExtensions;
    }

    public double[] getBbox() {
        return bbox;
    }

    public void setBbox(double[] bbox) {
        this.bbox = bbox;
    }
}
