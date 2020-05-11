package app.services;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import app.project_manager.services.UserService2;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
	@Autowired
	UserService userService;

	@Autowired
	UserService2 userService2;

	/*
	 * @Transactional public UserDetails loadUserByUsername(String username) throws
	 * UsernameNotFoundException { Optional<User> user =
	 * userService.getUserByUsername(username);
	 * 
	 * if(user.isPresent()) { ArrayList<GrantedAuthority> grantedAuthorities = new
	 * ArrayList<GrantedAuthority>(); return new
	 * org.springframework.security.core.userdetails.User(user.get().getUsername(),
	 * user.get().getPassword(), grantedAuthorities); }
	 * 
	 * return null; }
	 */

	@Transactional
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		Optional<app.project_manager.models.User> user = userService2.getUserByEmail(email);

		if (user.isPresent()) {
			ArrayList<GrantedAuthority> grantedAuthorities = new ArrayList<GrantedAuthority>();
			return new org.springframework.security.core.userdetails.User(user.get().getEmail(),
					user.get().getPassword(), grantedAuthorities);
		}

		return null;
	}
}