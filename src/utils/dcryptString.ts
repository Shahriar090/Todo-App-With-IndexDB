export function decryptString(encryptedBase64: string, username: string): string {
	const encrypted = atob(encryptedBase64); // Base64 decode
	let result = '';
	for (let i = 0; i < encrypted.length; i++) {
		const charCode = encrypted.charCodeAt(i) ^ username.charCodeAt(i % username.length);
		result += String.fromCharCode(charCode);
	}
	return result;
}
