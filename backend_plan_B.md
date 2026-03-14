# Backend Plan B --- AI Processing & Verification

Owner: Backend Developer B

## Responsibilities

-   Bytez API integration
-   Medical entity extraction
-   Claim verification with OpenFDA
-   Credibility scoring
-   Insight generation

## Folder Structure

    backend-ai/
    │
    ├── src/
    │   ├── config/
    │   │   ├── bytez.js
    │   │   └── openfda.js
    │   │
    │   ├── services/
    │   │   ├── entityExtraction.service.js
    │   │   ├── verification.service.js
    │   │   └── credibility.service.js
    │   │
    │   ├── controllers/
    │   │   ├── extract.controller.js
    │   │   └── verify.controller.js
    │   │
    │   ├── routes/
    │   │   ├── extract.routes.js
    │   │   └── verify.routes.js
    │   │
    │   ├── utils/
    │   │   └── medicalParser.js
    │   │
    │   └── app.js
    │
    ├── .env
    └── package.json

## AI Pipeline

Comments (MongoDB) ↓ Bytez API ↓ Entity Extraction ↓ OpenFDA
Verification ↓ Credibility Score ↓ Store Insights

## API Routes

### POST /api/extract

Run entity extraction on comment.

Example:

``` json
{
  "comment_id": "abc123"
}
```

Response:

``` json
{
  "drug": "Accutane",
  "side_effect": "dry lips",
  "dosage": "20mg",
  "timeline_marker": "Week 2"
}
```

### POST /api/verify

Verify claim with OpenFDA.

Example request:

``` json
{
  "drug": "Accutane",
  "side_effect": "dry lips"
}
```

Example response:

``` json
{
  "verified": true,
  "credibility_score": 0.82
}
```

## Credibility Score Formula

score = 0.5 \* FDA_match + 0.3 \* Reddit_frequency + 0.2 \*
upvote_weight

## Dependencies

-   express
-   axios
-   mongoose
-   dotenv
