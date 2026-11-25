package com.ecommerce.ecommerce.config;

import lombok.extern.slf4j.Slf4j;
import com.ecommerce.ecommerce.Entity.Product;
import com.ecommerce.ecommerce.Repository.ProductRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Loads the product catalog (src/main/resources/seed/products.json) on startup.
 *
 * - Products already in the database (matched by "id", or by name for new ones) are only touched the
 *   first time, i.e. while they have no gallery images yet - so later edits are never overwritten.
 * - Gallery images are discovered from src/main/resources/static/product-images/<slug>-1.jpg, -2.jpg ...
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) throws Exception {
        Resource resource = new ClassPathResource("seed/products.json");
        if (!resource.exists()) {
            return;
        }
        JsonNode root;
        try (InputStream in = resource.getInputStream()) {
            root = objectMapper.readTree(in);
        }

        int created = 0;
        int updated = 0;
        for (JsonNode node : root) {
            String slug = text(node, "slug");
            List<String> images = imagesFor(slug);
            if (images.isEmpty()) {
                // No genuine photos: never show a wrong picture. Existing products lose their random
                // placeholder (picsum) image; new entries are simply not created.
                if (node.hasNonNull("id")) {
                    productRepository.findById(node.get("id").asLong()).ifPresent(p -> {
                        if (p.getImageUrl() != null && p.getImageUrl().contains("picsum.photos")) {
                            p.setImageUrl(null);
                            productRepository.save(p);
                        }
                    });
                }
                continue;
            }

            Product product = null;
            if (node.hasNonNull("id")) {
                product = productRepository.findById(node.get("id").asLong()).orElse(null);
            }
            if (product == null) {
                String name = text(node, "name");
                product = productRepository.findAll().stream()
                        .filter(p -> p.getName() != null && p.getName().equalsIgnoreCase(name))
                        .findFirst().orElse(null);
            }

            boolean isNew = product == null;
            if (isNew) {
                product = new Product();
            } else if (product.getImageUrls() != null
                    && product.getImageUrls().equals(String.join("|", images))
                    && !"ShopEase".equals(product.getBrand())) {
                continue; // already seeded and up to date (photos unchanged, brand correct)
            }

            apply(product, node, images);
            productRepository.save(product);
            if (isNew) created++; else updated++;
        }
        log.info("DataSeeder: {} products created, {} updated", created, updated);
    }

    private void apply(Product p, JsonNode n, List<String> images) {
        set(n, "name", p::setName);
        set(n, "brand", p::setBrand);
        set(n, "category", p::setCategory);
        set(n, "description", p::setDescription);
        set(n, "specifications", p::setSpecifications);
        set(n, "seller", p::setSeller);
        set(n, "distributor", p::setDistributor);
        set(n, "warranty", p::setWarranty);
        if (n.hasNonNull("price")) p.setPrice(BigDecimal.valueOf(n.get("price").asLong()));
        if (n.hasNonNull("mrp")) p.setMrp(BigDecimal.valueOf(n.get("mrp").asLong()));
        if (n.hasNonNull("quantity")) p.setQuantity(n.get("quantity").asInt());
        if (n.has("offers")) p.setOffers(join(n.get("offers"), ","));
        if (n.has("sizes")) p.setSizes(join(n.get("sizes"), ","));
        if (n.hasNonNull("sizeChart")) p.setSizeChart(n.get("sizeChart").toString());
        p.setImageUrls(String.join("|", images));
        p.setImageUrl(images.get(0));
    }

    private List<String> imagesFor(String slug) throws Exception {
        Resource[] found = new PathMatchingResourcePatternResolver()
                .getResources("classpath:static/product-images/" + slug + "-*.jpg");
        return Arrays.stream(found)
                .map(Resource::getFilename)
                .filter(f -> f != null && f.matches(java.util.regex.Pattern.quote(slug) + "-\\d+\\.jpg"))
                .sorted(Comparator.comparingInt(f -> Integer.parseInt(f.substring(slug.length() + 1, f.length() - 4))))
                .map(f -> "/product-images/" + f)
                .collect(Collectors.toList());
    }

    private static String text(JsonNode n, String field) {
        return n.hasNonNull(field) ? n.get(field).asText() : null;
    }

    private static void set(JsonNode n, String field, java.util.function.Consumer<String> setter) {
        if (n.hasNonNull(field)) setter.accept(n.get(field).asText());
    }

    private static String join(JsonNode array, String sep) {
        List<String> values = new ArrayList<>();
        StreamSupport.stream(array.spliterator(), false).forEach(v -> values.add(v.asText()));
        return values.isEmpty() ? null : String.join(sep, values);
    }
}
