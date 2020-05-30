package app.security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import app.utils.TokenUtils;

public class AuthenticationTokenFilter extends UsernamePasswordAuthenticationFilter {
	@Autowired
	private TokenUtils tokenUtils;

	@Autowired
	private UserDetailsService userDetailsService;

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest httpRequest = (HttpServletRequest) req;
		HttpServletResponse httpResponse = (HttpServletResponse) res;
		String authToken = httpRequest.getHeader("Authorization");
		String username = tokenUtils.getUsername(authToken);

		if ((username != null) && (SecurityContextHolder.getContext().getAuthentication() == null)) {
			UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

			if (tokenUtils.validateToken(authToken, userDetails)) {
				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
						userDetails, null, userDetails.getAuthorities());
				authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpRequest));
				SecurityContextHolder.getContext().setAuthentication(authentication);
			} else {
				String expired = (String) httpRequest.getAttribute("expired");
				if (expired != null) {
					httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, expired);
				} else {
					httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid Login details");
				}
			}
		}
		chain.doFilter(req, res);
	}

}