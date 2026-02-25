import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import getDB, { dbSchema } from "@/db";
import { env } from "@/config/env";
import {
    admin,
    apiKey,
    emailOTP,
    // haveIBeenPwned,
    jwt,
    lastLoginMethod,
    magicLink,
    openAPI,
    organization,
    phoneNumber,
    twoFactor,
    username,
} from "better-auth/plugins";
import { oneTimeToken } from "better-auth/plugins/one-time-token";
import { passkey } from "@better-auth/passkey";


export default function getAuth() {
    const auth = betterAuth({
					appName: "AI Hub",
					experimental: { joins: true },
					secret: env.BETTER_AUTH_SECRET,
					baseURL: env.BETTER_AUTH_URL,
					basePath: "/auth",
					database: drizzleAdapter(getDB(), {
						provider: "pg",
						schema: dbSchema,
					}),
					emailPassword: {
						enabled: true,
					},
					trustedOrigins: [
						"http://app.localhost:1355",
						"https://aihub.com.bd",
						"https://*.aihub.com.bd",
						"https://ai-hub-v5-dashboard.pages.dev",
					],
					emailAndPassword: {
						enabled: true,
						sendResetPassword: async ({ user, url, token }, _request) => {
							console.log("Sending reset password email to", user.email);
							console.log("Token:", token);
							console.log("URL:", url);
						},
						onPasswordReset: async ({ user }, _request) => {
							// your logic here
							console.log(`Password for user ${user.email} has been reset.`);
						},
					},
					email: {
						enabled: true,
					},
					plugins: [
						openAPI(),
						admin({
							defaultRole: "regular",
							impersonationSessionDuration: 60 * 60 * 24,
							defaultBanReason: "Spamming",
							defaultBanExpiresIn: 60 * 60 * 24 * 30,
							bannedUserMessage: "Your account has been banned for 30 days.",
						}),
						apiKey(),
						jwt(),
						oneTimeToken(),
						passkey(),
						username(),
						twoFactor(),
						lastLoginMethod(),
						// haveIBeenPwned({
						// 	customPasswordCompromisedMessage:
						// 		"Please choose a more secure password.",
						// }),
						phoneNumber({
							sendOTP: ({ phoneNumber, code }, _ctx) => {
								// Implement sending OTP code via SMS
								console.log("Sending OTP code to", phoneNumber, ":", code);
							},
						}),
						magicLink({
							sendMagicLink: async ({ email, token, url }, _ctx) => {
								// send email to user
								console.log("Sending magic link to", email, ":", token);
								console.log("URL:", url);
							},
						}),
						emailOTP({
							async sendVerificationOTP({ email, otp, type }) {
								if (type === "sign-in") {
									// Send the OTP for sign in
									console.log("Sending Sign In OTP code to", email, ":", otp);
								} else if (type === "email-verification") {
									// Send the OTP for email verification
									console.log("Sending Email Verification OTP code to", email, ":", otp);
								} else {
									// Send the OTP for password reset
									console.log("Sending Password Reset OTP code to", email, ":", otp);
								}
							},
						}),
						organization(),
					],
					advanced: {
						cookiePrefix: "aihub",
						database: {
							// Use your own custom ID generator,
							// disable generating IDS so your database will generate them,
							// or use "serial" to use your database's auto-incrementing ID, or "uuid" to use a random UUID.
							generateId: () => crypto.randomUUID(),
							defaultFindManyLimit: 100,
							experimentalJoins: false,
						},
					},
				});
    return auth;
}

const auth = getAuth();

type TAuth = ReturnType<typeof getAuth>;

export { getAuth, auth, type TAuth };