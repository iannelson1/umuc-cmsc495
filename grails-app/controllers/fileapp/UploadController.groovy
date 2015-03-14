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

// File Upload REST controller
class UploadController {

	// HTTP [all]
	def upload = {
		// Not logged in.
		if (!session.user)
	    {
		    // Send back failure object.
		    render(contentType:"application/json") {
			    success = false
			    msg = "Not logged in"
		    }
	    }
		// Logged in user.
	    else
        {
	        // Get session user quota
	        def quota = session.user.getProperty("quota")
	        def used = session.user.getProperty("used")
	        def left = quota - used;

	        // Get user email for storage association.
	        def email = session.user.getProperty("email")

	        // Get Spring MultiPartFile object.
	        def f = request.getFile('file')

	        // Log notification.
	        System.out.println("Uploaded a file by " + email)

	        // Will fit in quota.
	        if (f.getSize() <= left)
	        {
		        // Create a new domain object.
		        def uploadedFile = new File(content:f.getBytes(),name:f.fileItem.fileName,email:email,size:f.getSize())

		        // Attempt to persist.
		        if (uploadedFile.save())
		        {
			        // Adjust amount of quota left
			        def adjusted = used + f.getSize();
			        					
			        // Save user object with adjusted quota.
			        def user = User.findByUuid(session.user.getProperty('uuid'))
			        user.setUsed(adjusted);
			        user.save()

			        // For form uploads, JSON must be encoded as string, not application/json.
					render "{\"success\":true,\"count\":1,\"uuid\":\"" + uploadedFile.getUuid() + "\",\"used\":" + user.getUsed() + ",\"quota\":" + session.user.getProperty("quota") + "}"
		        }
	        }
	        // Won't fit.
	        else
	        {
		        // For form uploads, JSON must be encoded as string, not application/json.
				render "{\"success\":false,\"msg\":\"File will not fit in available quota\"}"
	        }
        }
	}

	/**
	 * Associate all HTTP methods to upload method. Upload (multipart)
	 * will take place regardless of transport.
	 */
    def create  = { upload() }
	def read    = { upload() }
	def update  = { upload() }
	def delete  = { upload() }
}
