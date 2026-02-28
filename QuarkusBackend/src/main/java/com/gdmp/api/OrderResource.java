package com.gdmp.api;

import com.gdmp.model.dto.OrderRequest;
import com.gdmp.model.dto.OrderResponse;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
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
 * REST resource for order management.
 * Provides endpoints to create, list, and retrieve orders.
 * Uses an in-memory store as a stub implementation.
 */
@Path("/api/orders")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Orders", description = "Order creation and management")
public class OrderResource {

    private static final Logger LOG = Logger.getLogger(OrderResource.class);

    /** In-memory order store keyed by order ID. */
    private final Map<String, OrderResponse> orders = new ConcurrentHashMap<>();

    /**
     * Creates a new order from the given request.
     * Assigns a unique order ID, sets status to "Submitted", and stores it in memory.
     *
     * @param request order creation parameters
     * @return the created order with assigned ID and timestamps
     */
    @POST
    @Operation(
            summary = "Create a new order",
            description = "Creates a new imagery order with the specified product selection, "
                    + "configuration, and schedule. Returns the order with a server-assigned ID."
    )
    @RequestBody(
            description = "Order creation parameters",
            content = @Content(schema = @Schema(implementation = OrderRequest.class))
    )
    @APIResponse(
            responseCode = "201",
            description = "Order created successfully",
            content = @Content(schema = @Schema(implementation = OrderResponse.class))
    )
    public Response createOrder(OrderRequest request) {
        String orderId = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String createdAt = Instant.now().toString();

        OrderResponse order = new OrderResponse(
                orderId,
                "Submitted",
                request.familyId(),
                request.productTypeId(),
                request.tierId(),
                request.configuration(),
                request.schedule(),
                createdAt
        );

        orders.put(orderId, order);
        LOG.infof("Order created: %s (family=%s, type=%s, tier=%s)",
                orderId, request.familyId(), request.productTypeId(), request.tierId());

        return Response.status(Response.Status.CREATED).entity(order).build();
    }

    /**
     * Lists all orders in the in-memory store.
     *
     * @return list of all orders
     */
    @GET
    @Operation(
            summary = "List all orders",
            description = "Returns all orders currently stored in the system."
    )
    @APIResponse(
            responseCode = "200",
            description = "List of all orders",
            content = @Content(schema = @Schema(implementation = OrderResponse[].class))
    )
    public Response listOrders() {
        List<OrderResponse> orderList = List.copyOf(orders.values());
        return Response.ok(orderList).build();
    }

    /**
     * Retrieves a single order by its ID.
     *
     * @param id the order identifier
     * @return the order if found, or 404
     */
    @GET
    @Path("/{id}")
    @Operation(
            summary = "Get order by ID",
            description = "Retrieves the details of a specific order by its unique identifier."
    )
    @Parameter(
            name = "id",
            description = "Unique order identifier (e.g., ORD-A1B2C3D4)",
            required = true
    )
    @APIResponse(
            responseCode = "200",
            description = "Order details",
            content = @Content(schema = @Schema(implementation = OrderResponse.class))
    )
    @APIResponse(
            responseCode = "404",
            description = "Order not found"
    )
    public Response getOrder(@PathParam("id") String id) {
        OrderResponse order = orders.get(id);

        if (order == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorMessage("Order not found: " + id))
                    .build();
        }

        return Response.ok(order).build();
    }

    record ErrorMessage(String message) {}
}
