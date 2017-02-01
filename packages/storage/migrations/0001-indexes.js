export const up = (db, next) => {
  db.collections().then((collections) => {
    const collectionNames = collections.map(({ collectionName }) => collectionName);
    const promises = [];
    ['User', 'Account'].forEach((collection) => {
      if (!collectionNames.includes(collection)) {
        promises.push(db.createCollection(collection));
      }
    });

    Promise.all(promises).then(() => (
      Promise.all([
        db.collection('Account').createIndex({ name: 1 }, { background: true }),

        db.collection('User').createIndex({ accountId: 1 }, { background: true }),
        db.collection('User').createIndex({ username: 1 }, { background: true, unique: true }),
        db.collection('User').createIndex({ email: 1 }, { background: true, unique: true }),
      ])
    ))
      .then(() => next())
      .catch(next);
  });
};

export const down = (db, next) => next();
