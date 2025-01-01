import { jest } from '@jest/globals';
import { CertificateInfo } from '../types/certificate.types';

// Mock the certificate utilities to provide predictable test data
// This prevents actual certificate checks during testing
jest.mock('../utils/certificate.utils', () => ({
    getCertificateInfo: jest.fn().mockImplementation((): Promise<CertificateInfo> =>
        Promise.resolve({
            subject: 'example.com',
            issuer: 'Test CA',
            validFrom: '2023-01-01',
            validTo: '2024-01-01'
        })
    )
}));

// Mock the mapper utilities to provide consistent data transformation
// This ensures predictable data structure in tests
jest.mock('../utils/mapper.utils', () => ({
    mapCertificateInfoToModel: jest.fn((certInfo: CertificateInfo) => ({
        domain: certInfo.subject,
        issuer: certInfo.issuer,
        expiryDate: certInfo.validTo
    }))
}));

// Clear all mocks before each test to ensure clean test state
beforeEach(() => {
    jest.clearAllMocks();
});

// Set global test timeout to 30 seconds
// Useful for tests that involve database operations or complex async operations
jest.setTimeout(30000);
