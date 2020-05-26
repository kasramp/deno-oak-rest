CREATE TABLE IF NOT EXISTS users (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(512) NOT NULL,
  last_name VARCHAR(512) NOT NULL,
  age INTEGER NOT NULL
) engine=InnoDB;


INSERT IGNORE INTO users VALUES(1, "John", "Wick", 41);
INSERT IGNORE INTO users VALUES(2, "Jeo", "Deo", 35);
INSERT IGNORE INTO users VALUES(3, "Brad", "Pitt", 50);