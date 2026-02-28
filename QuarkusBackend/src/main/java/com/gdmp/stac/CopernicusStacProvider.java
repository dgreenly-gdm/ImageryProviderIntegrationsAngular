package com.gdmp.stac;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gdmp.model.dto.CatalogSearchRequest;
import com.gdmp.model.dto.CatalogSearchResponse;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * STAC provider implementation for Copernicus Data Space.
 * Connects to https://catalogue.dataspace.copernicus.eu/stac/ to search
 * Sentinel-1, Sentinel-2, and other ESA satellite imagery collections.
 *
 * Uses java.net.http.HttpClient with Jackson for JSON serialization/deserialization.
 */
@ApplicationScoped
public class CopernicusStacProvider implements StacProvider {

    private static final Logger LOG = Logger.getLogger(CopernicusStacProvider.class);
    private static final Duration REQUEST_TIMEOUT = Duration.ofSeconds(30);

    @ConfigProperty(name = "copernicus.stac.base-url",
                    defaultValue = "https://catalogue.dataspace.copernicus.eu/stac")
    String baseUrl;

    private HttpClient httpClient;
    private ObjectMapper objectMapper;

    @PostConstruct
    void init() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();

        this.objectMapper = new ObjectMapper();
        this.objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Override
    public String getProviderName() {
        return "Copernicus Data Space";
    }

    @Override
    public CatalogSearchResponse search(CatalogSearchRequest params) {
        try {
            Map<String, Object> requestBody = buildSearchRequestBody(params);
            String jsonBody = objectMapper.writeValueAsString(requestBody);

            LOG.infof("Searching Copernicus STAC: %s/search", baseUrl);
            LOG.debugf("Request body: %s", jsonBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/search"))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/geo+json")
                    .timeout(REQUEST_TIMEOUT)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                LOG.errorf("Copernicus STAC search failed with status %d: %s",
                        response.statusCode(), response.body());
                return CatalogSearchResponse.of(List.of(), 0);
            }

            return parseSearchResponse(response.body());

        } catch (Exception e) {
            LOG.errorf(e, "Error searching Copernicus STAC catalog");
            return CatalogSearchResponse.of(List.of(), 0);
        }
    }

    @Override
    public List<String> getCollections() {
        try {
            LOG.infof("Fetching collections from Copernicus STAC: %s/collections", baseUrl);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/collections"))
                    .header("Accept", "application/json")
                    .timeout(REQUEST_TIMEOUT)
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                LOG.errorf("Copernicus STAC collections request failed with status %d: %s",
                        response.statusCode(), response.body());
                return List.of();
            }

            return parseCollectionsResponse(response.body());

        } catch (Exception e) {
            LOG.errorf(e, "Error fetching Copernicus STAC collections");
            return List.of();
        }
    }

    /**
     * Builds the JSON request body for the STAC /search endpoint.
     */
    private Map<String, Object> buildSearchRequestBody(CatalogSearchRequest params) {
        Map<String, Object> body = new HashMap<>();

        if (params.bbox() != null && params.bbox().length == 4) {
            body.put("bbox", params.bbox());
        }

        if (params.datetime() != null && !params.datetime().isBlank()) {
            body.put("datetime", params.datetime());
        }

        if (params.collections() != null && params.collections().length > 0) {
            body.put("collections", params.collections());
        }

        body.put("limit", params.limit());

        return body;
    }

    /**
     * Parses the STAC FeatureCollection response into a CatalogSearchResponse.
     */
    private CatalogSearchResponse parseSearchResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);

        // Parse features array into StacItem list
        List<StacItem> items = new ArrayList<>();
        JsonNode features = root.get("features");
        if (features != null && features.isArray()) {
            for (JsonNode feature : features) {
                StacItem item = objectMapper.treeToValue(feature, StacItem.class);
                items.add(item);
            }
        }

        // Extract numberMatched from context if available
        int numberMatched = items.size();
        JsonNode context = root.get("context");
        if (context != null && context.has("matched")) {
            numberMatched = context.get("matched").asInt(items.size());
        }
        // Some STAC APIs use numberMatched at root level
        JsonNode matchedNode = root.get("numberMatched");
        if (matchedNode != null) {
            numberMatched = matchedNode.asInt(items.size());
        }

        LOG.infof("Copernicus STAC search returned %d items (total matched: %d)",
                items.size(), numberMatched);

        return CatalogSearchResponse.of(items, numberMatched);
    }

    /**
     * Parses the /collections response to extract collection IDs.
     */
    private List<String> parseCollectionsResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        List<String> collectionIds = new ArrayList<>();

        JsonNode collections = root.get("collections");
        if (collections != null && collections.isArray()) {
            for (JsonNode collection : collections) {
                JsonNode idNode = collection.get("id");
                if (idNode != null) {
                    collectionIds.add(idNode.asText());
                }
            }
        }

        LOG.infof("Copernicus STAC returned %d collections", collectionIds.size());
        return collectionIds;
    }
}
