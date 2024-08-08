create TABLE message(
  id SERIAL PRIMARY KEY NOT NULL,
  cardid VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  tgid VARCHAR NOT NULL,
  typeproduct VARCHAR,
  otherproduct VARCHAR,
  promotion VARCHAR NOT NULL,
  typework VARCHAR NOT NULL,
  target VARCHAR NOT NULL,
  viewer VARCHAR NOT NULL,
  effect VARCHAR,
  description VARCHAR NOT NULL,
  voiceover VARCHAR NOT NULL,
  timing VARCHAR NOT NULL,
  place VARCHAR,
  technicalspecification VARCHAR,
  deadline VARCHAR NOT NULL,
  comment VARCHAR
);


create TABLE agree(
  id SERIAL PRIMARY KEY NOT NULL,
  cardid VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  tgid VARCHAR NOT NULL,
  typeproduct VARCHAR,
  otherproduct VARCHAR,
  promotion VARCHAR NOT NULL,
  typework VARCHAR NOT NULL,
  target VARCHAR NOT NULL,
  viewer VARCHAR NOT NULL,
  effect VARCHAR,
  description VARCHAR NOT NULL,
  voiceover VARCHAR NOT NULL,
  timing VARCHAR NOT NULL,
  place VARCHAR,
  technicalspecification VARCHAR,
  deadline VARCHAR NOT NULL,
  comment VARCHAR
);


create TABLE disagree(
  id SERIAL PRIMARY KEY NOT NULL,
  cardid VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  tgid VARCHAR NOT NULL,
  typeproduct VARCHAR,
  otherproduct VARCHAR,
  promotion VARCHAR NOT NULL,
  typework VARCHAR NOT NULL,
  target VARCHAR NOT NULL,
  viewer VARCHAR NOT NULL,
  effect VARCHAR,
  description VARCHAR NOT NULL,
  voiceover VARCHAR NOT NULL,
  timing VARCHAR NOT NULL,
  place VARCHAR,
  technicalspecification VARCHAR,
  deadline VARCHAR NOT NULL,
  comment VARCHAR
);


create TABLE comment(
  id SERIAL PRIMARY KEY NOT NULL,
  cardid VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  tgid VARCHAR NOT NULL,
  typeproduct VARCHAR,
  otherproduct VARCHAR,
  promotion VARCHAR NOT NULL,
  typework VARCHAR NOT NULL,
  target VARCHAR NOT NULL,
  viewer VARCHAR NOT NULL,
  effect VARCHAR,
  description VARCHAR NOT NULL,
  voiceover VARCHAR NOT NULL,
  timing VARCHAR NOT NULL,
  place VARCHAR,
  technicalspecification VARCHAR,
  deadline VARCHAR NOT NULL,
  comment VARCHAR
);