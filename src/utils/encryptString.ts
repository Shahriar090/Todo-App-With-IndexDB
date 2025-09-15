export function encryptString(plainText: string, username: string): string {
	let result = '';
	for (let i = 0; i < plainText.length; i++) {
		const charCode = plainText.charCodeAt(i) ^ username.charCodeAt(i % username.length);
		result += String.fromCharCode(charCode);
	}
	return btoa(result); // Base64 encode
}
