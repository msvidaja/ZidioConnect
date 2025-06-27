package com.zidio.service;

import com.zidio.entity.User;
import com.zidio.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;

@Service
public class UserService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        logger.info("Attempting to load user by email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("User not found with email: {}", email);
                    return new UsernameNotFoundException("User not found: " + email);
                });
        String role = user.getRole();
        if (role == null || role.trim().isEmpty()) {
            logger.error("User {} has no valid role", email);
            throw new UsernameNotFoundException("User has no valid role");
        }
        String authority = "ROLE_" + role;
        logger.debug("Loaded user {} with authority: {}", email, authority);
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(authority))
        );
    }

    public User saveUser(User user) {
        if (user == null || user.getEmail() == null || user.getRole() == null) {
            logger.error("Attempt to save invalid user: {}", user);
            throw new IllegalArgumentException("User or required fields are null");
        }
        logger.info("Saving user with email: {}", user.getEmail());
        return userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        logger.info("Fetching user by email: {}", email);
        return userRepository.findByEmail(email)
                .orElse(null);
    }
}