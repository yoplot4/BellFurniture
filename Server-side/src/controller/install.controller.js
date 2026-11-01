import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const splitSqlStatements = (sql) => {
  const statements = [];
  let statement = '';
  let quote = null;
  let index = 0;

  while (index < sql.length) {
    const character = sql[index];
    const nextCharacter = sql[index + 1];

    if (quote) {
      statement += character;

      if (character === '\\' && index + 1 < sql.length) {
        statement += sql[index + 1];
        index += 2;
        continue;
      }

      if (character === quote) {
        if (nextCharacter === quote) {
          statement += nextCharacter;
          index += 2;
          continue;
        }
        quote = null;
      }

      index += 1;
      continue;
    }

    if (character === "'" || character === '"' || character === '`') {
      quote = character;
      statement += character;
      index += 1;
      continue;
    }

    if (character === '/' && nextCharacter === '*') {
      const commentEnd = sql.indexOf('*/', index + 2);
      if (commentEnd === -1) {
        throw new Error('Unterminated block comment in migration.sql');
      }
      statement += ' ';
      index = commentEnd + 2;
      continue;
    }

    if (character === '#' || (
      character === '-' &&
      nextCharacter === '-' &&
      (index + 2 === sql.length || /\s/.test(sql[index + 2]))
    )) {
      while (index < sql.length && sql[index] !== '\n' && sql[index] !== '\r') {
        index += 1;
      }
      statement += ' ';
      continue;
    }

    if (character === ';') {
      const trimmedStatement = statement.trim();
      if (trimmedStatement) {
        statements.push(trimmedStatement);
      }
      statement = '';
      index += 1;
      continue;
    }

    statement += character;
    index += 1;
  }

  if (quote) {
    throw new Error('Unterminated quoted value in migration.sql');
  }

  const finalStatement = statement.trim();
  if (finalStatement) {
    statements.push(finalStatement);
  }

  return statements;
};

export const installController = async (req, res) => {
  let connection;
  let executionCount = 0;
  let installationError;

  try {
    const sqlFilePath = path.join(__dirname, '../dbConfig/migration.sql');
    const sqlContent = await readFile(sqlFilePath, 'utf8');
    const sqlStatements = splitSqlStatements(sqlContent);

    if (sqlStatements.length === 0) {
      throw new Error('migration.sql does not contain any SQL statements');
    }

    const connectionConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    };

    connection = await mysql.createConnection(connectionConfig);

    for (const query of sqlStatements) {
      await connection.query(query);
      executionCount += 1;
    }
  } catch (error) {
    installationError = error;
    console.error('Database installation failed:', error);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (error) {
        console.error('Failed to close database installation connection:', error);
        if (!installationError) {
          installationError = error;
        }
      }
    }
  }

  if (installationError) {
    return res.status(500).json({
      success: false,
      message: 'Database installation failed. Check the server logs for details.',
    });
  }

  return res.status(200).json({
    success: true,
    message: `Database installation complete. Successfully executed ${executionCount} statements.`,
  });
};
