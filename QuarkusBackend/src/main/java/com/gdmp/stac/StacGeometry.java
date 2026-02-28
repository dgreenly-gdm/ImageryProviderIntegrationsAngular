package com.gdmp.stac;

import java.util.List;

/**
 * GeoJSON geometry representation for STAC items.
 * Typically a Polygon with coordinates as a list of linear rings,
 * where each ring is a list of [longitude, latitude] coordinate pairs.
 */
public class StacGeometry {

    private String type;
    private List<List<List<Double>>> coordinates;

    public StacGeometry() {
    }

    public StacGeometry(String type, List<List<List<Double>>> coordinates) {
        this.type = type;
        this.coordinates = coordinates;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<List<List<Double>>> getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(List<List<List<Double>>> coordinates) {
        this.coordinates = coordinates;
    }
}
