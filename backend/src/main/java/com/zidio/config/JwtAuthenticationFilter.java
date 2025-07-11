package com.zidio.config;

import com.zidio.service.JwtService;
import com.zidio.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    public JwtAuthenticationFilter(JwtService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        String method = request.getMethod();
        
        System.out.println("JWT Filter - Path: " + path + ", Method: " + method);
        
        // Skip JWT filtering for public endpoints
        if (path.equals("/api/auth/register") && "POST".equals(method)) {
            System.out.println("JWT Filter - Skipping registration endpoint");
            return true;
        }
        
        if (path.equals("/api/auth/login") && "POST".equals(method)) {
            System.out.println("JWT Filter - Skipping login endpoint");
            return true;
        }
        
        if (path.equals("/api/auth/validate") && "GET".equals(method)) {
            System.out.println("JWT Filter - Skipping validate endpoint");
            return true;
        }
        
        if (path.equals("/api/jobs/all") && "GET".equals(method)) {
            System.out.println("JWT Filter - Skipping jobs endpoint");
            return true;
        }
        
        System.out.println("JWT Filter - Processing endpoint: " + path);
        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String email = jwtService.extractEmail(token);
                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userService.loadUserByUsername(email);
                    if (jwtService.validateToken(token, userDetails)) {
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            }
            chain.doFilter(request, response);
        } catch (Exception e) {
            System.err.println("JWT Filter Error: " + e.getMessage());
            chain.doFilter(request, response);
        }
    }
}