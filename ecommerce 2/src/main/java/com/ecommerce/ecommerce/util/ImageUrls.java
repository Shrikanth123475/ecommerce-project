package com.ecommerce.ecommerce.util;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Product images that live in this backend are stored as relative paths ("/product-images/x.jpg").
 * They are turned into absolute URLs using the address the client used to reach the backend, so
 * the same data works for localhost (web), 10.0.2.2 (Android emulator) and a LAN IP (real phone).
 */
public final class ImageUrls {

    private ImageUrls() {
    }

    public static String absolute(String url) {
        if (url == null || url.isBlank() || !url.startsWith("/")) {
            return url;
        }
        if (RequestContextHolder.getRequestAttributes() == null) {
            return url;
        }
        return ServletUriComponentsBuilder.fromCurrentContextPath().path(url).toUriString();
    }

    /** "a|b|c" -> list of absolute URLs. */
    public static List<String> splitAbsolute(String joined) {
        return split(joined).stream().map(ImageUrls::absolute).collect(Collectors.toList());
    }

    public static List<String> split(String joined, String separator) {
        if (joined == null || joined.isBlank()) {
            return List.of();
        }
        return Arrays.stream(joined.split(java.util.regex.Pattern.quote(separator)))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    public static List<String> split(String joined) {
        return split(joined, "|");
    }

    public static String join(List<String> values, String separator) {
        if (values == null || values.isEmpty()) {
            return null;
        }
        return String.join(separator, values);
    }

    /** Hero image: first of the gallery when there is one, otherwise the single imageUrl. */
    public static String hero(String imageUrl, String imageUrls) {
        List<String> all = split(imageUrls);
        return absolute(all.isEmpty() ? imageUrl : all.get(0));
    }
}
