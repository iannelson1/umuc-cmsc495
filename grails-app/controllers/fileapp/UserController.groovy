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

// User object REST controller.
class UserController {

	// HTTP GET
    def read = {
		def admin
	    if (session.user)
	    {
	        admin = session.user.getProperty("isAdmin")
	    }
	    else {
		    render(contentType:"application/json") {
			    success = false
			    msg = "Not logged in"
		    }
	    }

	    // If no ID is specified, get all.
	    if ( !params.id )
	    {
		    // Are you an admin? If so, get all.
		    if (admin)
		    {
			    render(contentType:"application/json") {
				    success = true
				    count = User.count()
				    results = User.getAll()
				    msg = "Successful query"
			    }
		    }
		    // If not, get only yourself.
		    else
		    {
			    render(contentType:"application/json") {
					success = true
				    count = 1
				    results = [session.user]
				    msg = "Successful query"
			    }
		    }
	    }
	    // If an ID was specified...
	    else
	    {
		    // Find the user by ID.
		    def user = User.findByUuid(params.id)
		    // Must be admin to see other users.
			if (admin && user)
			{
				render(contentType:"application/json") {
					success = true
					count = 1
					results = [user]
					msg = "Successful query"
				}
			}
			// If not, will not get returned.
		    else if (!admin && user)
			{
				render(contentType:"application/json") {
					success = false
					count = 0
					results = []
					msg = "You do not have permissions"
				}
			}
			// No user exists!
		    else
			{
				render(contentType:"application/json") {
					success = false
					count = 0
					results = []
					msg = "No such user"
				}
			}
	    }
    }

	// HTTP POST (update and create)
	def create = {
		def admin
	    if (session.user)
	    {
	        admin = session.user.getProperty("isAdmin")
	    }
	    else {
		    render(contentType:"application/json") {
			    success = false
			    msg = "Not logged in"
		    }
	    }

	    if ( admin )
	    {
			if (params.id)
			{
				def user = User.findByUuid(params.id);
				if (user)
				{

					if (params.quota) user.setQuota(Integer.parseInt(params.quota))
					if (params.password) user.setPassword(params.password)
					if (params.isAdmin)
					{
						if (params.isAdmin.equals("on")) user.setIsAdmin(true)
						else user.setIsAdmin(false)
					}
					
					if (user.save())
					{
						render(contentType:"application/json") {
							success = true
							count = 1
							results = [user]
							msg = "Updated user " + user.getEmail()
						}
					}
				}
			}
		    else
			{
				def user = new User(firstName:params.firstName,lastName:params.lastName,email:params.email,password:params.password,isAdmin:params.isAdmin)
				if (user.save())
				{
					render(contentType:"application/json") {
						success = true
						count = 1
						results = [user]
						msg = "Created user " + user.getEmail()
					}
				}
				else
				{
					render(contentType:"application/json") {
						success = false
						count = 0
						results = []
						msg = "Problem creating user: " + user.errors
					}
				}
			}
	    }
		else
	    {
		    render(contentType:"application/json") {
			    success = false
			    msg = "Must be admin to create users"
		    }
	    }
    }

	def update = {
		def admin
	    if (session.user)
	    {
	        admin = session.user.getProperty("isAdmin")
	    }
	    else {
		    render(contentType:"application/json") {
			    success = false
			    msg = "Not logged in"
		    }
	    }

	    if ( admin )
	    {
		    def user = User.findByUuid(params.id)
		    user.setQuota(params.quota)

		    if (user.save())
		    {
			    render(contentType:"application/json") {
			        success = true
				    count = 1
				    results = [user]
				    msg = "Created quota updated"
			    }
		    }
		    else
		    {
			    render(contentType:"application/json") {
			        success = false
				    count = 0
				    results = []
				    msg = "Problem updating user quota: " + user.errors
			    }
		    }
	    }
		else
	    {
		    render(contentType:"application/json") {
			    success = false
			    msg = "Must be admin to update users"
		    }
	    }
    }

	def delete = {
		def admin

	    if (session.user)
	    {
	        admin = session.user.getProperty("isAdmin")
	    }
	    else {
		    render(contentType:"application/json") {
			    success = false
			    msg = "Not logged in"
		    }
	    }

	    if ( admin )
	    {
		    def user = User.findByUuid(params.id)

		    user.delete()
			render(contentType:"application/json") {
				success = true
				count = 1
				msg = "Deleted user " + params.id
			}

	    }
		else
	    {
		    render(contentType:"application/json") {
			    success = false
			    msg = "Must be admin to delete users"
		    }
	    }
    }
}