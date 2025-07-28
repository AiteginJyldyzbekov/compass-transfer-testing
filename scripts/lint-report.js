#!/usr/bin/env node

const OUTPUT_DIR = './reports';
const OUTPUT_FILE = `${OUTPUT_DIR}/lint-report.html`;

async function run() {
  const { execSync } = await import('node:child_process');
  const fs = await import('node:fs');
  const path = await import('node:path');

  try {
    // Запускаем ESLint с выводом в формате JSON
    const result = execSync('npx eslint . --ext .js,.jsx,.ts,.tsx --format json', {
      encoding: 'utf-8',
    });
    const report = JSON.parse(result);
    const errorCount = report.reduce((sum, file) => sum + file.errorCount, 0);
    const warningCount = report.reduce((sum, file) => sum + file.warningCount, 0);

    // Генерируем HTML-отчёт
    const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>ESLint Report</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #f8f9fa; color: #222; margin: 0; padding: 0; }
    .container { max-width: 900px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; padding: 32px; }
    h1 { margin-top: 0; }
    .summary { margin-bottom: 24px; }
    .summary span { display: inline-block; margin-right: 24px; font-weight: 500; }
    .error { color: #c00; font-weight: bold; }
    .warning { color: #e6a700; font-weight: bold; }
    .file { margin-bottom: 24px; }
    .filename { font-weight: bold; margin-bottom: 8px; }
    .message { margin-left: 16px; padding: 8px 12px; border-radius: 4px; margin-bottom: 4px; }
    .error-bg { background: #ffeaea; border-left: 4px solid #c00; }
    .warning-bg { background: #fffbe6; border-left: 4px solid #e6a700; }
    code { background: #f3f3f3; border-radius: 3px; padding: 2px 4px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>ESLint Report</h1>
    <div class="summary">
      <span class="error">Ошибок: ${errorCount}</span>
      <span class="warning">Предупреждений: ${warningCount}</span>
      <span>Файлов: ${report.length}</span>
    </div>
    ${report
      .map(file =>
        file.messages.length === 0
          ? ''
          : `
      <div class="file">
        <div class="filename">${file.filePath.replace(process.cwd() + path.sep, '')}</div>
        ${file.messages
          .map(
            msg => `
          <div class="message ${msg.severity === 2 ? 'error-bg' : 'warning-bg'}">
            <span class="${msg.severity === 2 ? 'error' : 'warning'}">${msg.severity === 2 ? 'Ошибка' : 'Предупреждение'}</span>
            <span> [${msg.ruleId || 'no-rule'}]</span>
            <br>
            <span>Строка: <code>${msg.line}</code>, Символ: <code>${msg.column}</code></span>
            <br>
            <span>${msg.message}</span>
          </div>
        `,
          )
          .join('')}
      </div>
    `,
      )
      .join('')}
  </div>
</body>
</html>`;

    // Создаём папку reports, если нет
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    fs.writeFileSync(OUTPUT_FILE, html);

    if (errorCount > 0) {
      console.error(`\n❌ Lint errors found: ${errorCount}`);
      process.exit(1);
    } else if (warningCount > 0) {
      console.warn(`\n⚠️  Lint warnings found: ${warningCount}`);
      process.exit(0);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('\nFailed to run ESLint:', err.message);
    process.exit(1);
  }
}

run();
