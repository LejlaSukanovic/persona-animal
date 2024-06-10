const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require('./persona-animal-firebase-adminsdk-ge6gm-2a1d387556.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://persona-animal.appspot.com' // Replace with your Storage bucket name
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const entities = [
  {
    idEntiteta: 1,
    naziv: 'Konj',
    pozLastnosti: 'Lepota, Koristnost',
    negLastnosti: 'Razdražljivost, Divjost, Občutljivost',
    slika: './images/konj.jpeg',
    kategorija: 'Živali',
  },
  {
    idEntiteta: 2,
    naziv: 'Pes',
    pozLastnosti: 'Zvestoba, Zaščitništvo, Učljivost, Pripadnost',
    negLastnosti: 'Ljubosumnost, Vodljivost',
    slika: './images/pes.jpg',
    kategorija: 'Živali'
  },
  {
    idEntiteta: 3,
    naziv: 'Sova',
    pozLastnosti: 'Dar za opazovanj, Resnost, Modrost, Previdnost, Čuječnost',
    negLastnosti: 'Zaspanost, Lenobnost',
    slika: './images/sova.jpg',
    kategorija: 'Živali'
  },
  {
    idEntiteta: 4,
    naziv: 'Medved',
    pozLastnosti: 'Moč, Zaščitništvo, Razigranost, Dobrodušnost',
    negLastnosti: 'Grobost, Godrnjavost, Okrutnost',
    slika: './images/medved.jpg',
    kategorija: 'Živali'
  },
  {
    idEntiteta: 5,
    naziv: 'Lev',
    pozLastnosti: 'Ponos, Vsemogočnost, Samozavest, Veličastvenost',
    negLastnosti: 'Krvoločnost, Vzvišenost, Požrešnost',
    slika: './images/lev.jpeg',
    kategorija: 'Živali'
  },
  {
    idEntiteta: 6,
    naziv: 'Lisica',
    pozLastnosti: 'Zvitost, Bistrost, Prilagodljivost',
    negLastnosti: 'Preračunljivost, Kradljivost, Zahrbtnost',
    slika: './images/lisica.jpg',
    kategorija: 'Živali'
  },
  {
    idEntiteta: 7,
    naziv: 'Opica',
    pozLastnosti: 'Nagajivost, Veselje, Inteligentnost',
    negLastnosti: 'Kradljivost, Prepirljivost, Požrešnost',
    slika: './images/opica.jpeg',
    kategorija: 'Živali'
  },
  {
    idEntiteta: 8,
    naziv: 'Zajec',
    pozLastnosti: 'Hitrost, Ljubkost, Previdnost, Dobrosrčnost',
    negLastnosti: 'Plašnost, Strahopetnost, Prestrašenost',
    slika: './images/zajec.jpeg',
    kategorija: 'Živali'
  },
  {
    idEntiteta: 9,
    naziv: 'Mačka',
    pozLastnosti: 'Igrivost, Svobodnost, Okretnost',
    negLastnosti: 'Zahrbtnost, Popadljivost, Kradljivost',
    slika: './images/macka.jpg',
    kategorija: 'Živali'
  },
  {
    idEntiteta: 10,
    naziv: 'Galeb',
    pozLastnosti: 'Elegantnost, Gibčnost, Lepota',
    negLastnosti: 'Kradljivost, Požrešnost, Prepirljivost',
    slika: './images/galeb.jpeg',
    kategorija: 'Živali'
  },
  {
    idEntiteta: 11,
    naziv: 'Mravlja',
    pozLastnosti: 'Pridnost, Organiziranost, Altruizem',
    negLastnosti: 'Bojevitost, Trmoglavost, Napadalnost',
    slika: './images/mravlja.jpg',
    kategorija: 'Živali'
  },
  {
    idEntiteta: 12,
    naziv: 'Orel',
    pozLastnosti: 'Plemenitost, Vzvišenost, Ponos, Pogum',
    negLastnosti: 'Neusmiljenost, Krvoločnost, Plenjenje, Krutost',
    slika: './images/orel.jpeg',
    kategorija: 'Živali'
  },
  {
    idEntiteta: 13,
    naziv: 'Slon',
    pozLastnosti: 'Moč, Delavnost, Bistrost',
    negLastnosti: 'Nerodnost, Svojeglavost, Požrešnost, Razdiralnost',
    slika: './images/slon.jpg',
    kategorija: 'Živali'
  },
  {
    idEntiteta: 14,
    naziv: 'Srna',
    pozLastnosti: 'Nedolžnost, Prisrčnost, Spretnost, Ljubkost',
    negLastnosti: 'Plahost, Nezaupljivost, Občutljivost',
    slika: './images/srna.jpg',
    kategorija: 'Živali'
  },
  {
    idEntiteta: 15,
    naziv: 'Čebela',
    pozLastnosti: 'Delavnost, Koristnost, Aktivnost',
    negLastnosti: 'Napadalnost, Nadležnost',
    slika: './images/cebela.jpeg',
    kategorija: 'Živali'
  },
  {
    idEntiteta: 16,
    naziv: 'Bik',
    pozLastnosti: 'Moč, Borbenost, Vztrajnost, Energičnost',
    negLastnosti: 'Divjost, Razdražljivost, Trmavost, Zaletavost, Impulzivnost',
    slika: './images/bik.jpeg',
    kategorija: 'Živali'
  },
  {
    idEntiteta: 20,
    naziv: 'Rdeca',
    pozLastnosti: 'Moč, Borbenost, Vztrajnost, Energičnost',
    negLastnosti: 'Divjost, Razdražljivost, Trmavost, Zaletavost, Impulzivnost',
    slika: './images/rdeca.jpg',
    kategorija: 'Barve'
  },
  {
    idEntiteta: 21,
    naziv: 'Modra',
    pozLastnosti: 'Moč, Borbenost, Vztrajnost, Energičnost',
    negLastnosti: 'Divjost, Razdražljivost, Trmavost, Zaletavost, Impulzivnost',
    slika: './images/modra.jpg',
    kategorija: 'Barve'
  }
];

let ujemanjaTable = {
  Konj: { Konj: 1, Pes: 3, Sova: 5, Medved: 4, Lev: 3, Lisica: 4, Opica: 2, Zajec: 3, Mačka: 3, Galeb: 3, Mravlja: 2, Orel: 4, Slon: 1, Srna: 3, Čebela: 2, Bik: 4 },
  Pes: { Pes: 1, Konj: 3, Sova: 5, Medved: 5, Lev: 4, Lisica: 5, Opica: 1, Zajec: 4, Mačka: 4, Galeb: 4, Mravlja: 3, Orel: 5, Slon: 2, Srna: 4, Čebela: 2, Bik: 5 },
  Sova: { Sova: 1, Konj: 5, Pes: 5, Medved: 2, Lev: 3, Lisica: 2, Opica: 5, Zajec: 4, Mačka: 2, Galeb: 4, Mravlja: 5, Orel: 2, Slon: 5, Srna: 4, Čebela: 5, Bik: 3 },
  Medved: { Medved: 1, Konj: 4, Pes: 5, Sova: 2, Lev: 1, Lisica: 1, Opica: 4, Zajec: 2, Mačka: 2, Galeb: 2, Mravlja: 5, Orel: 2, Slon: 3, Srna: 2, Čebela: 5, Bik: 1 },
  Lev: { Lev: 1, Konj: 3, Pes: 4, Sova: 3, Medved: 1, Lisica: 2, Opica: 4, Zajec: 2, Mačka: 2, Galeb: 2, Mravlja: 5, Orel: 2, Slon: 3, Srna: 2, Čebela: 5, Bik: 3 },
  Lisica: { Lisica: 1, Konj: 4, Pes: 5, Sova: 2, Medved: 1, Lev: 2, Opica: 4, Zajec: 2, Mačka: 3, Galeb: 3, Mravlja: 5, Orel: 1, Slon: 4, Srna: 3, Čebela: 5, Bik: 1 },
  Opica: { Opica: 1, Konj: 2, Pes: 1, Sova: 5, Medved: 4, Lev: 4, Lisica: 4, Zajec: 4, Mačka: 3, Galeb: 4, Mravlja: 3, Orel: 4, Slon: 1, Srna: 3, Čebela: 3, Bik: 5 },
  Zajec: { Zajec: 1, Konj: 3, Pes: 4, Sova: 4, Medved: 2, Lev: 2, Lisica: 2, Opica: 4, Mačka: 2, Galeb: 1, Mravlja: 5, Orel: 3, Slon: 3, Srna: 1, Čebela: 5, Bik: 2 },
  Mačka: { Mačka: 1, Konj: 3, Pes: 4, Sova: 2, Medved: 2, Lev: 2, Lisica: 3, Opica: 3, Zajec: 2, Galeb: 2, Mravlja: 5, Orel: 4, Slon: 2, Srna: 2, Čebela: 5, Bik: 3 },
  Galeb: { Galeb: 1, Konj: 3, Pes: 4, Sova: 4, Medved: 2, Lev: 2, Lisica: 3, Opica: 4, Zajec: 1, Mačka: 2, Mravlja: 5, Orel: 4, Slon: 3, Srna: 1, Čebela: 5, Bik: 2 },
  Mravlja: { Mravlja: 1, Konj: 2, Pes: 3, Sova: 5, Medved: 5, Lev: 5, Lisica: 5, Opica: 3, Zajec: 5, Mačka: 5, Galeb: 5, Orel: 5, Slon: 3, Srna: 4, Čebela: 1, Bik: 5 },
  Orel: { Orel: 1, Konj: 4, Pes: 5, Sova: 2, Medved: 2, Lev: 2, Lisica: 1, Opica: 4, Zajec: 3, Mačka: 4, Galeb: 4, Mravlja: 5, Slon: 3, Srna: 4, Čebela: 1, Bik: 5 },
  Slon: { Slon: 1, Konj: 3, Pes: 4, Sova: 4, Medved: 2, Lev: 2, Lisica: 3, Opica: 3, Zajec: 1, Mačka: 2, Galeb: 3, Mravlja: 3, Orel: 4, Srna: 2, Čebela: 3, Bik: 4 },
  Srna: { Srna: 1, Konj: 3, Pes: 4, Sova: 4, Medved: 2, Lev: 2, Lisica: 3, Opica: 3, Zajec: 1, Mačka: 2, Galeb: 1, Mravlja: 4, Orel: 4, Slon: 2, Čebela: 2, Bik: 2 },
  Čebela: { Čebela: 1, Konj: 2, Pes: 2, Sova: 5, Medved: 5, Lev: 5, Lisica: 5, Opica: 3, Zajec: 5, Mačka: 5, Galeb: 5, Mravlja: 1, Orel: 5, Slon: 3, Srna: 4, Bik: 5 },
  Bik: { Bik: 1, Konj: 4, Pes: 5, Sova: 3, Medved: 1, Lev: 3, Lisica: 1, Opica: 5, Zajec: 2, Mačka: 3, Galeb: 2, Mravlja: 5, Orel: 2, Slon: 4, Srna: 2, Čebela: 5 }
};

// Ensure all mutual matches are correctly filled
const fillMissingUjemanja = (table) => {
  const entities = Object.keys(table);
  entities.forEach(entity1 => {
    entities.forEach(entity2 => {
      if (entity1 !== entity2) {
        if (table[entity1][entity2] === undefined) {
          table[entity1][entity2] = table[entity2][entity1] || 1; // Default to 1 if both are undefined
        }
      }
    });
  });
};

fillMissingUjemanja(ujemanjaTable);

const uploadImage = async (filePath, fileName) => {
  const uploadPath = path.join(__dirname, filePath);
  const file = bucket.file(fileName);
  await bucket.upload(uploadPath, {
    destination: fileName,
    public: true
  });
  return file.publicUrl();
};

const addEntitiesToFirestore = async () => {
  try {
    for (const entity of entities) {
      const imageUrl = await uploadImage(entity.slika, `${entity.naziv}.jpg`);
      const entityData = { ...entity, slika: imageUrl };
      await db.collection('entiteta').doc(entity.naziv).set(entityData);

      // Add ujemanja sub-collection
      const ujemanja = ujemanjaTable[entity.naziv] || {};
      for (const [otherEntity, ocena] of Object.entries(ujemanja)) {
        await db.collection('entiteta').doc(entity.naziv).collection('ujemanja').doc(otherEntity).set({ ocena_ujemanja: ocena });
      }

      console.log(`Document for ${entity.naziv} added successfully with image URL and ujemanja.`);
    }
    console.log('All entities added successfully.');
  } catch (error) {
    console.error('Error adding entities: ', error);
  }
};

addEntitiesToFirestore();
