/**
 * CMSC495
 * File Storage Application
 * Group C
 *
 * Kenneth J Ellis
 * Justin Paul Hill
 * Ian Levi Nelson
 */

// RESTful URL mappings. Assign HTTP methods to controller CRUD actions.
class UrlMappings {

	static mappings = {

		"/$controller/$id?"{
			action = [GET: "read", POST: "create", DELETE: "delete"]
		}

		"/"(view:"/index")
		"500"(view:'/error')
	}
}