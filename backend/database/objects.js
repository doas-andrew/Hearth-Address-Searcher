module.exports = [
    `DROP TABLE IF EXISTS tblProperty;`,
    `DROP FUNCTION IF EXISTS fn_tblProperty_tsv;`,
    // `DROP INDEX IF EXISTS idx_tblProperty_tsv;`,
    // `DROP TRIGGER IF EXISTS trgr_tblProperty_tsv on tblProperty;`,

    `CREATE TABLE tblProperty (
        property_id   SERIAL PRIMARY KEY,
        property_type TEXT,
        address       TEXT,
        city          TEXT,
        state         TEXT,
        state_abbrev  VARCHAR(10),
        zip           INT,
        price         FLOAT8,
        square_feet   FLOAT8,
        beds          INT,
        baths         FLOAT8,
        year_built    INT,
        date_created  TIMESTAMP NOT NULL DEFAULT(NOW()),
        url           TEXT,
        tsv           TSVECTOR
    );`,

    `CREATE FUNCTION fn_tblProperty_tsv() RETURNS TRIGGER AS $$
        BEGIN
          new.tsv :=
          setweight(to_tsvector('english', coalesce(new.property_type, '')), 'A') ||
          setweight(to_tsvector('english', coalesce(new.city,          '')), 'A') ||
          setweight(to_tsvector('english', coalesce(new.state,         '')), 'A') ||
          setweight(to_tsvector('english', coalesce(new.state_abbrev,  '')), 'B') ||
          setweight(to_tsvector('english', coalesce(new.address,       '')), 'C') ||
          setweight(to_tsvector(coalesce(cast(new.zip as text),        '')), 'D');
          return new;
        END
        $$ LANGUAGE plpgsql;`,

    `CREATE TRIGGER trgr_tblProperty_tsv BEFORE INSERT OR UPDATE
        ON tblProperty FOR EACH ROW EXECUTE PROCEDURE fn_tblProperty_tsv();`,

    `CREATE INDEX idx_tblProperty_tsv ON tblProperty USING GIN (tsv);`
]
