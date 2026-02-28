package com.gdmp.api;

import com.gdmp.model.dto.ProductFamily;
import com.gdmp.model.dto.ProductType;
import com.gdmp.service.FamilyService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;
import java.util.Optional;

/**
 * REST resource for product family browsing.
 * Provides endpoints to list all product families and drill down
 * into their type/tier hierarchies.
 */
@Path("/api/families")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Product Families", description = "Product family catalog and type/tier hierarchy")
public class FamilyResource {

    @Inject
    FamilyService familyService;

    /**
     * Returns all product families with their metadata and type/tier trees.
     *
     * @return list of all product families
     */
    @GET
    @Operation(
            summary = "List all product families",
            description = "Returns all product families with metadata including name, color, "
                    + "description, product count, and the complete type/tier hierarchy."
    )
    @APIResponse(
            responseCode = "200",
            description = "All product families",
            content = @Content(schema = @Schema(implementation = ProductFamily[].class))
    )
    public Response getAllFamilies() {
        List<ProductFamily> families = familyService.getAllFamilies();
        return Response.ok(families).build();
    }

    /**
     * Returns the product type/tier tree for a specific family.
     *
     * @param familyId the family identifier (e.g., "imagery", "sda")
     * @return list of product types with their tiers
     */
    @GET
    @Path("/{familyId}/products")
    @Operation(
            summary = "Get products for a family",
            description = "Returns the product type and tier tree for the specified product family. "
                    + "Each type contains a list of tiers with resolution, delivery time, and pricing."
    )
    @Parameter(
            name = "familyId",
            description = "Product family identifier (e.g., imagery, analytic-reports, sda, subscriptions, terrestrial-rf)",
            required = true
    )
    @APIResponse(
            responseCode = "200",
            description = "Product types and tiers for the family",
            content = @Content(schema = @Schema(implementation = ProductType[].class))
    )
    @APIResponse(
            responseCode = "404",
            description = "Product family not found"
    )
    public Response getProducts(@PathParam("familyId") String familyId) {
        Optional<ProductFamily> family = familyService.getFamilyById(familyId);

        if (family.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorMessage("Product family not found: " + familyId))
                    .build();
        }

        return Response.ok(family.get().types()).build();
    }

    /**
     * Simple error message record for API error responses.
     */
    record ErrorMessage(String message) {}
}
