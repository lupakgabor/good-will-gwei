import {compareAddresses, formatAddress} from "../utils";
import {expect} from "vitest";

describe('formatAddress', () => {
    it('returns with truncated address', () => {
        const address = '0x11512B94f41729E2f8BD914875FB269941977644';

        const truncatedAddress = formatAddress(address);

        expect(truncatedAddress).toBe('0x1151...7644');
    });

    test.each(
        ['0x11512B94f41729E2', '', '11512B94f41729E2f8BD914875FB269941977644', undefined]
    )('%s address return with Not an Address', (address) => {
        const truncatedAddress = formatAddress(address);

        expect(truncatedAddress).toBe('Not valid address!');
    });
})

describe('compareAddresses', () => {
    it('should equal', () => {
        const addressA = '0x11512B94f41729E2f8BD914875FB269941977644';
        const addressB = '0x11512b94f41729E2f8Bd914875fb269941977644';

        expect(addressA).not.toEqual(addressB);
        expect(compareAddresses(addressA, addressB)).toBeTruthy();
    });

    it('should not equal', () => {
        const addressA = '0x20012B94f41729E2f8BD914875FB269941977644';
        const addressB = '0x11512b94f41729E2f8Bd914875fb269941977644';

        expect(addressA).not.toEqual(addressB);
        expect(compareAddresses(addressA, addressB)).toBeFalsy();
    });

    it('should not equal if any of them is undefined', () => {
        const addressA = '0x20012B94f41729E2f8BD914875FB269941977644';
        const addressB = '0x11512b94f41729E2f8Bd914875fb269941977644';

        expect(addressA).not.toEqual(undefined);
        expect(compareAddresses(addressA, undefined)).toBeFalsy();
        expect(compareAddresses(undefined, addressB)).toBeFalsy();
        expect(compareAddresses(undefined, undefined)).toBeFalsy();
    });
})