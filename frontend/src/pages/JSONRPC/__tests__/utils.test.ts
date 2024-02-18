import {getAddressFromPrivateKey} from "../utils";

describe('getAddressFromPrivateKey', () => {
    it('should return with the address', () => {
        const privateKey = '0xdc921d27d367c2f87706aef853647b7547d43f76aca9a56e62f38eb325439c92';

        const address = getAddressFromPrivateKey(privateKey);

        expect(address).to.eq('0x243d866f2ddb257a8751b8cf070b119a091c1bc6');
    });

   it('should throw an error when the format of the private key is incorrect', () => {
        const privateKey = '921d27d367c2f87706aef853647b7547d43f76aca9a56e62f38eb325439c92';

        expect(() => getAddressFromPrivateKey(privateKey)).toThrowError('Private key has to be 66 characters.')
    });
})