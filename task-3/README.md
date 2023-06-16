# ШРИ: Тулинг 2023

Тестовое задание

макс. 100 балл.

Дедлайн: 22 июн. 23:30

## Домашнее задание - Разработка в IDE и терминале - Написание правила для ESLint - ШРИ 2023

В современном ECMAScript код можно делить на модули (ESM, ES-модули). Для потребления кода и данных из другого модуля используется директива `import`, в которой указывается путь к используемому модулю.

Надо написать для ESLint плагин, в котором будет своё правило с фиксом.

- Правило должно проверять, отсортированы ли импорты по путям модулей и предлагать отсортировать их.
- Фикс должен сортировать импорты.
- Правило должно игнорировать вложенные в блочные конструкции динамические импорты `import()`.
- Правило должно перемещать комментарии к импорту вместе с этим импортом.

Порядок сортировки:

- группа импортов со scoped-путями или алиасами (начинающимися с `@`)
- пустая строка
- группа импортов npm-пакетов
- пустая строка
- группа импортов с относительными путями, не начинающимися с `./`
- пустая строка
- группа импортов с относительными путями, начинающимися с `./`
- пустая строка
- группа динамических импортов

Внутри каждой группы импортов пути должны быть отсортированы по алфавиту

**Пример**

Разрабатываемое правило должно заменять код

```js
import { createSelector } from 'reselect';
import type { ExperimentFlag } from '.';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { selectDeliveryDate } from '../../selectors';
```

на такой:

```js
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { createSelector } from 'reselect';

import { selectDeliveryDate } from '../../selectors';

import type { ExperimentFlag } from '.';
```

**Шаблон решения**

Система тестирования ожидает от посылки единственный файл с примерно следующей структурой:

```js
'use strict';

// возможный вспомогательный код тут

module.exports = {
  meta: {
    fixable: 'code'
  },

  create(context) {
    // основная логика плагина тут
  }
};
```

Справочно: варианты импорта

```js
import defaultExport from 'module-name';
import * as name from 'module-name';
import { export1 } from 'module-name';
import { export1 as alias1 } from 'module-name';
import { default as alias } from 'module-name';
import { export1, export2 } from 'module-name';
import { export1, export2 as alias2 /* … */ } from 'module-name';
import { 'string name' as alias } from 'module-name';
import defaultExport, { export1 /* … */ } from 'module-name';
import defaultExport, * as name from 'module-name';
import 'module-name';
```

Справочно: пути импорта:

- из npm-пакета `from "module-name"`
- из встроенного в node пакета `from "path"` `from "node:path"`
- из scoped-пакета `from "@scope/module-name"`
- возможно, алиасы и симлинки на папки внутри проекта для сокращения путей `from "@lib/module-name"`
- `from "/src/utils/module-name"`
- относительные пути разной степени вложенности `from "../../utils/module-name"`
- файлы в том же каталоге или его подкаталогах `from "./module-name"` `from "./components/module-name"`
- `data:`, например `import 'data:text/javascript,console.log("hello!");';`

**Полезные ссылки**

- AST Explorer: [https://astexplorer.net/](https://astexplorer.net/) **Нужно использовать парсер typescript-eslint/parser**
- Статьи: [https://clck.ru/rHL3Q](https://clck.ru/rHL3Q) [https://clck.ru/rHHgj](https://clck.ru/rHHgj)
- Видео: [https://youtu.be/EGsQ6LSitdE](https://youtu.be/EGsQ6LSitdE) [https://youtu.be/UytjCRXkdZg](https://youtu.be/UytjCRXkdZg)
- Документация по плагинам ESLint: [https://eslint.org/docs/developer-guide/working-with-plugins](https://eslint.org/docs/developer-guide/working-with-plugins)
- Документация по правилам ESLint: [https://eslint.org/docs/developer-guide/working-with-rules](https://eslint.org/docs/developer-guide/working-with-rules)

## Формат ввода

Произвольный код на js с импортами

## Формат вывода

Произвольный код на js с импортами, отсортированными и разделенными согласно условию.

### Пример 1

Ввод

```js
import fs from 'fs';
import path from 'path';

import \_ from 'lodash';
```

Вывод

```js
import fs from 'fs';
import \_ from 'lodash';
import path from 'path';
```

### Пример 2

Ввод

```js
import type { ExperimentFlag } from '.';
import { selectDeliveryDate } from '../../selectors';
```

Вывод

```js
import { selectDeliveryDate } from '../../selectors';

import type { ExperimentFlag } from '.';
```

### Пример 3

Ввод

```js
import { selectDeliveryDate } from '../../selectors';
import { calcDeliveryDate } from './helpers';
import type { ExperimentFlag } from '.';
```

Вывод

```js
import { selectDeliveryDate } from '../../selectors';

import type { ExperimentFlag } from '.';
import { calcDeliveryDate } from './helpers';
```

### Пример 4

Ввод

```js
import { call } from 'typed-redux-saga';
import { ClientBus, subscribe } from '@yandex-nirvana/bus';
```

Вывод

```js
import { ClientBus, subscribe } from '@yandex-nirvana/bus';

import { call } from 'typed-redux-saga';
```

### Пример 5

Ввод

```js
import { ClientBus, subscribe } from '@yandex-nirvana/bus';

import { call } from 'typed-redux-saga';

import { selectDeliveryDate } from '../../selectors';

import { calcDeliveryDate } from './helpers';
```

Вывод

```js
import { ClientBus, subscribe } from '@yandex-nirvana/bus';

import { call } from 'typed-redux-saga';

import { selectDeliveryDate } from '../../selectors';

import { calcDeliveryDate } from './helpers';
```

### Пример 6

Ввод

```js
import { pluralize } from '../../../../lib/utils';

import { call } from 'typed-redux-saga';
```

Вывод

```js
import { call } from 'typed-redux-saga';

import { pluralize } from '../../../../lib/utils';
```

### Пример 7

Ввод

```js
import fs from 'fs';
const dynamic = import("my-dynamic-import");
import \_ from 'lodash';
import path from 'path';
```

Вывод

```js
import fs from 'fs';
import \_ from 'lodash';
import path from 'path';

const dynamic = import("my-dynamic-import");
```

### Пример 8

Ввод

```js
import {pluralize} from "../../../../lib/utils";
import {calcDeliveryDate} from './helpers';
import {defaultConfig} from "@shri2023/config";
import \_ from 'lodash';
```

Вывод

```js
import {defaultConfig} from "@shri2023/config";

import \_ from 'lodash';

import {pluralize} from "../../../../lib/utils";

import {calcDeliveryDate} from './helpers';
```

### Пример 9

Ввод

```js
import { hermione } from '@yandex';
import { solutions } from '@shri2023/solutions';
import { serviceSlug } from '@abc';
```

Вывод

```js
import { serviceSlug } from '@abc';
import { solutions } from '@shri2023/solutions';
import { hermione } from '@yandex';
```

### Пример 10

Ввод

```js
import {relative} from "../../relative-package";

// This module is imported for commons good
import \* as lodash from "lodash";
```

Вывод

```js
// This module is imported for commons good
import \* as lodash from "lodash";

import {relative} from "../../relative-package";
```

### Пример 11

Ввод

```js
import { relative } from '../../relative-package';

/**
 * This module is imported
 * for commons good
 */
import * as lodash from 'lodash';
```

Вывод

```js
/**
 * This module is imported
 * for commons good
 */
import * as lodash from 'lodash';

import { relative } from '../../relative-package';
```

### Пример 12

Ввод

```js
// This module is imported for commons good
// This module is imported for commons good
// This module is imported for commons good
import {relative} from "../../relative-package";
import \* as lodash from "lodash";
```

Вывод

```js
import \* as lodash from "lodash";

// This module is imported for commons good
// This module is imported for commons good
// This module is imported for commons good
import {relative} from "../../relative-package";
```

### Пример 13

Ввод

```js
import \_ from 'lodash';

import fs from 'fs';

import path from 'path';

if(true) {
const dynamic = import("my-dynamic-import");
const dynamic2 = import("my-dynamic-import2");
}

```

Вывод

```js
import fs from 'fs';
import \_ from 'lodash';
import path from 'path';

if(true) {
const dynamic = import("my-dynamic-import");
const dynamic2 = import("my-dynamic-import2");
}
```
