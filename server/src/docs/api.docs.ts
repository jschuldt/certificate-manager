/**
 * Main API documentation configuration object that combines all OpenAPI/Swagger specifications
 * for the Certificate Manager API.
 * 
 * @module ApiDocs
 */

import { certificateDocs } from './certificate.docs';
import { systemDocs } from './system.docs';
import { userDocs } from './user.docs';

/**
 * Combined OpenAPI specification object containing all API endpoints and schemas
 */
export const apiDocs = {
  paths: {
    /**
     * System-related endpoints for application maintenance and monitoring
     */
    ...systemDocs,

    /**
     * Certificate management endpoints for CRUD operations on certificates
     */
    ...certificateDocs,

    /**
     * User management endpoints for authentication and user operations
     */
    ...userDocs
  },

  /**
   * OpenAPI components section containing reusable schema definitions
   */
  components: {
    schemas: {
      /**
       * User-related schema definitions imported from userDocs
       */
      ...userDocs.components?.schemas,

      // Additional schema definitions can be added below
    }
  }
};
