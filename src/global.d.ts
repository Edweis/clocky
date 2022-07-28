import { AuthenticationHelper } from 'amazon-cognito-identity-js';

// The file is actually exported, simply the types provided are wrong
// https://github.com/aws-amplify/amplify-js/blob/main/packages/amazon-cognito-identity-js/src/AuthenticationHelper.js
declare module 'amazon-cognito-identity-js' {
  export class AuthenticationHelper {
    /**
     * Constructs a new AuthenticationHelper object
     * @param {string} PoolName Cognito user pool name.
     */
    constructor(PoolName);

    /**
     * @param {nodeCallback<BigInteger>} callback Called with (err, largeAValue)
     * @returns {void}
     */
    getLargeAValue(callback: (error: any, largeAValue: BigInteger) => void);

    /**
     * helper function to generate a random big integer
     * @returns {BigInteger} a random value.
     * @private
     */
    generateRandomSmallA(): BigInteger;

    /**
     * helper function to generate a random string
     * @returns {string} a random value.
     * @private
     */
    generateRandomString(): string;

    /**
     * @returns {string} Generated random value included in password hash.
     */
    getRandomPassword(): string;

    /**
     * @returns {string} Generated random value included in devices hash.
     */
    getSaltDevices(): string;

    /**
     * @returns {string} Value used to verify devices.
     */
    getVerifierDevices(): string;

    /**
     * Generate salts and compute verifier.
     * @param {string} deviceGroupKey Devices to generate verifier for.
     * @param {string} username User to generate verifier for.
     * @param {nodeCallback<null>} callback Called with (err, null)
     * @returns {void}
     */
    generateHashDevice(
      deviceGroupKey: string,
      username: string,
      callback: () => null,
    ): void;

    /**
     * Calculate the client's public value A = g^a%N
     * with the generated random number a
     * @param {BigInteger} a Randomly generated small A.
     * @param {nodeCallback<BigInteger>} callback Called with (err, largeAValue)
     * @returns {void}
     * @private
     */
    calculateA(a: bigint, callback: () => bigint);

    /**
     * Calculate the client's value U which is the hash of A and B
     * @param {BigInteger} A Large A value.
     * @param {BigInteger} B Server B value.
     * @returns {BigInteger} Computed U value.
     * @private
     */
    calculateU(A: bigint, B: bigint);

    /**
     * Calculate a hash from a bitArray
     * @param {Buffer} buf Value to hash.
     * @returns {String} Hex-encoded hash.
     * @private
     */
    hash(buf: Buffer): string;

    /**
     * Calculate a hash from a hex string
     * @param {String} hexStr Value to hash.
     * @returns {String} Hex-encoded hash.
     * @private
     */
    hexHash(hexStr: string);

    /**
     * Standard hkdf algorithm
     * @param {Buffer} ikm Input key material.
     * @param {Buffer} salt Salt value.
     * @returns {Buffer} Strong key material.
     * @private
     */
    computehkdf(ikm: Buffer, salt: Buffer): Buffer;

    /**
     * Calculates the final hkdf based on computed S value, and computed U value and the key
     * @param {String} username Username.
     * @param {String} password Password.
     * @param {BigInteger} serverBValue Server B value.
     * @param {BigInteger} salt Generated salt.
     * @param {nodeCallback<Buffer>} callback Called with (err, hkdfValue)
     * @returns {void}
     */
    getPasswordAuthenticationKey(
      username: string,
      password: string,
      serverBValue: BigInteger,
      salt: BigInteger,
      callback: () => Buffer,
    );

    /**
     * Calculates the S value used in getPasswordAuthenticationKey
     * @param {BigInteger} xValue Salted password hash value.
     * @param {BigInteger} serverBValue Server B value.
     * @param {nodeCallback<string>} callback Called on success or error.
     * @returns {void}
     */
    calculateS(xValue: BigInteger, serverBValue: BigInteger, callback);

    /**
     * Return constant newPasswordRequiredChallengeUserAttributePrefix
     * @return {newPasswordRequiredChallengeUserAttributePrefix} constant prefix value
     */
    getNewPasswordRequiredChallengeUserAttributePrefix();

    /**
     * Returns an unambiguous, even-length hex string of the two's complement encoding of an integer.
     *
     * It is compatible with the hex encoding of Java's BigInteger's toByteArray(), wich returns a
     * byte array containing the two's-complement representation of a BigInteger. The array contains
     * the minimum number of bytes required to represent the BigInteger, including at least one sign bit.
     *
     * Examples showing how ambiguity is avoided by left padding with:
     * 	"00" (for positive values where the most-significant-bit is set)
     *  "FF" (for negative values where the most-significant-bit is set)
     *
     * padHex(bigInteger.fromInt(-236))  === "FF14"
     * padHex(bigInteger.fromInt(20))    === "14"
     *
     * padHex(bigInteger.fromInt(-200))  === "FF38"
     * padHex(bigInteger.fromInt(56))    === "38"
     *
     * padHex(bigInteger.fromInt(-20))   === "EC"
     * padHex(bigInteger.fromInt(236))   === "00EC"
     *
     * padHex(bigInteger.fromInt(-56))   === "C8"
     * padHex(bigInteger.fromInt(200))   === "00C8"
     *
     * @param {BigInteger} bigInt Number to encode.
     * @returns {String} even-length hex string of the two's complement encoding.
     */
    padHex(bigInt);
  }
}
