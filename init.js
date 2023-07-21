// Enable authentication
db = db.getSiblingDB('admin');
db.runCommand({ setParameter: 1, authentication: true });

// Create admin user
db = db.getSiblingDB('admin');
db.createUser({
  user: 'admin',
  pwd: 'pass',
  roles: ['root']
});

// Switch to imageDatabase
db = db.getSiblingDB('imageDatabase');
db.createUser({
  user: 'admin',
  pwd: 'pass',
  roles: [{ role: 'dbOwner', db: 'imageDatabase' }]
});