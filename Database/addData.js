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
    opis: 'dodati opis',
    pozLastnosti: 'Lepota, Koristnost',
    negLastnosti: 'Razdražljivost, Divjost, Občutljivost',
    slika: './images/konj.jpeg',
    kategorija: 'Zivali',
  },
  {
    idEntiteta: 2,
    naziv: 'Pes',
    opis: 'dodati opis',
    pozLastnosti: 'Zvestoba, Zaščitništvo, Učljivost, Pripadnost',
    negLastnosti: 'Ljubosumnost, Vodljivost',
    slika: './images/pes.jpg',
    kategorija: 'Zivali'
  },
  {
    idEntiteta: 3,
    naziv: 'Sova',
    opis: 'dodati opis',
    pozLastnosti: 'Dar za opazovanj, Resnost, Modrost, Previdnost, Čuječnost',
    negLastnosti: 'Zaspanost, Lenobnost',
    slika: './images/sova.jpg',
    kategorija: 'Zivali'
  },
  {
    idEntiteta: 4,
    naziv: 'Medved',
    opis: 'dodati opis',
    pozLastnosti: 'Moč, Zaščitništvo, Razigranost, Dobrodušnost',
    negLastnosti: 'Grobost, Godrnjavost, Okrutnost',
    slika: './images/medved.jpg',
    kategorija: 'Zivali'
  },
  {
    idEntiteta: 5,
    naziv: 'Lev',
    opis: 'dodati opis',
    pozLastnosti: 'Ponos, Vsemogočnost, Samozavest, Veličastvenost',
    negLastnosti: 'Krvoločnost, Vzvišenost, Požrešnost',
    slika: './images/lev.jpeg',
    kategorija: 'Zivali'
  },
  {
    idEntiteta: 6,
    naziv: 'Lisica',
    opis: 'dodati opis',
    pozLastnosti: 'Zvitost, Bistrost, Prilagodljivost',
    negLastnosti: 'Preračunljivost, Kradljivost, Zahrbtnost',
    slika: './images/lisica.jpg',
    kategorija: 'Zivali'
  },
  {
    idEntiteta: 7,
    naziv: 'Opica',
    opis: 'dodati opis',
    pozLastnosti: 'Nagajivost, Veselje, Inteligentnost',
    negLastnosti: 'Kradljivost, Prepirljivost, Požrešnost',
    slika: './images/opica.jpeg',
    kategorija: 'Zivali'
  },
  {
    idEntiteta: 8,
    naziv: 'Zajec',
    opis: 'dodati opis',
    pozLastnosti: 'Hitrost, Ljubkost, Previdnost, Dobrosrčnost',
    negLastnosti: 'Plašnost, Strahopetnost, Prestrašenost',
    slika: './images/zajec.jpeg',
    kategorija: 'Zivali'
  },
  {
    idEntiteta: 9,
    naziv: 'Mačka',
    opis: 'dodati opis',
    pozLastnosti: 'Igrivost, Svobodnost, Okretnost',
    negLastnosti: 'Zahrbtnost, Popadljivost, Kradljivost',
    slika: './images/macka.jpg',
    kategorija: 'Zivali'
  },
  {
    idEntiteta: 10,
    naziv: 'Galeb',
    opis: 'dodati opis',
    pozLastnosti: 'Elegantnost, Gibčnost, Lepota',
    negLastnosti: 'Kradljivost, Požrešnost, Prepirljivost',
    slika: './images/galeb.jpeg',
    kategorija: 'Zivali'
  },
  {
    idEntiteta: 11,
    naziv: 'Mravlja',
    opis: 'dodati opis',
    pozLastnosti: 'Pridnost, Organiziranost, Altruizem',
    negLastnosti: 'Bojevitost, Trmoglavost, Napadalnost',
    slika: './images/mravlja.jpg',
    kategorija: 'Zivali'
  },
  {
    idEntiteta: 12,
    naziv: 'Orel',
    opis: 'dodati opis',
    pozLastnosti: 'Plemenitost, Vzvišenost, Ponos, Pogum',
    negLastnosti: 'Neusmiljenost, Krvoločnost, Plenjenje, Krutost',
    slika: './images/orel.jpeg',
    kategorija: 'Zivali'
  },
  {
    idEntiteta: 13,
    naziv: 'Slon',
    opis: 'dodati opis',
    pozLastnosti: 'Moč, Delavnost, Bistrost',
    negLastnosti: 'Nerodnost, Svojeglavost, Požrešnost, Razdiralnost',
    slika: './images/slon.jpg',
    kategorija: 'Zivali'
  },
  {
    idEntiteta: 14,
    naziv: 'Srna',
    opis: 'dodati opis',
    pozLastnosti: 'Nedolžnost, Prisrčnost, Spretnost, Ljubkost',
    negLastnosti: 'Plahost, Nezaupljivost, Občutljivost',
    slika: './images/srna.jpg',
    kategorija: 'Zivali'
  },
  {
    idEntiteta: 15,
    naziv: 'Čebela',
    opis: 'dodati opis',
    pozLastnosti: 'Delavnost, Koristnost, Aktivnost',
    negLastnosti: 'Napadalnost, Nadležnost',
    slika: './images/cebela.jpeg',
    kategorija: 'Zivali'
  },
  {
    idEntiteta: 16,
    naziv: 'Bik',
    opis: 'dodati opis',
    pozLastnosti: 'Moč, Borbenost, Vztrajnost, Energičnost',
    negLastnosti: 'Divjost, Razdražljivost, Trmavost, Zaletavost, Impulzivnost',
    slika: './images/bik.jpeg',
    kategorija: 'Zivali'
  },
  {
    idEntiteta: 20,
    naziv: 'Rdeca',
    opis: 'dodati opis',
    pozLastnosti: 'Moč, Borbenost, Vztrajnost, Energičnost',
    negLastnosti: 'Divjost, Razdražljivost, Trmavost, Zaletavost, Impulzivnost',
    slika: './images/rdeca.jpg',
    kategorija: 'Barve'
  },
  {
    idEntiteta: 21,
    naziv: 'Modra',
    opis: 'dodati opis',
    pozLastnosti: 'Moč, Borbenost, Vztrajnost, Energičnost',
    negLastnosti: 'Divjost, Razdražljivost, Trmavost, Zaletavost, Impulzivnost',
    slika: './images/modra.jpg',
    kategorija: 'Barve'
  }
];

let ujemanjaTable = {
  Konj: { Pes: 3, Sova: 5, Medved: 4, Lev: 3, Lisica: 4, Opica: 2, Zajec: 3, Mačka: 3, Galeb: 3, Mravlja: 2, Orel: 4, Slon: 1, Srna: 3, Čebela: 2, Bik: 4 },
  Pes: { Konj: 3, Sova: 5, Medved: 5, Lev: 4, Lisica: 5, Opica: 1, Zajec: 4, Mačka: 4, Galeb: 4, Mravlja: 3, Orel: 5, Slon: 2, Srna: 4, Čebela: 2, Bik: 5 },
  Sova: { Konj: 5, Pes: 5, Medved: 2, Lev: 3, Lisica: 2, Opica: 5, Zajec: 4, Mačka: 2, Galeb: 4, Mravlja: 5, Orel: 2, Slon: 5, Srna: 4, Čebela: 5, Bik: 3 },
  Medved: { Konj: 4, Pes: 5, Sova: 2, Lev: 1, Lisica: 1, Opica: 4, Zajec: 2, Mačka: 2, Galeb: 2, Mravlja: 5, Orel: 2, Slon: 3, Srna: 2, Čebela: 5, Bik: 1 },
  Lev: { Konj: 3, Pes: 4, Sova: 3, Medved: 1, Lisica: 2, Opica: 4, Zajec: 2, Mačka: 2, Galeb: 2, Mravlja: 5, Orel: 2, Slon: 3, Srna: 2, Čebela: 5, Bik: 3 },
  Lisica: { Konj: 4, Pes: 5, Sova: 2, Medved: 1, Lev: 2, Opica: 4, Zajec: 2, Mačka: 3, Galeb: 3, Mravlja: 5, Orel: 1, Slon: 4, Srna: 3, Čebela: 5, Bik: 1 },
  Opica: { Konj: 2, Pes: 1, Sova: 5, Medved: 4, Lev: 4, Lisica: 4, Zajec: 4, Mačka: 3, Galeb: 4, Mravlja: 3, Orel: 4, Slon: 1, Srna: 3, Čebela: 3, Bik: 5 },
  Zajec: { Konj: 3, Pes: 4, Sova: 4, Medved: 2, Lev: 2, Lisica: 2, Opica: 4, Mačka: 2, Galeb: 1, Mravlja: 5, Orel: 3, Slon: 3, Srna: 1, Čebela: 5, Bik: 2 },
  Mačka: { Konj: 3, Pes: 4, Sova: 2, Medved: 2, Lev: 2, Lisica: 3, Opica: 3, Zajec: 2, Galeb: 2, Mravlja: 5, Orel: 4, Slon: 2, Srna: 2, Čebela: 5, Bik: 3 },
  Galeb: { Konj: 3, Pes: 4, Sova: 4, Medved: 2, Lev: 2, Lisica: 3, Opica: 4, Zajec: 1, Mačka: 2, Mravlja: 5, Orel: 4, Slon: 3, Srna: 1, Čebela: 5, Bik: 2 },
  Mravlja: { Konj: 2, Pes: 3, Sova: 5, Medved: 5, Lev: 5, Lisica: 5, Opica: 3, Zajec: 5, Mačka: 5, Galeb: 5, Orel: 5, Slon: 3, Srna: 4, Čebela: 1, Bik: 5 },
  Orel: { Konj: 4, Pes: 5, Sova: 2, Medved: 2, Lev: 2, Lisica: 1, Opica: 4, Zajec: 3, Mačka: 4, Galeb: 4, Mravlja: 5, Slon: 3, Srna: 4, Čebela: 1, Bik: 5 },
  Slon: { Konj: 3, Pes: 4, Sova: 4, Medved: 2, Lev: 2, Lisica: 3, Opica: 3, Zajec: 1, Mačka: 2, Galeb: 3, Mravlja: 3, Orel: 4, Srna: 2, Čebela: 3, Bik: 4 },
  Srna: { Konj: 3, Pes: 4, Sova: 4, Medved: 2, Lev: 2, Lisica: 3, Opica: 3, Zajec: 1, Mačka: 2, Galeb: 1, Mravlja: 4, Orel: 4, Slon: 2, Čebela: 2, Bik: 2 },
  Čebela: { Konj: 2, Pes: 2, Sova: 5, Medved: 5, Lev: 5, Lisica: 5, Opica: 3, Zajec: 5, Mačka: 5, Galeb: 5, Mravlja: 1, Orel: 5, Slon: 3, Srna: 4, Bik: 5 },
  Bik: { Konj: 4, Pes: 5, Sova: 3, Medved: 1, Lev: 3, Lisica: 1, Opica: 5, Zajec: 2, Mačka: 3, Galeb: 2, Mravlja: 5, Orel: 2, Slon: 4, Srna: 2, Čebela: 5 }
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
