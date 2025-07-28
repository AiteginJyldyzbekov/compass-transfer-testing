/**
 * Улучшенный скрипт для генерации структурированной документации API на основе OpenAPI спецификации
 * Создает отдельные файлы для каждого эндпоинта для более удобной работы с документацией
 *
 * Использование:
 * node generate-api-docs-improved.js
 */

import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
// Получение текущей директории в ES модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Пути к файлам
const INPUT_FILE = path.join(__dirname, '../docs/api/v1.json');
const OUTPUT_DIR = path.join(__dirname, '../docs/api-documentation');
const INDEX_FILE = path.join(OUTPUT_DIR, 'index.md');

/**
 * Основная функция скрипта
 */
async function main() {
  try {
    // Загрузка и парсинг JSON файла
    const apiSpec = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
    // Извлечение групп API (тегов)
    const tags = extractUniqueTags(apiSpec);
    // Группировка эндпоинтов по тегам
    const groupedEndpoints = groupEndpointsByTag(apiSpec, tags);

    // Создание директории для документации, если она не существует
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    // Генерация индексного файла
    const indexContent = generateIndexFile(apiSpec, tags);

    fs.writeFileSync(INDEX_FILE, indexContent, 'utf8');
    // Генерация файлов для каждой группы API
    for (const tag of tags) {
      // Создание директории для группы API
      const tagDir = path.join(OUTPUT_DIR, tag.toLowerCase());

      if (!fs.existsSync(tagDir)) {
        fs.mkdirSync(tagDir, { recursive: true });
      }
      // Генерация индексного файла для группы API
      const tagIndexContent = generateTagIndexFile(apiSpec, tag, groupedEndpoints[tag]);
      const tagIndexFile = path.join(tagDir, 'index.md');

      fs.writeFileSync(tagIndexFile, tagIndexContent, 'utf8');
      // Генерация отдельных файлов для каждого эндпоинта
      for (const { path: endpointPath, method, endpoint } of groupedEndpoints[tag]) {
        // Создание имени файла на основе пути и метода
        const fileName = generateEndpointFileName(endpointPath, method);
        const endpointFile = path.join(tagDir, `${fileName}.md`);
        // Генерация документации для эндпоинта
        const endpointContent = generateEndpointDocumentation(
          apiSpec,
          tag,
          endpointPath,
          method,
          endpoint
        );

        // Сохранение документации в файл
        fs.writeFileSync(endpointFile, endpointContent, 'utf8');
      }
      // Генерация файла с моделями данных для группы API
      const usedSchemas = collectUsedSchemas(apiSpec, groupedEndpoints[tag]);

      if (usedSchemas.size > 0) {
        const modelsContent = generateModelsDocumentation(apiSpec, usedSchemas);
        const modelsFile = path.join(tagDir, 'models.md');

        fs.writeFileSync(modelsFile, modelsContent, 'utf8');
      }
    }
  } catch (error) {
    console.error('Ошибка при генерации документации API:', error);
  }
}

/**
 * Извлечение уникальных тегов из спецификации API
 */
function extractUniqueTags(apiSpec) {
  const tagsSet = new Set();

  // Перебор всех путей и методов
  for (const path in apiSpec.paths) {
    for (const method in apiSpec.paths[path]) {
      const endpoint = apiSpec.paths[path][method];

      if (endpoint.tags && endpoint.tags.length > 0) {
        endpoint.tags.forEach(tag => tagsSet.add(tag));
      }
    }
  }

  // Преобразование Set в массив и сортировка
  return Array.from(tagsSet).sort();
}

/**
 * Группировка эндпоинтов по тегам
 */
function groupEndpointsByTag(apiSpec, tags) {
  const groupedEndpoints = {};

  // Инициализация групп
  tags.forEach(tag => {
    groupedEndpoints[tag] = [];
  });
  // Перебор всех путей и методов
  for (const path in apiSpec.paths) {
    for (const method in apiSpec.paths[path]) {
      const endpoint = apiSpec.paths[path][method];

      if (endpoint.tags && endpoint.tags.length > 0) {
        // Добавление эндпоинта в соответствующую группу
        endpoint.tags.forEach(tag => {
          groupedEndpoints[tag].push({
            path,
            method: method.toUpperCase(),
            endpoint,
          });
        });
      }
    }
  }

  return groupedEndpoints;
}

/**
 * Генерация имени файла для эндпоинта
 */
function generateEndpointFileName(path, method) {
  // Преобразование пути в имя файла
  const pathPart = path.replace(/\//g, '-').replace(/[{}]/g, '').replace(/^-/, '').toLowerCase();

  return `${method.toLowerCase()}-${pathPart}`;
}

/**
 * Генерация индексного файла
 */
function generateIndexFile(apiSpec, tags) {
  let doc = `# ${apiSpec.info.title} - Документация API\n\n`;

  // Добавление информации о версии
  doc += `**Версия API:** ${apiSpec.info.version}\n\n`;
  // Добавление описания
  doc += `## Обзор API\n\n`;
  if (apiSpec.info.description) {
    doc += `${apiSpec.info.description}\n\n`;
  } else {
    doc += `Данный документ содержит полное описание REST API ${apiSpec.info.title}, организованное по логическим группам.\n\n`;
  }
  // Добавление базового URL
  doc += `## Базовый URL\n\n`;
  if (apiSpec.servers && apiSpec.servers.length > 0) {
    doc += `\`\`\`\n${apiSpec.servers[0].url}\n\`\`\`\n\n`;
  }
  // Создание оглавления с ссылками на группы API
  doc += `## Группы API\n\n`;
  tags.forEach(tag => {
    doc += `- [${tag}](./${tag.toLowerCase()}/)\n`;
  });

  return doc;
}

/**
 * Генерация индексного файла для группы API
 */
function generateTagIndexFile(apiSpec, tag, endpoints) {
  let doc = `# ${tag} API\n\n`;

  // Добавление информации о версии
  doc += `**Версия API:** ${apiSpec.info.version}\n\n`;
  // Добавление описания группы API
  const tagInfo = apiSpec.tags?.find(t => t.name === tag);

  if (tagInfo && tagInfo.description) {
    doc += `## Описание\n\n${tagInfo.description}\n\n`;
  }
  // Добавление ссылки на главную страницу
  doc += `[← Вернуться к списку групп API](../)\n\n`;
  // Добавление списка эндпоинтов с ссылками на отдельные файлы
  doc += `## Эндпоинты\n\n`;
  endpoints.forEach(({ path, method }) => {
    const fileName = generateEndpointFileName(path, method);

    doc += `- [${method} ${path}](./${fileName}.md)\n`;
  });
  // Добавление ссылки на модели данных, если они есть
  const usedSchemas = collectUsedSchemas(apiSpec, endpoints);

  if (usedSchemas.size > 0) {
    doc += `\n## Модели данных\n\n`;
    doc += `- [Просмотреть все модели данных](./models.md)\n`;
  }

  return doc;
}

/**
 * Сбор всех используемых схем для группы эндпоинтов
 */
function collectUsedSchemas(apiSpec, endpoints) {
  const usedSchemas = new Set();

  endpoints.forEach(({ endpoint }) => {
    // Схемы из тела запроса
    if (endpoint.requestBody?.content?.['application/json']?.schema) {
      const schema = endpoint.requestBody.content['application/json'].schema;

      collectSchemasFromRef(schema, usedSchemas);
    }
    // Схемы из ответов
    if (endpoint.responses) {
      for (const statusCode in endpoint.responses) {
        const response = endpoint.responses[statusCode];

        if (response.content?.['application/json']?.schema) {
          const schema = response.content['application/json'].schema;

          collectSchemasFromRef(schema, usedSchemas);
        }
      }
    }
    // Схемы из параметров
    if (endpoint.parameters) {
      endpoint.parameters.forEach(param => {
        if (param.schema) {
          collectSchemasFromRef(param.schema, usedSchemas);
        }
      });
    }
  });

  return usedSchemas;
}

/**
 * Рекурсивный сбор схем из ссылок
 */
function collectSchemasFromRef(schema, usedSchemas) {
  if (!schema) return;
  if (schema.$ref) {
    const refName = getRefName(schema.$ref);

    usedSchemas.add(refName);
  } else if (schema.type === 'array' && schema.items) {
    collectSchemasFromRef(schema.items, usedSchemas);
  } else if (schema.type === 'object') {
    if (schema.properties) {
      for (const propName in schema.properties) {
        collectSchemasFromRef(schema.properties[propName], usedSchemas);
      }
    }
    if (schema.additionalProperties) {
      collectSchemasFromRef(schema.additionalProperties, usedSchemas);
    }
  } else if (schema.allOf) {
    schema.allOf.forEach(subSchema => collectSchemasFromRef(subSchema, usedSchemas));
  } else if (schema.oneOf) {
    schema.oneOf.forEach(subSchema => collectSchemasFromRef(subSchema, usedSchemas));
  } else if (schema.anyOf) {
    schema.anyOf.forEach(subSchema => collectSchemasFromRef(subSchema, usedSchemas));
  }
}

/**
 * Генерация документации для отдельного эндпоинта
 */
function generateEndpointDocumentation(apiSpec, tag, path, method, endpoint) {
  let doc = `# ${method} ${path}\n\n`;

  // Добавление информации о версии
  doc += `**Версия API:** ${apiSpec.info.version}\n\n`;
  // Добавление ссылки на индекс группы API
  doc += `[← Вернуться к ${tag} API](./)\n\n`;
  // Добавление описания
  if (endpoint.description) {
    doc += `## Описание\n\n${endpoint.description
      .replace(/<\/?p>/g, '')
      .replace(/<\/?strong>/g, '**')}\n\n`;
  } else if (endpoint.summary) {
    doc += `## Описание\n\n${endpoint.summary}\n\n`;
  }
  // Добавление параметров
  if (endpoint.parameters && endpoint.parameters.length > 0) {
    doc += `## Параметры запроса\n\n`;
    doc += `| Имя | Расположение | Обязательный | Тип | Описание |\n`;
    doc += `| --- | ------------ | ------------ | --- | -------- |\n`;
    endpoint.parameters.forEach(param => {
      const required = param.required ? 'Да' : 'Нет';
      const type = param.schema ? getTypeString(param.schema) : '';
      const description = param.description || '';

      doc += `| ${param.name} | ${param.in} | ${required} | ${type} | ${description} |\n`;
    });
    doc += '\n';
  }
  // Добавление тела запроса
  if (endpoint.requestBody) {
    doc += `## Тело запроса\n\n`;
    const content = endpoint.requestBody.content;

    if (content && content['application/json']) {
      const schema = content['application/json'].schema;

      if (schema) {
        if (schema.$ref) {
          const schemaName = getRefName(schema.$ref);

          doc += `Схема: [${schemaName}](./models.md#${schemaName.toLowerCase()})\n\n`;
          // Добавление примера запроса, если есть схема
          const schemas = apiSpec.components?.schemas || {};
          const schemaObj = schemas[schemaName];

          if (schemaObj) {
            doc += `<details>\n<summary>Пример запроса</summary>\n\n\`\`\`json\n${generateSchemaExample(
              schemaObj,
              schemas
            )}\n\`\`\`\n</details>\n\n`;
          }
        } else if (schema.type === 'array' && schema.items) {
          if (schema.items.$ref) {
            const schemaName = getRefName(schema.items.$ref);

            doc += `Массив объектов типа: [${schemaName}](./models.md#${schemaName.toLowerCase()})\n\n`;
          } else {
            doc += `Массив объектов типа: ${schema.items.type}\n\n`;
          }
        } else if (schema.type) {
          doc += `Тип: ${schema.type}\n\n`;
          if (schema.description) {
            doc += `Описание: ${schema.description}\n\n`;
          }
        }
      }
    }
  }
  // Добавление ответов
  if (endpoint.responses) {
    doc += `## Ответы\n\n`;
    doc += `| Код | Описание | Схема ответа |\n`;
    doc += `| --- | -------- | ------------ |\n`;
    for (const statusCode in endpoint.responses) {
      const response = endpoint.responses[statusCode];
      let schemaInfo = '-';

      if (
        response.content &&
        response.content['application/json'] &&
        response.content['application/json'].schema
      ) {
        const schema = response.content['application/json'].schema;

        if (schema.$ref) {
          const schemaName = getRefName(schema.$ref);

          schemaInfo = `[${schemaName}](./models.md#${schemaName.toLowerCase()})`;
        } else if (schema.type) {
          schemaInfo = schema.type;
          if (schema.format) {
            schemaInfo += ` (${schema.format})`;
          }
        }
      }
      doc += `| ${statusCode} | ${response.description} | ${schemaInfo} |\n`;
    }
    doc += '\n';
  }

  return doc;
}

/**
 * Генерация документации для моделей данных
 */
function generateModelsDocumentation(apiSpec, usedSchemas) {
  let doc = `# Модели данных\n\n`;

  // Добавление ссылки на индекс группы API
  doc += `[← Вернуться к списку эндпоинтов](./)\n\n`;
  // Получение всех схем из спецификации
  const schemas = apiSpec.components?.schemas || {};

  // Добавление используемых схем
  Array.from(usedSchemas)
    .sort()
    .forEach(schemaName => {
      const schema = schemas[schemaName];

      if (schema) {
        doc += generateSchemaSection(schemaName, schema, schemas);
      }
    });

  return doc;
}

/**
 * Генерация раздела документации для схемы данных
 */
function generateSchemaSection(schemaName, schema, allSchemas) {
  let section = `## ${schemaName}\n\n`;

  // Добавление описания
  if (schema.description) {
    section += `**Описание:** ${schema.description}\n\n`;
  }
  // Добавление типа
  if (schema.type) {
    section += `**Тип:** ${schema.type}\n\n`;
  }
  // Добавление свойств для объектов
  if (schema.type === 'object' && schema.properties) {
    section += `**Свойства:**\n\n`;
    section += `| Имя | Тип | Обязательное | Описание |\n`;
    section += `| --- | --- | ------------ | -------- |\n`;
    for (const propName in schema.properties) {
      const prop = schema.properties[propName];
      const required = schema.required && schema.required.includes(propName) ? 'Да' : 'Нет';
      const type = getTypeString(prop);
      const description = prop.description || '';

      section += `| ${propName} | ${type} | ${required} | ${description} |\n`;
    }
    section += '\n';
  }
  // Добавление элементов для массивов
  if (schema.type === 'array' && schema.items) {
    section += `**Элементы массива:** ${getTypeString(schema.items)}\n\n`;
  }
  // Добавление примера
  section += `**Пример:**\n\n\`\`\`json\n${generateSchemaExample(schema, allSchemas)}\n\`\`\`\n\n`;
  section += '---\n\n';

  return section;
}

/**
 * Получение имени типа из ссылки на схему
 */
function getRefName(ref) {
  const parts = ref.split('/');

  return parts[parts.length - 1];
}

/**
 * Получение строкового представления типа
 */
function getTypeString(schema) {
  if (schema.$ref) {
    const refName = getRefName(schema.$ref);

    return `[${refName}](#${refName.toLowerCase()})`;
  }
  let typeStr = schema.type || '';

  if (schema.format) {
    typeStr += ` (${schema.format})`;
  }
  if (schema.type === 'array' && schema.items) {
    if (schema.items.$ref) {
      const refName = getRefName(schema.items.$ref);

      typeStr += ` of [${refName}](#${refName.toLowerCase()})`;
    } else {
      typeStr += ` of ${schema.items.type}`;
    }
  }

  return typeStr;
}

/**
 * Генерация примера данных для схемы
 */
function generateSchemaExample(schema, allSchemas, depth = 0) {
  // Ограничение глубины рекурсии
  if (depth > 3) {
    return '"..."';
  }
  // Обработка ссылок на другие схемы
  if (schema.$ref) {
    const refName = getRefName(schema.$ref);
    const refSchema = allSchemas[refName];

    if (refSchema) {
      return generateSchemaExample(refSchema, allSchemas, depth + 1);
    }

    return '{}';
  }
  // Обработка разных типов данных
  switch (schema.type) {
    case 'object':
      if (!schema.properties) return '{}';
      const obj = {};

      for (const propName in schema.properties) {
        obj[propName] = JSON.parse(
          generateSchemaExample(schema.properties[propName], allSchemas, depth + 1)
        );
      }

      return JSON.stringify(obj, null, 2);
    case 'array':
      if (!schema.items) return '[]';
      const item = JSON.parse(generateSchemaExample(schema.items, allSchemas, depth + 1));

      return JSON.stringify([item], null, 2);
    case 'string':
      if (schema.format === 'date-time') return '"2023-01-01T00:00:00Z"';
      if (schema.format === 'date') return '"2023-01-01"';
      if (schema.format === 'email') return '"user@example.com"';
      if (schema.format === 'uuid') return '"00000000-0000-0000-0000-000000000000"';
      if (schema.enum) return `"${schema.enum[0]}"`;

      return '"example"';
    case 'number':
    case 'integer':
      return '0';
    case 'boolean':
      return 'false';
    default:
      return 'null';
  }
}

// Запуск скрипта
main().catch(error => {
  console.error('Ошибка при выполнении скрипта:', error);
  process.exit(1);
});
