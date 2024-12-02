import { box, randomBytes, secretbox } from 'tweetnacl';
import { encodeBase64, decodeBase64, encodeUTF8, decodeUTF8 } from 'tweetnacl-util';

export const generateKeyPair = (): { publicKey: string; secretKey: string } => {
  const keyPair = box.keyPair();
  return {
    publicKey: encodeBase64(keyPair.publicKey),
    secretKey: encodeBase64(keyPair.secretKey)
  };
};

export const encryptMessage = (
  message: string,
  recipientPublicKey: string,
  senderSecretKey: string
): { encrypted: string; nonce: string } => {
  const recipientPublicKeyUint8 = decodeBase64(recipientPublicKey);
  const senderSecretKeyUint8 = decodeBase64(senderSecretKey);
  const messageUint8 = decodeUTF8(message);
  const nonce = randomBytes(box.nonceLength);
  
  const encrypted = box(
    messageUint8,
    nonce,
    recipientPublicKeyUint8,
    senderSecretKeyUint8
  );

  return {
    encrypted: encodeBase64(encrypted),
    nonce: encodeBase64(nonce)
  };
};

export const decryptMessage = (
  encryptedMessage: string,
  nonce: string,
  senderPublicKey: string,
  recipientSecretKey: string
): string => {
  try {
    const encryptedUint8 = decodeBase64(encryptedMessage);
    const nonceUint8 = decodeBase64(nonce);
    const senderPublicKeyUint8 = decodeBase64(senderPublicKey);
    const recipientSecretKeyUint8 = decodeBase64(recipientSecretKey);

    const decrypted = box.open(
      encryptedUint8,
      nonceUint8,
      senderPublicKeyUint8,
      recipientSecretKeyUint8
    );

    if (!decrypted) {
      throw new Error('Failed to decrypt message');
    }

    return encodeUTF8(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt message');
  }
};

export const generateSignature = (message: string, secretKey: string): string => {
  const messageUint8 = decodeUTF8(message);
  const secretKeyUint8 = decodeBase64(secretKey);
  const nonce = randomBytes(secretbox.nonceLength);
  const signature = secretbox(messageUint8, nonce, secretKeyUint8);
  return encodeBase64(signature);
};

export const verifySignature = (
  signature: string,
  message: string,
  publicKey: string
): boolean => {
  try {
    const signatureUint8 = decodeBase64(signature);
    const messageUint8 = decodeUTF8(message);
    const publicKeyUint8 = decodeBase64(publicKey);
    const nonce = randomBytes(secretbox.nonceLength);
    return secretbox.open(signatureUint8, nonce, publicKeyUint8) !== null;
  } catch {
    return false;
  }
};