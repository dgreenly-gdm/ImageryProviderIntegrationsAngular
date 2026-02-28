package com.gdmp.api;

import com.gdmp.model.dto.CatalogSearchRequest;
import com.gdmp.model.dto.CatalogSearchResponse;
import com.gdmp.service.CatalogService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

/**
 * REST resource for STAC catalog search and collection discovery.
 * Provides endpoints to search across configured STAC providers
 * and list available satellite imagery collections.
 */
@Path("/api/catalog")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Catalog", description = "STAC catalog search and collection discovery")
public class CatalogResource {

    @Inject
    CatalogService catalogService;

    /**
     * Searches the STAC catalog with spatial, temporal, and collection filters.
     *
     * @param request search parameters including bbox, datetime, collections, and limit
     * @return matching STAC items with result counts
     */
    @POST
    @Path("/search")
    @Operation(
            summary = "Search STAC catalog",
            description = "Searches the configured STAC providers using bounding box, datetime range, "
                    + "collection filters, and result limit. Returns GeoJSON FeatureCollection-style results."
    )
    @RequestBody(
            description = "STAC search parameters",
            content = @Content(schema = @Schema(implementation = CatalogSearchRequest.class))
    )
    @APIResponse(
            responseCode = "200",
            description = "Search results with matched STAC items",
            content = @Content(schema = @Schema(implementation = CatalogSearchResponse.class))
    )
    public Response search(CatalogSearchRequest request) {
        CatalogSearchResponse response = catalogService.search(request);
        return Response.ok(response).build();
    }

    /**
     * Lists all available STAC collections from configured providers.
     *
     * @return list of collection identifier strings
     */
    @GET
    @Path("/collections")
    @Operation(
            summary = "List available STAC collections",
            description = "Returns the identifiers of all available STAC collections "
                    + "from configured catalog providers (e.g., Copernicus Data Space)."
    )
    @APIResponse(
            responseCode = "200",
            description = "List of available collection IDs",
            content = @Content(schema = @Schema(implementation = String[].class))
    )
    public Response getCollections() {
        List<String> collections = catalogService.getCollections();
        return Response.ok(collections).build();
    }
}
