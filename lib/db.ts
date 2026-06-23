import mongoose from "mongoose";

const uri = process.env.MONGODB_URI?.trim() || "";

export type DatabaseMode = "mongodb" | "mock";

declare global {
  // eslint-disable-next-line no-var
  var campusMongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
  // eslint-disable-next-line no-var
  var campusDbMode: DatabaseMode | undefined;
  // eslint-disable-next-line no-var
  var campusDbError: string | undefined;
  // eslint-disable-next-line no-var
  var campusEnvValidated: boolean | undefined;
}

function validateEnvironment() {
  if (global.campusEnvValidated) return;
  global.campusEnvValidated = true;

  if (!uri) {
    console.warn("[env] MONGODB_URI is missing. Using mock database mode.");
    return;
  }

  try {
    const parsed = new URL(uri);
    const isMongoProtocol = parsed.protocol === "mongodb:" || parsed.protocol === "mongodb+srv:";
    if (!isMongoProtocol || uri.includes("your_mongodb") || uri.includes("xxxxx")) {
      console.warn("[env] MONGODB_URI appears invalid or placeholder. Using mock database mode if connection fails.");
      return;
    }
    console.info(`[env] MONGODB_URI configured for host: ${parsed.hostname}`);
  } catch (error) {
    console.warn("[env] MONGODB_URI could not be parsed. Using mock database mode if connection fails.");
  }
}

validateEnvironment();

export function hasMongoUri() {
  return Boolean(uri);
}

export async function connectDB() {
  if (!uri) return null;
  if (!global.campusMongoose) global.campusMongoose = { conn: null, promise: null };
  if (global.campusMongoose.conn) return global.campusMongoose.conn;
  if (!global.campusMongoose.promise) {
    global.campusMongoose.promise = mongoose.connect(uri, {
      bufferCommands: false
    }).catch((error) => {
      if (global.campusMongoose) global.campusMongoose.promise = null;
      throw error;
    });
  }
  global.campusMongoose.conn = await global.campusMongoose.promise;
  return global.campusMongoose.conn;
}

function logMongoFailure(reason: string) {
  global.campusDbError = reason;
  console.error("[db] MongoDB connection failed:", reason);
  console.warn("[db] Falling back to mock JSON memory database.");
}

export function getDatabaseMode(): DatabaseMode {
  return global.campusDbMode ?? "mock";
}

export function getDatabaseError() {
  return global.campusDbError;
}

export async function resolveDatabaseMode(): Promise<DatabaseMode> {
  if (global.campusDbMode) return global.campusDbMode;

  if (!hasMongoUri()) {
    global.campusDbMode = "mock";
    global.campusDbError = "MONGODB_URI is missing";
    console.warn("[db] MONGODB_URI is missing. Falling back to mock JSON memory database.");
    return global.campusDbMode;
  }

  try {
    const connection = await connectDB();
    if (!connection) throw new Error("MongoDB connection returned null");
    global.campusDbMode = "mongodb";
    global.campusDbError = undefined;
    console.info("[db] MongoDB connected.");
    return global.campusDbMode;
  } catch (error) {
    logMongoFailure(error instanceof Error ? error.message : "Unknown error");
    global.campusDbMode = "mock";
    return global.campusDbMode;
  }
}

export async function useMongoDatabase() {
  return (await resolveDatabaseMode()) === "mongodb";
}
