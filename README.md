# Transaction Payment Splitting Service

This API service has been carefully designed to streamline the calculation of amounts owed for one or multiple split payment entities. It guarantees a precise determination of the remaining amount after all splits have been accurately computed.

## Prerequisites

Before running the script, ensure you have the following dependencies installed:

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone this repository:

```bash
    git clone https://github.com/your-username/split-payments-service.git
    cd split-payments-service
```

2. Install the required packages:

   ```bash
    npm install
   ```

3. Start the app:

   ```bash
    npm run start
   ```

## Usage

### Endpoint

The API service exposes a single HTTP POST endpoint:

- `/split-payments/compute`

### Request Example

Send a POST request to the endpoint with a JSON payload:

```json
{
  "ID": 1308,
  "Amount": 12580,
  "Currency": "NGN",
  "CustomerEmail": "anon8@customers.io",
  "SplitInfo": [
    {
      "SplitType": "FLAT",
      "SplitValue": 45,
      "SplitEntityId": "SCRACC0019"
    },
    {
      "SplitType": "RATIO",
      "SplitValue": 3,
      "SplitEntityId": "SCRACC0011"
    },
    {
      "SplitType": "PERCENTAGE",
      "SplitValue": 3,
      "SplitEntityId": "SCRDACC0015"
    }
  ]
}
```

### Response Example

```json
{
  "ID": 1308,
  "Balance": 0,
  "SplitBreakdown": [
    {
      "SplitEntityId": "SCRACC0019",
      "Amount": 45
    },
    {
      "SplitEntityId": "SCRDACC0015",
      "Amount": 376.05
    },
    {
      "SplitEntityId": "SCRACC0011",
      "Amount": 12158.95
    }
  ]
}
```

## Rules and Constraints

- Rule 1: Each split calculation is based on the balance after the previous calculation.
- Rule 2: Order of precedence - FLAT types before PERCENTAGE or RATIO types, PERCENTAGE types before RATIO types, and RATIO types computed last.
- Constraints:
  - SplitInfo array: Minimum 1 entity, maximum 20 entities.
  - Final Balance: Cannot be less than 0.
  - Split Amount value: Cannot be greater than the transaction Amount.
  - Split Amount value: Cannot be less than 0.
  - Sum of all split Amount values: Cannot be greater than the transaction Amount.
  - API response time: Should not be more than 100ms.

## Contributing

Contributions are welcome! If you have improvements or additional features to suggest, please create an issue or submit a pull request.

## License

This script is licensed under the [MIT License]("https://github.com/obinnafranklinduru/transaction-payment-splitting-service/blob/main/LICENSE").
