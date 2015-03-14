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

// File domain object.
class File
{
    long size;
    String name;
    byte[] content;

	int id;
    String uuid = UUID.randomUUID().toString();

	String email;

    static constraints = {}
}