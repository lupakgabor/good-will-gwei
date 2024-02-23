import {compareAddresses, formatAddress} from "@/utils";
import {expect} from "vitest";
import {mockAddress, mockAddresses} from "@/__mocks__";

describe('formatAddress', () => {
    it('returns with truncated address', () => {
        const truncatedAddress = formatAddress(mockAddress);

        expect(truncatedAddress).toBe('0x1111...1111');
    });

    test.each(
        ['0x11512B94f41729E2', '', '11512B94f41729E2f8BD914875FB269941977644', undefined]
    )('%s address return with Not an Address', (address) => {
        const truncatedAddress = formatAddress(address as `0x${string}`);

        expect(truncatedAddress).toBe('Not valid address!');
    });
})

describe('compareAddresses', () => {
    it('case insensitively should equal', () => {
        const addressA = '0x11512B94f41729E2f8BD914875FB269941977644';
        const addressB = '0x11512b94f41729E2f8Bd914875fb269941977644';

        expect(addressA).not.toEqual(addressB);
        expect(compareAddresses(addressA, addressB)).toBeTruthy();
    });

    it('should not equal', () => {
        expect(mockAddresses[0]).not.toEqual(mockAddresses[1]);
        expect(compareAddresses(mockAddresses[0], mockAddresses[1])).toBeFalsy();
    });

    it('should not equal if any of them is undefined', () => {
        expect(mockAddresses[0]).not.toEqual(undefined);
        expect(compareAddresses(mockAddresses[0], undefined)).toBeFalsy();
        expect(compareAddresses(undefined, mockAddresses[1])).toBeFalsy();
        expect(compareAddresses(undefined, undefined)).toBeFalsy();
    });
})