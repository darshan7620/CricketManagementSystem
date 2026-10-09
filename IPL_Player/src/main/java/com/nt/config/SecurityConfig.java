package com.nt.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import tools.jackson.databind.ObjectMapper;
import com.nt.security.JwtAuthenticationFilter;
import com.nt.vo.ApiError;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final ObjectMapper objectMapper;

	public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, ObjectMapper objectMapper) {
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
		this.objectMapper = objectMapper;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			.cors(Customizer.withDefaults())
			.csrf(csrf -> csrf.disable())
			.formLogin(form -> form.disable())
			.httpBasic(basic -> basic.disable())
			.logout(logout -> logout.disable())
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.exceptionHandling(ex -> ex
					.authenticationEntryPoint((request, response, authException) -> writeError(response,
							HttpStatus.UNAUTHORIZED, "Authentication required"))
					.accessDeniedHandler((request, response, accessDeniedException) -> writeError(response,
							HttpStatus.FORBIDDEN, "You do not have permission to perform this action")))
			.authorizeHttpRequests(auth -> auth
					.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
					// public authentication endpoints (no public admin signup)
					.requestMatchers(HttpMethod.POST, "/player-api/auth/register", "/player-api/auth/login",
							"/admin-api/auth/login").permitAll()
					// health/info
					.requestMatchers("/actuator/health", "/actuator/health/**", "/actuator/info").permitAll()
					// public read-only franchise directory (required by the public signup dropdown)
					.requestMatchers(HttpMethod.GET, "/team-api/findAll", "/team-api/find/**").permitAll()
					// administrative writes
					.requestMatchers(HttpMethod.POST, "/player-api/register", "/player-api/registerAll")
						.hasRole("ADMIN")
					.requestMatchers(HttpMethod.DELETE, "/player-api/delete/**", "/player-api/deleteAll")
						.hasRole("ADMIN")
					.requestMatchers(HttpMethod.POST, "/team-api/register", "/team-api/registerAll")
						.hasRole("ADMIN")
					.requestMatchers(HttpMethod.PUT, "/team-api/updateTeam").hasRole("ADMIN")
					.requestMatchers(HttpMethod.DELETE, "/team-api/delete/**", "/team-api/deleteAll")
						.hasRole("ADMIN")
					// authenticated reads and self-service update (ownership enforced in controller)
					.requestMatchers(HttpMethod.GET, "/player-api/**").hasAnyRole("PLAYER", "ADMIN")
					.requestMatchers(HttpMethod.PUT, "/player-api/update").hasAnyRole("PLAYER", "ADMIN")
					.anyRequest().authenticated())
			.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOriginPatterns(List.of("http://localhost:*"));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
		config.setAllowedHeaders(List.of("*"));
		config.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}

	private void writeError(HttpServletResponse response, HttpStatus status, String message) throws IOException {
		response.setStatus(status.value());
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.setCharacterEncoding(StandardCharsets.UTF_8.name());
		objectMapper.writeValue(response.getWriter(), new ApiError(message));
	}
}
