import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";
import { HttpsError } from 'firebase-functions/lib/providers/https';

admin.initializeApp()

exports.removeUser = functions.https.onCall(async (data) =>
  admin.auth().getUserByEmail(data.email).then(async (user) => {
    return admin.auth().deleteUser(user.uid)
      .then(() => "El usuario ha sido eliminado exitosamente")
      .catch((error: Error) => { throw new HttpsError("cancelled", error.message) })
  }).catch((error: Error) => { throw new HttpsError("cancelled", error.message) }));

exports.addUser = functions.https.onCall(async (data) =>
  admin.auth().getUserByEmail(data.email).then(() => {
    throw new HttpsError("cancelled", "El usuario ya existe");
  }).catch(async () => {
    return admin.auth().createUser({ email: data.email, password: data.password })
      .then(() => "El usuaurio ha sido creado exitosamente")
      .catch((error: Error) => { throw new HttpsError("cancelled", error.message) })
  }));

exports.modifyUser = functions.https.onCall(async (data) =>
  admin.auth().getUserByEmail(data.email).then(async (user) => {
    return admin.auth().updateUser(user.uid, { email: data.newEmail })
      .then(() => "Usuaurio actualizado correctamente")
      .catch((error: Error) => { throw new HttpsError("cancelled", error.message) })
  }).catch((error: Error) => { throw new HttpsError("cancelled", error.message) }));
