package com.gdmp.api;

import com.gdmp.model.dto.OrderRequest;
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
import org.jboss.logging.Logger;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * REST resource for order template management.
 * Templates are saved order configurations that can be reused to quickly
 * create new orders with pre-filled product selection, configuration, and schedule.
 * Uses an in-memory store as a stub implementation.
 */
@Path("/api/templates")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Templates", description = "Reusable order template management")
public class TemplateResource {

    private static final Logger LOG = Logger.getLogger(TemplateResource.class);

    /** In-memory template store keyed by template ID. */
    private final Map<String, TemplateResponse> templates = new ConcurrentHashMap<>();

    /**
     * Saves a new order template from an order request.
     *
     * @param request order configuration to save as a template
     * @return the saved template with assigned ID and timestamps
     */
    @POST
    @Operation(
            summary = "Save an order template",
            description = "Saves the provided order configuration as a reusable template. "
                    + "Templates store product selection, configuration, and schedule preferences."
    )
    @RequestBody(
            description = "Order configuration to save as a template",
            content = @Content(schema = @Schema(implementation = OrderRequest.class))
    )
    @APIResponse(
            responseCode = "201",
            description = "Template saved successfully",
            content = @Content(schema = @Schema(implementation = TemplateResponse.class))
    )
    public Response saveTemplate(OrderRequest request) {
        String templateId = "TPL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String createdAt = Instant.now().toString();

        // Derive a template name from the schedule order name, or generate one
        String templateName = (request.schedule() != null && request.schedule().orderName() != null)
                ? request.schedule().orderName()
                : request.familyId() + " - " + request.productTypeId() + " template";

        TemplateResponse template = new TemplateResponse(
                templateId,
                templateName,
                request,
                createdAt,
                createdAt
        );

        templates.put(templateId, template);
        LOG.infof("Template saved: %s (%s)", templateId, templateName);

        return Response.status(Response.Status.CREATED).entity(template).build();
    }

    /**
     * Lists all saved order templates.
     *
     * @return list of all templates
     */
    @GET
    @Operation(
            summary = "List all order templates",
            description = "Returns all saved order templates that can be used to quickly create new orders."
    )
    @APIResponse(
            responseCode = "200",
            description = "List of all order templates",
            content = @Content(schema = @Schema(implementation = TemplateResponse[].class))
    )
    public Response listTemplates() {
        List<TemplateResponse> templateList = List.copyOf(templates.values());
        return Response.ok(templateList).build();
    }

    /**
     * Response DTO for saved order templates.
     */
    public record TemplateResponse(
            /** Server-assigned template identifier */
            String templateId,

            /** Human-readable template name */
            String name,

            /** The saved order configuration */
            OrderRequest orderRequest,

            /** ISO 8601 creation timestamp */
            String createdAt,

            /** ISO 8601 last-modified timestamp */
            String updatedAt
    ) {}
}
