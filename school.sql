CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,  -- Auto incrementing ID for each school
  name VARCHAR(255) NOT NULL,         -- Name of the school (required field)
  address VARCHAR(255),               -- Address of the school
  latitude FLOAT,                     -- Latitude of the school's location
  longitude FLOAT                     -- Longitude of the school's location
);
