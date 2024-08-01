create TABLE message(
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  text VARCHAR(255) NOT NULL,
  date VARCHAR(255) NOT NULL,
  comment VARCHAR(255)
);


create TABLE agree(
  id SERIAL NOT NULL,
  name VARCHAR(255) NOT NULL,
  text VARCHAR(255) NOT NULL,
  date VARCHAR(255) NOT NULL,
  comment VARCHAR(255)
);


create TABLE disagree(
  id SERIAL NOT NULL,
  name VARCHAR(255) NOT NULL,
  text VARCHAR(255) NOT NULL,
  date VARCHAR(255) NOT NULL,
  comment VARCHAR(255)
);


create TABLE comment(
  id SERIAL NOT NULL,
  name VARCHAR(255) NOT NULL,
  text VARCHAR(255) NOT NULL,
  date VARCHAR(255) NOT NULL,
  comment VARCHAR(255)
);