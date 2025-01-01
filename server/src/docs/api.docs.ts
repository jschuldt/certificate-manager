import { certificateDocs } from './certificate.docs';
import { systemDocs } from './system.docs';
import { userDocs } from './user.docs';

export const apiDocs = {
  paths: {
    // System Endpoints
    ...systemDocs,

    // Certificate Endpoints
    ...certificateDocs,

    // User Endpoints
    ...userDocs
  },

  // Schema Definitions
  components: {
    schemas: {
      // User Schemas from userDocs
      ...userDocs.components?.schemas,

      // Any additional schemas can be added here if needed
    }
  }
};
