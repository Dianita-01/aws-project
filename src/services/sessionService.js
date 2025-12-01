import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { putSession, queryBySessionString, deactivateSession } from './aws/dynamodb.js'; 
const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE;
const SESSION_INDEX_NAME = process.env.DYNAMODB_SESSION_INDEX;
const generateSessionString = (length = 128) => {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

export const createNewSessionEntry = async (alumnoId) => {
    const sessionString = generateSessionString();
    const sessionId = uuidv4();
    const fechaUnix = Math.floor(Date.now() / 1000);

    const sessionData = {
        id: sessionId,
        fecha: fechaUnix,
        alumnoId: Number(alumnoId),
        active: true,
        sessionString: sessionString
    };

    await putSession(DYNAMODB_TABLE, sessionData);
    return { sessionId, sessionString };
};

export const verifyActiveSession = async (sessionString, alumnoId) => {
    const result = await queryBySessionString(DYNAMODB_TABLE, SESSION_INDEX_NAME, sessionString);
    const session = result.Items?.[0];
    if (session && session.alumnoId === Number(alumnoId) && session.active === true) {
        return session;
    }
    return null;
};

export const closeSession = async (sessionString) => {
    const result = await queryBySessionString(DYNAMODB_TABLE, SESSION_INDEX_NAME, sessionString);
    const session = result.Items?.[0];
    if (!session) {
        return false;
    }

    await deactivateSession(DYNAMODB_TABLE, session.id);
    return true;
};