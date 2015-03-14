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

// File REST controller.
class FileController {

	// HTTP GET
    def read = {
	    if (!session.user)
	    {
		    render(contentType:"application/json") {
			    success = false
			    msg = "Not logged in"
		    }
	    }

	    // If no ID is given, get all for session user.
	    if ( !params.id )
	    {
		    // Find all files for the session user.
		    def files = File.findAllByEmail(session.user.getProperty("email"))
		    def resultArr = [];

		    // If files aren't null, add them to the final response object.
		    if (files != null)
		    {
			    resultArr = files;
		    }

		    // Send back response object.
			render(contentType:"application/json") {
				success = true
				results = resultArr
				msg = "Successful query"
			}
	    }
	    // A specific file ID was sent.
	    else
	    {
		    // Render the file content
		    def file = File.findByUuid(params.id)
		    // If the file exists...
		    if (file)
		    {
			    // Set the content type to download and send back the output stream from the byte array.
			    response.setContentType("application/x-download");
			    response.setHeader("Content-disposition", "attachment;filename=${file.getName()}");
			    response.getOutputStream() << new ByteArrayInputStream(file.getContent())
		    }
	    }
    }

	// HTTP DELETE
	def delete = {
		// No session user
	    if (!session.user)
	    {
		    render(contentType:"application/json") {
			    success = false
			    msg = "Not logged in"
		    }
	    }
	    // Logged in
		else
	    {
		    // If an ID was sent...
		    if (params.id)
		    {
			    // ... find the file by the ID.
			    def file = File.findByUuid(params.id)

			    // Delete the object from the ORM layer.
			    file.delete()

			    // Send back notification response file was deleted.
				render(contentType:"application/json") {
					success = true
					msg = "Deleted file " + params.id
				}
		    }
		    // Otherwise, fail. Will not delete all.
		    else
		    {
			    // Send back failure object.
				render(contentType:"application/json") {
					success = false
					msg = "Must supply the file UUID"
				}
		    }
	    }
    }
}