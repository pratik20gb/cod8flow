package com.cod8flow.cod8flow.security;

import jakarta.servlet.FilterChain;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter { // once per request
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    )throws ServletException, IOException{
        // 1 . Get the auth header
        final String authHeader = request.getHeader("Authorization");

        //2. if no header or doesn't start with "Bearer " -skip,not our problem
        if(authHeader == null|| !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request,response);
            return;
        }

        //3 . Extract the token (remove "Bearer_" prefix)
        final String jwt = authHeader.substring(7);

        //4 . Extract email from the token
        final String email = jwtService.extractEmail(jwt);

        //5 if email exists and user not already authenticated
        if(email!=null && SecurityContextHolder.getContext().getAuthentication()==null){

            //6. Load user for database
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            //creating authentication  object
            UsernamePasswordAuthenticationToken  authToken=
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
            authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );
            //9. Set authentication in Security Context
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
        //10 . continue to next filter
        filterChain.doFilter(request,response);
    }

}
