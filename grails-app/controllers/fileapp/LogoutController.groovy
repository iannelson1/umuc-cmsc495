/**
 * CMSC495
 * File Storage Application
 * Group C
 *
 * Kenneth J Ellis
 * Justin Paul Hill
 * Ian Levi Nelson
 */

package fileapp

// Logout REST controller.
class LogoutController {

	// HTTP [all]
	def update = {
		// Invalidate user from session.
		session.user = null

		// Redirect to index (i.e. login)
		response.sendRedirect("${request.contextPath}/")
	}

	/**
	 * Associate all HTTP methods for logout.
	 */
    def create  = { update() }
	def read    = { update() }
	def delete  = { update() }
}