import fileapp.User

class BootStrap {

    def init = { servletContext ->
	    // Create the default admin user.
	    System.out.println("Bootstrap: Creating admin user.")
	    if (!User.count())
	    {
	        new User(firstName:"Admin",lastName:"Admin",email:"admin@localhost",password:"admin",isAdmin:true).save(failOnError: true)
	    }
    }
    def destroy = {
    }
}
