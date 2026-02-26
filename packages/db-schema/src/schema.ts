import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { createSchema } from "./createTypes";

const commonCols = {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.notNull()
		.$onUpdateFn(() => new Date()),
	deletedAt: timestamp("deleted_at"),
};

export const user = pgTable("user", {
	...commonCols,
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	role: text("role"),
	banned: boolean("banned").default(false),
	banReason: text("ban_reason"),
	banExpires: timestamp("ban_expires"),
	username: text("username").unique(),
	displayUsername: text("display_username"),
	twoFactorEnabled: boolean("two_factor_enabled").default(false),
	phoneNumber: text("phone_number").unique(),
	phoneNumberVerified: boolean("phone_number_verified"),
});

export const session = pgTable(
	"session",
	{
		...commonCols,
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: uuid("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		impersonatedBy: uuid("impersonated_by"),
		activeOrganizationId: uuid("active_organization_id"),
	},
	(table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
	"account",
	{
		...commonCols,
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: uuid("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
	},
	(table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
	"verification",
	{
		...commonCols,
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const apikey = pgTable(
	"apikey",
	{
		...commonCols,
		name: text("name"),
		start: text("start"),
		prefix: text("prefix"),
		key: text("key").notNull(),
		userId: uuid("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		refillInterval: integer("refill_interval"),
		refillAmount: integer("refill_amount"),
		lastRefillAt: timestamp("last_refill_at"),
		enabled: boolean("enabled").default(true),
		rateLimitEnabled: boolean("rate_limit_enabled").default(true),
		rateLimitTimeWindow: integer("rate_limit_time_window").default(86400000),
		rateLimitMax: integer("rate_limit_max").default(10),
		requestCount: integer("request_count").default(0),
		remaining: integer("remaining"),
		lastRequest: timestamp("last_request"),
		expiresAt: timestamp("expires_at"),
		permissions: text("permissions"),
		metadata: text("metadata"),
	},
	(table) => [
		index("apikey_key_idx").on(table.key),
		index("apikey_userId_idx").on(table.userId),
	],
);

export const jwks = pgTable("jwks", {
	...commonCols,
	publicKey: text("public_key").notNull(),
	privateKey: text("private_key").notNull(),
	expiresAt: timestamp("expires_at"),
});

export const passkey = pgTable(
	"passkey",
	{
		...commonCols,
		name: text("name"),
		publicKey: text("public_key").notNull(),
		userId: uuid("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		credentialID: text("credential_id").notNull(),
		counter: integer("counter").notNull(),
		deviceType: text("device_type").notNull(),
		backedUp: boolean("backed_up").notNull(),
		transports: text("transports"),
		aaguid: text("aaguid"),
	},
	(table) => [
		index("passkey_userId_idx").on(table.userId),
		index("passkey_credentialID_idx").on(table.credentialID),
	],
);

export const twoFactor = pgTable(
	"two_factor",
	{
		...commonCols,
		secret: text("secret").notNull(),
		backupCodes: text("backup_codes").notNull(),
		userId: uuid("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [
		index("twoFactor_secret_idx").on(table.secret),
		index("twoFactor_userId_idx").on(table.userId),
	],
);

export const organization = pgTable(
	"organization",
	{
		...commonCols,
		name: text("name").notNull(),
		slug: text("slug").notNull().unique(),
		logo: text("logo"),
		metadata: text("metadata"),
	},
	(table) => [uniqueIndex("organization_slug_uidx").on(table.slug)],
);

export const member = pgTable(
	"member",
	{
		...commonCols,
		organizationId: uuid("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		userId: uuid("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		role: text("role").default("member").notNull(),
	},
	(table) => [
		index("member_organizationId_idx").on(table.organizationId),
		index("member_userId_idx").on(table.userId),
	],
);

export const invitation = pgTable(
	"invitation",
	{
		...commonCols,
		organizationId: uuid("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		email: text("email").notNull(),
		role: text("role"),
		status: text("status").default("pending").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		inviterId: uuid("inviter_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [
		index("invitation_organizationId_idx").on(table.organizationId),
		index("invitation_email_idx").on(table.email),
	],
);

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	apikeys: many(apikey),
	passkeys: many(passkey),
	twoFactors: many(twoFactor),
	members: many(member),
	invitations: many(invitation),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export const apikeyRelations = relations(apikey, ({ one }) => ({
	user: one(user, {
		fields: [apikey.userId],
		references: [user.id],
	}),
}));

export const passkeyRelations = relations(passkey, ({ one }) => ({
	user: one(user, {
		fields: [passkey.userId],
		references: [user.id],
	}),
}));

export const twoFactorRelations = relations(twoFactor, ({ one }) => ({
	user: one(user, {
		fields: [twoFactor.userId],
		references: [user.id],
	}),
}));

export const organizationRelations = relations(organization, ({ many }) => ({
	members: many(member),
	invitations: many(invitation),
}));

export const memberRelations = relations(member, ({ one }) => ({
	organization: one(organization, {
		fields: [member.organizationId],
		references: [organization.id],
	}),
	user: one(user, {
		fields: [member.userId],
		references: [user.id],
	}),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
	organization: one(organization, {
		fields: [invitation.organizationId],
		references: [organization.id],
	}),
	user: one(user, {
		fields: [invitation.inviterId],
		references: [user.id],
	}),
}));

export const tableValidationSchema = {
	user: createSchema(user),
	session: createSchema(session),
	account: createSchema(account),
	verification: createSchema(verification),
	passkey: createSchema(passkey),
	twoFactor: createSchema(twoFactor),
	organization: createSchema(organization),
	member: createSchema(member),
	invitation: createSchema(invitation),
	apikey: createSchema(apikey),
	jwks: createSchema(jwks),
};

export const dbSchema = {
	user,
	session,
	account,
	verification,
	passkey,
	twoFactor,
	organization,
	member,
	invitation,
	apikey,
	jwks,
	userRelations,
	sessionRelations,
	accountRelations,
	apikeyRelations,
	passkeyRelations,
	twoFactorRelations,
	organizationRelations,
	memberRelations,
	invitationRelations,
};
