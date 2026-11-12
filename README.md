# CodeX AI Proxy

Прокси‑сервис для генерации текста и потоковой выдачи.

URL для использования: `http://llm.codex.so`  
Интерактивная документация: `GET /docs`


## Аутентификация
Для всех API‑методов требуется API‑ключ в заголовке:
- `x-api-key: <ВАШ_API_КЛЮЧ>`

API‑ключ выдаётся администратором сервиса.


## Лимиты
На каждый API‑ключ действует лимит обращений. При превышении вернётся:

```json
{
  "error": "limit exceeded",
  "used": 123,
  "limit": 100
}
```

Коды ошибок:
- 400: передано неизвестное имя модели
  ```json
  {
    "error": "unknown model",
    "models": ["openai/gpt-5-mini", "anthropic/claude-sonnet-5.5"]
  }
  ```
  В `models` приходит полный список допустимых id.
- 401: отсутствует API‑ключ
- 403: недействительный API‑ключ
- 429: превышен лимит


## Ручки


### GET /models
- **Назначение**: список моделей, которые можно передать в `model`
- **Заголовки**: `x-api-key: <ключ>`
- **Ответ 200**:
  ```json
  {
    "default": "openai/gpt-5-mini",
    "models": [
      {
        "id": "openai/gpt-5-mini",
        "name": "GPT-5 mini",
        "pricing": { "input": 0.25, "output": 2, "cacheRead": 0.025 }
      }
    ]
  }
  ```
  `default` — модель сервера (`MODEL`). Она используется, если в запросе нет `model`.

  `pricing` — стандартная цена в USD за 1 млн токенов: `input`, `output`, `cacheRead`. `cacheWrite` есть только у моделей, где запись в кэш тарифицируется отдельно. Регион, priority, flex и повышенная ставка длинного контекста в эти числа не входят.

Доступные id:

| id | модель |
| --- | --- |
| `openai/gpt-5-mini` | GPT-5 mini, модель по умолчанию |
| `openai/gpt-5.4` | GPT 5.4 |
| `openai/gpt-6.1-terra` | GPT-6.1 Terra |
| `anthropic/claude-haiku-5.5` | Claude Haiku 5.5 |
| `anthropic/claude-sonnet-5.5` | Claude Sonnet 5.5 |
| `anthropic/claude-opus-5.5` | Claude Opus 5.5 |
| `google/gemini-4-argon` | Gemini 4 Argon |
| `deepseek/deepseek-v4-flash` | DeepSeek V4 Flash |
| `moonshotai/kimi-k3` | Kimi K3 |
| `spacexai/grok-4.7` | Grok 4.7 |


### POST /generate
- **Назначение**: синхронная генерация текста
- **Заголовки**:
  - `x-api-key: <ключ>`
  - `Content-Type: application/json`
- **Тело запроса**:
  - `prompt` (string, обязательно) — текст запроса/инструкции
  - `model` (string, необязательно) — id из `GET /models`. Без поля используется модель сервера
- **Ответ 200**:
  ```json
  {
    "text": "Сгенерированный текст",
    "usage": {
      "inputTokens": 12,
      "outputTokens": 34,
      "totalTokens": 46
    }
  }
  ```
  `usage` — расход токенов по данным провайдера. `reasoningTokens` и `cachedInputTokens` приходят только если провайдер их сообщает. Отдельные счётчики могут отсутствовать.
- **Ошибки**: `400`, `401`, `403`, `429`

Пример:

```bash
curl -X POST "http://llm.codex.so/generate" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"prompt":"Напиши приветственное сообщение"}'
```

С выбором модели:

```bash
curl -X POST "http://llm.codex.so/generate" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"prompt":"Напиши приветственное сообщение","model":"anthropic/claude-sonnet-5.5"}'
```


### POST /stream
- **Назначение**: потоковая генерация текста (NDJSON)
- **Заголовки**:
  - `x-api-key: <ключ>`
  - `Content-Type: application/json`
  - `Accept: application/x-ndjson` (обязательно)
- **Тело запроса**:
  - `prompt` (string, обязательно) — текст запроса/инструкции
  - `model` (string, необязательно) — id из `GET /models`. Без поля используется модель сервера
- **Ответ 200**: поток NDJSON (`Content-Type: application/x-ndjson; charset=utf-8`) — каждая строка это отдельное JSON‑событие.
- **Ошибки**: `400`, `401`, `403`, `429`, `406` (если `Accept` не равен `application/x-ndjson`)

События (строки NDJSON):
- `start` — начало обработки
- `text-start` — начало вывода текста
- `text-delta` — порция сгенерированного текста: `{ "type": "text-delta", "delta": "<текст>" }`
- `text-end` — завершение вывода текста
- `reasoning-start` — начало рассуждений (если поддерживается моделью)
- `reasoning-delta` — порция рассуждений: `{ "type": "reasoning-delta", "delta": "<reasoning>" }`
- `reasoning-end` — завершение рассуждений
- `finish` — завершение обработки. Содержит `usage` с тем же набором полей, что и `POST /generate`

Пример запроса (curl):

```bash
curl -N -X POST "http://llm.codex.so/stream" \
  -H "Content-Type: application/json" \
  -H "Accept: application/x-ndjson" \
  -H "x-api-key: $API_KEY" \
  -d '{"prompt":"Поясни, что такое поток NDJSON и как его читать","model":"google/gemini-4-argon"}'
```

Пример ответа (фрагмент, по одной JSON‑строке на событие):

```json
{"type":"start"}
{"type":"text-start"}
{"type":"text-delta","delta":"Привет! "}
{"type":"text-delta","delta":"NDJSON — это формат, в котором "}
{"type":"text-end"}
{"type":"finish","usage":{"inputTokens":12,"outputTokens":34,"totalTokens":46}}
```
