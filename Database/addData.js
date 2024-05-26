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
    kategorija: 'Zivali'
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
  }
];

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
      console.log(`Document for ${entity.naziv} added successfully with image URL.`);
    }
    console.log('All entities added successfully.');
  } catch (error) {
    console.error('Error adding entities: ', error);
  }
};

addEntitiesToFirestore();
