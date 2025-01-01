import { jest } from '@jest/globals';
import { CertificateInfo } from '../types/certificate.types';

// Mock certificate utils with synchronous responses
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

// Mock mapper utils with synchronous responses
jest.mock('../utils/mapper.utils', () => ({
    mapCertificateInfoToModel: jest.fn((certInfo: CertificateInfo) => ({
        domain: certInfo.subject,
        issuer: certInfo.issuer,
        expiryDate: certInfo.validTo
    }))
}));

beforeEach(() => {
    jest.clearAllMocks();
});

// Increase timeout
jest.setTimeout(30000);
