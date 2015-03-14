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

// Login REST controller
class LoginController {

	// HTTP [any]
	def update = {
		// If the email and password was supplied.
		if (params.email && params.password)
		{
			// Look for the user where email and password match.
			def user = fileapp.User.findWhere(email:params['email'], password:params['password'])

			// Set the HTTP session user.
			session.user = user

			// Was a user found?
			if (user)
			{
				// Send back the user.
				render(contentType:"application/json") {
					success = true
					quota = user.getQuota()
					used = user.getUsed()
					isAdmin = user.getIsAdmin()
					msg = "Logged In"
				}
			}
			// No user found.
			else
			{
				// Send back failure object.
				render(contentType:"application/json") {
					success = false
					msg = "Wrong credentials"
				}
			}
		}
		// No credentials!
		else
		{
			// Send back failure object.
			render(contentType:"application/json") {
				success = false
				msg = "Please supply credentials"
			}
		}
	}

	/**
	 * Associate all HTTP methods for login.
	 */
    def create  = { update() }
	def read    = { update() }
	def delete  = { update() }
}
