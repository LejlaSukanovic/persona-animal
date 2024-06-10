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
    slika: './images/konj.jpg',
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
    slika: './images/lev.jpg',
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
    slika: './images/opica.jpg',
    kategorija: 'Živali'
  },
  {
    idEntiteta: 8,
    naziv: 'Zajec',
    pozLastnosti: 'Hitrost, Ljubkost, Previdnost, Dobrosrčnost',
    negLastnosti: 'Plašnost, Strahopetnost, Prestrašenost',
    slika: './images/zajec.jpg',
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
    slika: './images/galeb.jpg',
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
    slika: './images/orel.jpg',
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
    slika: './images/cebela.jpg',
    kategorija: 'Živali'
  },
  {
    idEntiteta: 16,
    naziv: 'Bik',
    pozLastnosti: 'Moč, Borbenost, Vztrajnost, Energičnost',
    negLastnosti: 'Divjost, Razdražljivost, Trmavost, Zaletavost, Impulzivnost',
    slika: './images/bik.jpg',
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
