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

// User domain object.
class User
{
    String email;
    String firstName;
    String lastName;
    String password;

	int id;
    String uuid = UUID.randomUUID().toString();
    Boolean isAdmin = false;
	long quota = 2097152;
	long used = 0;
	
    static constraints = {
        firstName(blank:false)
        lastName(blank:false)
        email(blank:false)
        password(blank:false)
    }
}